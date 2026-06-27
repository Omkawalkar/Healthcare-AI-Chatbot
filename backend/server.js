const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'healthcore_ai',
    password: process.env.DB_PASSWORD || 'your_password',
    port: process.env.DB_PORT || 5432,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Test database connection
pool.connect((err, client, release) => {
    if (err) {
        console.error('❌ Error connecting to PostgreSQL:', err.stack);
    } else {
        console.log('✅ Connected to PostgreSQL database');
        release();
    }
});

// ==================== CHATBOT ENGINE ====================
class ChatbotEngine {
    constructor() {
        this.sessions = new Map();
        this.intents = {
            BOOK_APPOINTMENT: 'book_appointment',
            CANCEL_APPOINTMENT: 'cancel_appointment',
            VIEW_APPOINTMENTS: 'view_appointments',
            CHECK_AVAILABILITY: 'check_availability',
            HELP: 'help',
            CONFIRM_BOOKING: 'confirm_booking',
            CONFIRM_CANCELLATION: 'confirm_cancellation',
            GREETING: 'greeting',
            GENERAL: 'general'
        };
    }

    async processMessage(message, sessionId, userEmail) {
        const msg = message.toLowerCase().trim();
        const session = this.getOrCreateSession(sessionId, userEmail);
        
        if (userEmail && !session.userEmail) {
            session.userEmail = userEmail;
            session.user = await this.getUserByEmail(userEmail);
        }

        if (this.detectBookingIntent(msg)) {
            return await this.handleBookingIntent(session, msg);
        }

        if (this.detectCancellationIntent(msg)) {
            return await this.handleCancellationIntent(session, msg);
        }

        if (this.detectViewIntent(msg)) {
            return await this.handleViewIntent(session, msg);
        }

        if (this.detectAvailabilityIntent(msg)) {
            return await this.handleAvailabilityIntent(session, msg);
        }

        if (this.detectHelpIntent(msg)) {
            return this.handleHelpIntent(session);
        }

        if (this.detectGreeting(msg)) {
            return this.handleGreeting(session);
        }

        if (session.currentIntent === this.intents.CONFIRM_BOOKING) {
            return await this.handleBookingConfirmation(session, msg);
        }

        if (session.currentIntent === this.intents.CONFIRM_CANCELLATION) {
            return await this.handleCancellationConfirmation(session, msg);
        }

        if (session.currentIntent === this.intents.BOOK_APPOINTMENT) {
            const extracted = this.extractEntities(msg);
            if (extracted) {
                session.entities = { ...session.entities, ...extracted };
                return await this.handleBookingIntent(session, msg, true);
            }
        }

        return this.getDefaultResponse(session);
    }

    getOrCreateSession(sessionId, userEmail) {
        if (!this.sessions.has(sessionId)) {
            this.sessions.set(sessionId, {
                id: sessionId,
                userEmail: userEmail || null,
                user: null,
                currentIntent: null,
                entities: {},
                step: 0,
                appointmentData: {}
            });
        }
        return this.sessions.get(sessionId);
    }

    async getUserByEmail(email) {
        try {
            const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            return result.rows[0] || null;
        } catch (error) {
            console.error('Error fetching user:', error);
            return null;
        }
    }

    detectBookingIntent(msg) {
        const keywords = ['book', 'appointment', 'schedule', 'consult', 'visit', 'see doctor', 'make appointment'];
        return keywords.some(keyword => msg.includes(keyword)) && 
               (msg.includes('appointment') || msg.includes('doctor') || msg.includes('consult'));
    }

    detectCancellationIntent(msg) {
        const keywords = ['cancel', 'remove', 'delete'];
        return keywords.some(keyword => msg.includes(keyword)) && msg.includes('appointment');
    }

    detectViewIntent(msg) {
        const keywords = ['view', 'show', 'my', 'see', 'list'];
        return keywords.some(keyword => msg.includes(keyword)) && msg.includes('appointment');
    }

    detectAvailabilityIntent(msg) {
        const keywords = ['available', 'free', 'when'];
        return keywords.some(keyword => msg.includes(keyword)) && 
               (msg.includes('doctor') || msg.includes('slot'));
    }

    detectHelpIntent(msg) {
        const keywords = ['help', 'what can you do', 'how to', 'support'];
        return keywords.some(keyword => msg.includes(keyword));
    }

    detectGreeting(msg) {
        const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'];
        return greetings.some(g => msg.includes(g));
    }

