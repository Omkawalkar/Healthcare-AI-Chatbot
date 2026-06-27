// ==================== TAILWIND CONFIG ====================
tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#004ac6",
                "surface": "#f8f9ff",
                "on-surface": "#0d1c2e",
                "on-surface-variant": "#434655",
                "outline": "#737686",
                "outline-variant": "#c3c6d7",
                "surface-container-low": "#eff4ff",
                "surface-container-high": "#dce9ff",
                "surface-container-highest": "#d5e3fc",
                "secondary": "#006686",
                "error": "#ba1a1a",
                "on-primary": "#ffffff",
                "on-secondary": "#ffffff",
                "primary-container": "#2563eb",
                "on-primary-container": "#eeefff",
                "secondary-container": "#7ed4fd",
                "on-secondary-container": "#005b78",
            },
            borderRadius: {
                "xl": "1rem",
                "full": "9999px"
            },
            fontFamily: {
                "body-md": ["Manrope"],
                "body-lg": ["Manrope"],
                "label-md": ["Manrope"],
            },
            fontSize: {
                "body-md": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
                "body-lg": ["18px", {"lineHeight": "28px", "fontWeight": "400"}],
                "label-md": ["14px", {"lineHeight": "20px", "letterSpacing": "0.05em", "fontWeight": "600"}],
            }
        },
    },
};

// ==================== CONFIGURATION ====================
const API_URL = 'http://localhost:5000/api/chat';
let sessionId = localStorage.getItem('chatSessionId') || generateSessionId();
let userEmail = localStorage.getItem('userEmail') || '';
let isProcessing = false;
let pendingBookingData = null;

// ==================== SESSION MANAGEMENT ====================
function generateSessionId() {
    const id = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('chatSessionId', id);
    return id;
}

// ==================== DOM ELEMENTS ====================
const chatContainer = document.getElementById('chat-container');
const chatFeed = document.getElementById('chat-feed');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const typingIndicator = document.getElementById('typing-indicator');

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Chatbot initialized');
    console.log('✅ Session ID:', sessionId);
    console.log('✅ API URL:', API_URL);
    
    // Auto-resize textarea
    userInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
        if (this.scrollHeight > 200) {
            this.style.overflowY = 'scroll';
            this.style.height = '200px';
        } else {
            this.style.overflowY = 'hidden';
        }
    });

    // Load chat history or add default greeting
    loadChatHistory();
    
    // Focus input
    setTimeout(() => userInput.focus(), 500);
});

// ==================== CHAT HISTORY ====================
function loadChatHistory() {
    const history = localStorage.getItem('chatHistory');
    if (history) {
        try {
            const messages = JSON.parse(history);
            chatContainer.innerHTML = '';
            messages.forEach(msg => {
                if (msg.type === 'user') {
                    addUserMessage(msg.text, false);
                } else {
                    addBotMessage(msg.text, false);
                }
            });
            scrollToBottom();
        } catch (e) {
            console.error('Error loading history:', e);
            addDefaultGreeting();
        }
    } else {
        addDefaultGreeting();
    }
}

function addDefaultGreeting() {
    addBotMessage(
        "👋 Hello! I'm your HealthCore AI assistant. I can help you book appointments, cancel appointments, and view your schedule. How can I help you today?",
        false
    );
}

function saveChatHistory() {
    try {
        const messages = [];
        const messageWrappers = chatContainer.querySelectorAll('.message-wrapper');
        messageWrappers.forEach(el => {
            const isUser = el.classList.contains('user');
            const textEl = el.querySelector('.message-text');
            if (textEl) {
                messages.push({ type: isUser ? 'user' : 'bot', text: textEl.textContent });
            }
        });
        localStorage.setItem('chatHistory', JSON.stringify(messages));
    } catch (e) {
        console.error('Error saving history:', e);
    }
}

// ==================== MESSAGE FUNCTIONS ====================
function addUserMessage(message, save = true) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const wrapper = document.createElement('div');
    wrapper.className = 'flex gap-4 items-start justify-end message-wrapper user fade-in';
    wrapper.innerHTML = `
        <div class="flex flex-col gap-1 max-w-[85%] md:max-w-[75%]">
            <div class="message-user bg-[#2563eb] text-white p-4 rounded-2xl font-body-lg leading-relaxed shadow-lg shadow-[#2563eb]/10 message-text" style="border-bottom-right-radius: 4px !important;">
                ${escapeHtml(message)}
            </div>
            <span class="text-[10px] text-[#9ca3af] text-right mr-1 uppercase font-bold tracking-widest">You • ${time}</span>
        </div>
        <div class="w-10 h-10 rounded-full bg-[#dbeafe] flex-shrink-0 flex items-center justify-center mt-1">
            <span class="material-symbols-outlined text-[20px] text-[#2563eb]">person</span>
        </div>
    `;
    chatContainer.appendChild(wrapper);
    
    if (save) saveChatHistory();
    scrollToBottom();
}

