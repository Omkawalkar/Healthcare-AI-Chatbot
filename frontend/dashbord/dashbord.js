
tailwind.config = {
        darkMode: "class",
        theme: {
                extend: {
                        "colors": {
                                "primary-fixed-dim": "#b4c5ff",
                                "surface-dim": "#cbdbf5",
                                "surface-bright": "#f8f9ff",
                                "inverse-on-surface": "#eaf1ff",
                                "surface-container-high": "#dce9ff",
                                "outline-variant": "#c3c6d7",
                                "on-secondary-container": "#00714d",
                                "secondary-fixed": "#6ffbbe",
                                "surface": "#f8f9ff",
                                "surface-tint": "#0053db",
                                "error": "#ba1a1a",
                                "tertiary-fixed": "#abf0e3",
                                "tertiary-container": "#34786e",
                                "primary-fixed": "#dbe1ff",
                                "on-tertiary": "#ffffff",
                                "background": "#f8f9ff",
                                "surface-container": "#e5eeff",
                                "tertiary-fixed-dim": "#90d3c7",
                                "on-tertiary-container": "#b9fef1",
                                "inverse-surface": "#213145",
                                "outline": "#737686",
                                "on-secondary-fixed-variant": "#005236",
                                "on-background": "#0b1c30",
                                "surface-container-lowest": "#ffffff",
                                "error-container": "#ffdad6",
                                "primary": "#004ac6",
                                "on-primary-fixed": "#00174b",
                                "surface-container-low": "#eff4ff",
                                "on-error": "#ffffff",
                                "on-secondary-fixed": "#002113",
                                "surface-container-highest": "#d3e4fe",
                                "on-error-container": "#93000a",
                                "secondary": "#006c49",
                                "inverse-primary": "#b4c5ff",
                                "primary-container": "#2563eb",
                                "on-primary": "#ffffff",
                                "secondary-fixed-dim": "#4edea3",
                                "on-tertiary-fixed": "#00201c",
                                "secondary-container": "#6cf8bb",
                                "tertiary": "#155f56",
                                "on-surface": "#0b1c30",
                                "on-secondary": "#ffffff",
                                "on-primary-container": "#eeefff",
                                "on-primary-fixed-variant": "#003ea8",
                                "surface-variant": "#d3e4fe",
                                "on-surface-variant": "#434655",
                                "on-tertiary-fixed-variant": "#005048"
                        },
                        "borderRadius": {
                                "DEFAULT": "0.25rem",
                                "lg": "0.5rem",
                                "xl": "0.75rem",
                                "full": "9999px"
                        },
                        "spacing": {
                                "base": "8px",
                                "xs": "4px",
                                "lg": "40px",
                                "xl": "64px",
                                "md": "24px",
                                "gutter": "24px",
                                "sm": "12px",
                                "margin": "32px"
                        },
                        "fontFamily": {
                                "label-md": ["Inter"],
                                "body-lg": ["Inter"],
                                "body-sm": ["Inter"],
                                "body-md": ["Inter"],
                                "headline-lg": ["Inter"],
                                "title-lg": ["Inter"],
                                "label-sm": ["Inter"],
                                "headline-md": ["Inter"],
                                "display-lg": ["Inter"]
                        }
                },
        },
}



// Micro-interactions for buttons
document.querySelectorAll('button').forEach(button => {
        button.addEventListener('mousedown', () => button.classList.add('scale-95', 'opacity-80'));
        button.addEventListener('mouseup', () => button.classList.remove('scale-95', 'opacity-80'));
        button.addEventListener('mouseleave', () => button.classList.remove('scale-95', 'opacity-80'));
});

// Chat Input Focus Animation
const chatInput = document.querySelector('input[placeholder="Ask your AI Health Assistant..."]');
chatInput.addEventListener('focus', () => {
        chatInput.parentElement.classList.add('shadow-xl');
});
chatInput.addEventListener('blur', () => {
        chatInput.parentElement.classList.remove('shadow-xl');
});


// BookAppointment button
// Add this to dashbord.js
document.addEventListener('DOMContentLoaded', function () {
        // Find all "Book Appointment" buttons and add click handlers
        const bookButtons = document.querySelectorAll('button:has(span:contains("Book Appointment"))');
        // Or use a more specific selector based on your button structure
        const bookButtonsAlt = document.querySelectorAll('button');
        bookButtonsAlt.forEach(button => {
                if (button.textContent.trim().includes('Book Appointment')) {
                        button.addEventListener('click', function () {
                                window.location.href = '../bookAppointment/bookAppointment.html';
                        });
                }
        });
});