    async handleBookingIntent(session, msg, isContinuation = false) {
        session.currentIntent = this.intents.BOOK_APPOINTMENT;
        
        const entities = this.extractEntities(msg);
        if (entities) {
            session.entities = { ...session.entities, ...entities };
        }

        const hasName = session.entities.name || session.user?.name;
        const hasEmail = session.entities.email || session.user?.email;
        const hasPhone = session.entities.phone || session.user?.phone;
        const hasDoctor = session.entities.doctor;
        const hasDate = session.entities.date;
        const hasTime = session.entities.time;
        const hasReason = session.entities.reason;

        if (hasName && hasEmail && hasPhone && hasDoctor && hasDate && hasTime) {
            session.currentIntent = this.intents.CONFIRM_BOOKING;
            return {
                text: this.formatBookingConfirmation(session.entities),
                intent: this.intents.CONFIRM_BOOKING,
                action: 'confirm_booking',
                data: session.entities,
                requiresAction: true
            };
        }

        let question = "I'll help you book an appointment. Please provide:\n\n";
        let missing = [];

        if (!hasName) missing.push("📝 Your full name");
        if (!hasEmail) missing.push("📧 Your email address");
        if (!hasPhone) missing.push("📱 Your phone number");
        if (!hasDoctor) {
            const doctors = await this.getAvailableDoctors();
            const doctorList = doctors.map(d => `• ${d.name} - ${d.specialty}`).join('\n');
            missing.push(`👨‍⚕️ Preferred doctor (available doctors:\n${doctorList})`);
        }
        if (!hasDate) missing.push("📅 Preferred date (YYYY-MM-DD)");
        if (!hasTime) missing.push("⏰ Preferred time (HH:MM)");
        if (!hasReason) missing.push("💊 Reason for visit");

        if (missing.length > 0) {
            return {
                text: question + missing.join('\n') + '\n\nPlease provide these details one by one.',
                intent: this.intents.BOOK_APPOINTMENT,
                action: 'collect_info',
                data: session.entities
            };
        }

        return this.getDefaultResponse(session);
    }