function addBotMessage(message, save = true) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const wrapper = document.createElement('div');
    wrapper.className = 'flex gap-4 items-start message-wrapper bot fade-in';
    wrapper.innerHTML = `
        <div class="w-10 h-10 rounded-full bg-[#e5e7eb] flex-shrink-0 flex items-center justify-center mt-1">
            <span class="material-symbols-outlined text-[20px] text-[#4b5563]">smart_toy</span>
        </div>
        <div class="flex flex-col gap-1 max-w-[85%] md:max-w-[75%]">
            <div class="message-bot bg-[#f3f4f6] text-[#1f2937] p-4 rounded-2xl font-body-lg leading-relaxed shadow-sm border border-[#e5e7eb]/30 message-text whitespace-pre-line" style="border-bottom-left-radius: 4px !important;">
                ${escapeHtml(message)}
            </div>
            <span class="text-[10px] text-[#9ca3af] ml-1 uppercase font-bold tracking-widest">Assistant • ${time}</span>
        </div>
    `;
    chatContainer.appendChild(wrapper);
    
    if (save) saveChatHistory();
    scrollToBottom();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==================== TYPING INDICATOR ====================
function showTyping(show) {
    if (show) {
        typingIndicator.classList.remove('hidden');
        scrollToBottom();
    } else {
        typingIndicator.classList.add('hidden');
    }
}

// ==================== SCROLLING ====================
function scrollToBottom() {
    setTimeout(() => {
        if (chatFeed) {
            chatFeed.scrollTop = chatFeed.scrollHeight;
        }
    }, 100);
}

// ==================== SEND MESSAGE ====================
async function sendMessage() {
    console.log('🔵 Send message called');
    
    if (isProcessing) {
        console.log('⏳ Already processing, ignoring');
        return;
    }
    
    const message = userInput.value.trim();
    if (!message) {
        console.log('⚠️ Empty message, ignoring');
        return;
    }
    
    console.log('📤 Sending message:', message);
    
    // Add user message
    addUserMessage(message);
    userInput.value = '';
    userInput.style.height = 'auto';
    
    // Show typing indicator
    showTyping(true);
    isProcessing = true;
    sendButton.disabled = true;
    
    try {
        console.log('🔄 Calling API:', API_URL);
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                sessionId: sessionId,
                userEmail: userEmail
            })
        });
        
        console.log('📥 Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📦 Response data:', data);
        
        // Save email if provided
        if (data.email) {
            userEmail = data.email;
            localStorage.setItem('userEmail', userEmail);
        }
        
        // Store booking data if present
        if (data.data && data.action === 'confirm_booking') {
            pendingBookingData = data.data;
        }
        
        // Hide typing indicator
        showTyping(false);
        
        // Add bot response
        addBotMessage(data.text);
        
        // Handle specific actions
        if (data.action === 'booking_complete') {
            if (pendingBookingData) {
                const bookingMsg = `✅ **Appointment Booked Successfully!**\n\n` +
                    `📋 Appointment ID: #${data.data?.appointmentId || 'N/A'}\n` +
                    `👨‍⚕️ Doctor: ${pendingBookingData.doctor || 'N/A'}\n` +
                    `📅 Date: ${pendingBookingData.date || 'N/A'}\n` +
                    `⏰ Time: ${pendingBookingData.time || 'N/A'}\n` +
                    `📧 Email: ${pendingBookingData.email || 'N/A'}\n\n` +
                    `Is there anything else I can help you with?`;
                
                // Replace the last bot message with detailed version
                const lastBotMsg = chatContainer.querySelector('.message-wrapper.bot:last-child .message-text');
                if (lastBotMsg) {
                    lastBotMsg.textContent = bookingMsg;
                }
                pendingBookingData = null;
            }
        }
        
        if (data.action === 'cancellation_complete') {
            setTimeout(() => {
                addBotMessage("Need anything else? I'm here to help!");
            }, 1500);
        }
        
    } catch (error) {
        console.error('❌ Error:', error);
        showTyping(false);
        addBotMessage(
            "❌ I'm having trouble connecting to the server. Please make sure:\n\n" +
            "1. The backend is running (cd backend && node server.js)\n" +
            "2. PostgreSQL is running\n" +
            "3. The database is properly configured\n\n" +
            "Error: " + error.message
        );
    }
    
    isProcessing = false;
    sendButton.disabled = false;
    userInput.focus();
}

// ==================== KEYBOARD HANDLING ====================
function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

// ==================== CLEAR CHAT ====================
function clearChat() {
    if (confirm('Are you sure you want to clear the chat history?')) {
        localStorage.removeItem('chatHistory');
        chatContainer.innerHTML = '';
        pendingBookingData = null;
        addBotMessage("🧹 Chat cleared! How can I help you today?", false);
        userInput.focus();
    }
}

// ==================== EXPOSE FUNCTIONS TO GLOBAL ====================
window.sendMessage = sendMessage;
window.clearChat = clearChat;
window.handleKeyPress = handleKeyPress;

console.log('✅ Chatbot script loaded successfully!');