    extractEntities(msg) {
        const entities = {};
        
        const nameMatch = msg.match(/(?:my name is |name is |i am |i\'m )([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
        if (nameMatch) entities.name = nameMatch[1];

        const emailMatch = msg.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
        if (emailMatch) entities.email = emailMatch[0];

        const phoneMatch = msg.match(/(\d{10}|\d{3}[-.]?\d{3}[-.]?\d{4}|\(\d{3}\)\s*\d{3}[-.]?\d{4})/);
        if (phoneMatch) entities.phone = phoneMatch[1];

        const doctors = ['sarah johnson', 'michael chen', 'emily rodriguez', 'james wilson'];
        for (const doctor of doctors) {
            if (msg.toLowerCase().includes(doctor)) {
                entities.doctor = doctor;
                break;
            }
        }

        const dateMatch = msg.match(/(\d{4}-\d{2}-\d{2})|(\d{2}\/\d{2}\/\d{4})/);
        if (dateMatch) entities.date = dateMatch[0];

        const timeMatch = msg.match(/(\d{1,2}:\d{2})\s*(?:AM|PM|am|pm)?/);
        if (timeMatch) entities.time = timeMatch[1];

        const reasonMatch = msg.match(/(?:reason|because|for)\s+(.+?)(?:\.|$)/i);
        if (reasonMatch) entities.reason = reasonMatch[1].trim();

        return Object.keys(entities).length > 0 ? entities : null;
    }

    formatBookingConfirmation(entities) {
        return `📋 **Appointment Summary**\n\n` +
               `👤 Name: ${entities.name}\n` +
               `📧 Email: ${entities.email}\n` +
               `📱 Phone: ${entities.phone}\n` +
               `👨‍⚕️ Doctor: ${entities.doctor}\n` +
               `📅 Date: ${entities.date}\n` +
               `⏰ Time: ${entities.time}\n` +
               `💊 Reason: ${entities.reason || 'Not specified'}\n\n` +
               `✅ Should I book this appointment for you? (Reply "yes" to confirm)`;
    }

    async handleBookingConfirmation(session, msg) {
        if (msg.includes('yes') || msg.includes('confirm') || msg.includes('book')) {
            try {
                // Check if we have all required data
                if (!session.entities || !session.entities.name || !session.entities.email) {
                    return {
                        text: "❌ I'm missing some information. Let's start over. Please tell me your name, email, and other details.",
                        intent: this.intents.BOOK_APPOINTMENT
                    };
                }

                // Get or create user
                let user = session.user;
                if (!user) {
                    // Check if user already exists
                    const existingUser = await pool.query(
                        'SELECT * FROM users WHERE email = $1',
                        [session.entities.email]
                    );
                    
                    if (existingUser.rows.length > 0) {
                        user = existingUser.rows[0];
                    } else {
                        // Create new user
                        const userResult = await pool.query(
                            'INSERT INTO users (name, email, phone) VALUES ($1, $2, $3) RETURNING *',
                            [session.entities.name, session.entities.email, session.entities.phone || null]
                        );
                        user = userResult.rows[0];
                    }
                    session.user = user;
                }

                // Get doctor
                const doctorResult = await pool.query(
                    'SELECT * FROM doctors WHERE LOWER(name) LIKE $1',
                    [`%${session.entities.doctor.toLowerCase()}%`]
                );
                
                if (doctorResult.rows.length === 0) {
                    return {
                        text: "❌ I couldn't find that doctor. Please try booking again with a different doctor.",
                        intent: this.intents.GENERAL
                    };
                }

                const doctor = doctorResult.rows[0];
                const doctorId = doctor.id;

                // Check if slot is available
                const checkResult = await pool.query(
                    `SELECT * FROM appointments 
                     WHERE doctor_id = $1 AND appointment_date = $2 AND appointment_time = $3
                     AND status != 'cancelled'`,
                    [doctorId, session.entities.date, session.entities.time]
                );

                if (checkResult.rows.length > 0) {
                    return {
                        text: "❌ This time slot is already booked. Please choose a different time or date.",
                        intent: this.intents.BOOK_APPOINTMENT,
                        action: 'retry_booking'
                    };
                }

                // Book appointment
                const result = await pool.query(
                    `INSERT INTO appointments (user_id, doctor_id, appointment_date, appointment_time, reason)
                     VALUES ($1, $2, $3, $4, $5) RETURNING id, appointment_date, appointment_time`,
                    [user.id, doctorId, session.entities.date, session.entities.time, session.entities.reason || '']
                );

                // Save conversation
                await pool.query(
                    `INSERT INTO conversations (user_id, session_id, message, response, intent, entities)
                     VALUES ($1, $2, $3, $4, $5, $6)`,
                    [user.id, session.id, 'Book appointment confirmed', 
                     `Appointment booked successfully! ID: ${result.rows[0].id}`,
                     this.intents.CONFIRM_BOOKING, JSON.stringify(session.entities)]
                );

                // Store booking data for response
                const bookingData = {
                    appointmentId: result.rows[0].id,
                    doctor: doctor.name,
                    date: session.entities.date,
                    time: session.entities.time,
                    email: session.entities.email,
                    name: session.entities.name,
                    phone: session.entities.phone || 'N/A',
                    reason: session.entities.reason || 'Not specified'
                };

                // Reset session but keep user data
                const userData = session.user;
                const userEmailData = session.userEmail;
                session.currentIntent = null;
                session.entities = {};
                session.user = userData;
                session.userEmail = userEmailData;

                return {
                    text: `✅ **Appointment Booked Successfully!**\n\n` +
                          `📋 Appointment ID: #${bookingData.appointmentId}\n` +
                          `👤 Patient: ${bookingData.name}\n` +
                          `📧 Email: ${bookingData.email}\n` +
                          `📱 Phone: ${bookingData.phone}\n` +
                          `👨‍⚕️ Doctor: ${bookingData.doctor}\n` +
                          `📅 Date: ${bookingData.date}\n` +
                          `⏰ Time: ${bookingData.time}\n` +
                          `💊 Reason: ${bookingData.reason}\n\n` +
                          `A confirmation has been sent to ${bookingData.email}.\n\n` +
                          `Is there anything else I can help you with?`,
                    intent: this.intents.GENERAL,
                    action: 'booking_complete',
                    data: bookingData
                };

            } catch (error) {
                console.error('Booking error:', error);
                return {
                    text: "❌ I'm sorry, I encountered an error while booking your appointment. Please try again.",
                    intent: this.intents.GENERAL
                };
            }
        } else if (msg.includes('no') || msg.includes('cancel')) {
            session.currentIntent = null;
            session.entities = {};
            return {
                text: "Okay, I've cancelled the booking process. How else can I help you?",
                intent: this.intents.GENERAL
            };
        } else {
            return {
                text: "Please reply with 'yes' to confirm the booking or 'no' to cancel.",
                intent: this.intents.CONFIRM_BOOKING
            };
        }
    }

    async handleCancellationIntent(session, msg) {
        session.currentIntent = this.intents.CANCEL_APPOINTMENT;
        
        const idMatch = msg.match(/#?(\d{4,})/);
        
        if (!session.userEmail) {
            return {
                text: "Please provide your email address to cancel an appointment.",
                intent: this.intents.CANCEL_APPOINTMENT,
                action: 'collect_email'
            };
        }

        const appointments = await this.getUserAppointments(session.userEmail);
        
        if (appointments.length === 0) {
            session.currentIntent = null;
            return {
                text: "You don't have any upcoming appointments to cancel.",
                intent: this.intents.GENERAL
            };
        }

        if (idMatch) {
            const appointmentId = parseInt(idMatch[1]);
            const appointment = appointments.find(a => a.id === appointmentId);
            
            if (appointment) {
                session.appointmentData = appointment;
                session.currentIntent = this.intents.CONFIRM_CANCELLATION;
                return {
                    text: `Are you sure you want to cancel your appointment with ${appointment.doctor_name} on ${appointment.appointment_date} at ${appointment.appointment_time}?\n\nReply 'yes' to confirm cancellation.`,
                    intent: this.intents.CONFIRM_CANCELLATION,
                    action: 'confirm_cancellation',
                    data: { appointmentId }
                };
            }
        }

        const appointmentList = appointments.map(a => 
            `#${a.id} - ${a.doctor_name} - ${a.appointment_date} at ${a.appointment_time}`
        ).join('\n');

        return {
            text: `Here are your appointments:\n\n${appointmentList}\n\nPlease provide the appointment ID you want to cancel (e.g., #1234).`,
            intent: this.intents.CANCEL_APPOINTMENT,
            action: 'list_appointments',
            data: { appointments }
        };
    }

    async handleCancellationConfirmation(session, msg) {
        if (msg.includes('yes') || msg.includes('confirm')) {
            try {
                // Check if we have appointment data
                if (!session.appointmentData || !session.appointmentData.id) {
                    return {
                        text: "❌ I couldn't find the appointment to cancel. Please try again.",
                        intent: this.intents.GENERAL
                    };
                }

                const result = await pool.query(
                    `UPDATE appointments 
                     SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
                     WHERE id = $1 AND user_id = $2
                     RETURNING id`,
                    [session.appointmentData.id, session.user.id]
                );

                if (result.rows.length > 0) {
                    const cancelledAppointment = session.appointmentData;
                    session.currentIntent = null;
                    session.appointmentData = {};
                    
                    return {
                        text: `✅ **Appointment #${cancelledAppointment.id} Cancelled Successfully!**\n\n` +
                              `👨‍⚕️ Doctor: ${cancelledAppointment.doctor_name}\n` +
                              `📅 Date: ${cancelledAppointment.appointment_date}\n` +
                              `⏰ Time: ${cancelledAppointment.appointment_time}\n\n` +
                              `Your appointment has been cancelled. You will receive a confirmation email shortly.\n\n` +
                              `Is there anything else I can help you with?`,
                        intent: this.intents.GENERAL,
                        action: 'cancellation_complete'
                    };
                } else {
                    return {
                        text: "❌ I couldn't cancel the appointment. Please make sure you have the correct ID.",
                        intent: this.intents.GENERAL
                    };
                }
            } catch (error) {
                console.error('Cancellation error:', error);
                return {
                    text: "❌ I'm sorry, I encountered an error while cancelling your appointment. Please try again.",
                    intent: this.intents.GENERAL
                };
            }
        } else if (msg.includes('no')) {
            session.currentIntent = null;
            session.appointmentData = {};
            return {
                text: "Okay, I've kept your appointment. How else can I help you?",
                intent: this.intents.GENERAL
            };
        } else {
            return {
                text: "Please reply with 'yes' to cancel the appointment or 'no' to keep it.",
                intent: this.intents.CONFIRM_CANCELLATION
            };
        }
    }

    async handleViewIntent(session, msg) {
        if (!session.userEmail) {
            return {
                text: "Please provide your email address to view your appointments.",
                intent: this.intents.VIEW_APPOINTMENTS,
                action: 'collect_email'
            };
        }

        const appointments = await this.getUserAppointments(session.userEmail);
        
        if (appointments.length === 0) {
            return {
                text: "You don't have any upcoming appointments.",
                intent: this.intents.GENERAL
            };
        }

        const appointmentList = appointments.map((a, index) => 
            `${index + 1}. **${a.doctor_name}** (${a.specialty})\n   📅 ${a.appointment_date} at ⏰ ${a.appointment_time}\n   📋 ID: #${a.id}`
        ).join('\n\n');

        return {
            text: `📋 **Your Upcoming Appointments**\n\n${appointmentList}\n\nNeed to cancel one? Just let me know the appointment ID!`,
            intent: this.intents.GENERAL,
            action: 'view_appointments',
            data: { appointments }
        };
    }

    async handleAvailabilityIntent(session, msg) {
        const doctors = await this.getAvailableDoctors();
        const doctorList = doctors.map(d => 
            `• **${d.name}** - ${d.specialty}\n  Available: ${d.available_days.join(', ')} (${d.available_time_start} - ${d.available_time_end})\n  Fee: $${d.consultation_fee}`
        ).join('\n\n');

        return {
            text: `👨‍⚕️ **Available Doctors**\n\n${doctorList}\n\nWould you like to book an appointment with any of them?`,
            intent: this.intents.GENERAL,
            action: 'show_availability'
        };
    }

    handleHelpIntent(session) {
        return {
            text: `🤖 **I can help you with:**\n\n` +
                  `📅 **Book an appointment** - Say "I want to book an appointment"\n` +
                  `❌ **Cancel an appointment** - Say "Cancel my appointment #1234"\n` +
                  `📋 **View appointments** - Say "Show my appointments"\n` +
                  `👨‍⚕️ **Check doctor availability** - Say "Which doctors are available?"\n\n` +
                  `What would you like to do today?`,
            intent: this.intents.GENERAL
        };
    }

    handleGreeting(session) {
        const userName = session.user?.name || 'there';
        return {
            text: `👋 Hello ${userName}! I'm your HealthCore AI assistant. I can help you book, cancel, or view appointments. How can I assist you today?`,
            intent: this.intents.GREETING
        };
    }

    getDefaultResponse(session) {
        return {
            text: "I'm here to help with appointments. You can ask me to:\n\n• Book an appointment\n• Cancel an appointment\n• View your appointments\n• Check doctor availability\n• Get help\n\nWhat would you like to do?",
            intent: this.intents.GENERAL
        };
    }

    async getAvailableDoctors() {
        try {
            const result = await pool.query('SELECT * FROM doctors ORDER BY name');
            return result.rows;
        } catch (error) {
            console.error('Error fetching doctors:', error);
            return [];
        }
    }

    async getUserAppointments(email) {
        try {
            const result = await pool.query(
                `SELECT a.*, d.name as doctor_name, d.specialty
                 FROM appointments a
                 JOIN users u ON a.user_id = u.id
                 JOIN doctors d ON a.doctor_id = d.id
                 WHERE u.email = $1 AND a.status = 'scheduled'
                 ORDER BY a.appointment_date ASC, a.appointment_time ASC`,
                [email]
            );
            return result.rows;
        } catch (error) {
            console.error('Error fetching appointments:', error);
            return [];
        }
    }

    async saveConversation(userId, sessionId, message, response, intent, entities) {
        try {
            await pool.query(
                `INSERT INTO conversations (user_id, session_id, message, response, intent, entities)
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [userId, sessionId, message, response, intent, JSON.stringify(entities)]
            );
        } catch (error) {
            console.error('Error saving conversation:', error);
        }
    }
}

// Initialize chatbot engine
const chatbot = new ChatbotEngine();

// ==================== API ENDPOINTS ====================

// Chat endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message, sessionId, userEmail } = req.body;
        const session = sessionId || uuidv4();
        
        const response = await chatbot.processMessage(message, session, userEmail);
        
        try {
            const user = await chatbot.getUserByEmail(userEmail || '');
            await chatbot.saveConversation(
                user?.id || null,
                session,
                message,
                response.text,
                response.intent,
                response.data || {}
            );
        } catch (error) {
            console.error('Error saving conversation:', error);
        }
        
        res.json({
            ...response,
            sessionId: session
        });
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({
            text: "❌ I'm experiencing technical difficulties. Please try again later.",
            intent: 'error'
        });
    }
});

// Get appointments
app.get('/api/appointments/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const appointments = await chatbot.getUserAppointments(email);
        res.json(appointments);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
});

// Get doctors
app.get('/api/doctors', async (req, res) => {
    try {
        const doctors = await chatbot.getAvailableDoctors();
        res.json(doctors);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to fetch doctors' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Start server
app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
    console.log(`📊 API endpoints:`);
    console.log(`   POST /api/chat - Chat with AI assistant`);
    console.log(`   GET  /api/appointments/:email - Get user appointments`);
    console.log(`   GET  /api/doctors - Get available doctors`);
    console.log(`   GET  /api/health - Health check`);
});