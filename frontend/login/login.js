             tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "on-secondary-container": "#00714d",
                        "tertiary": "#155f56",
                        "outline": "#737686",
                        "on-error": "#ffffff",
                        "surface-dim": "#cbdbf5",
                        "on-primary-fixed-variant": "#003ea8",
                        "on-tertiary": "#ffffff",
                        "inverse-on-surface": "#eaf1ff",
                        "primary-fixed-dim": "#b4c5ff",
                        "on-tertiary-fixed": "#00201c",
                        "surface-container-highest": "#d3e4fe",
                        "surface": "#f8f9ff",
                        "primary-fixed": "#dbe1ff",
                        "tertiary-fixed": "#abf0e3",
                        "surface-tint": "#0053db",
                        "surface-bright": "#f8f9ff",
                        "on-primary-fixed": "#00174b",
                        "on-tertiary-fixed-variant": "#005048",
                        "on-secondary": "#ffffff",
                        "secondary-fixed-dim": "#4edea3",
                        "on-tertiary-container": "#b9fef1",
                        "inverse-surface": "#213145",
                        "on-secondary-fixed": "#002113",
                        "on-surface": "#0b1c30",
                        "on-primary": "#ffffff",
                        "on-surface-variant": "#434655",
                        "secondary-container": "#6cf8bb",
                        "primary-container": "#2563eb",
                        "error-container": "#ffdad6",
                        "secondary": "#006c49",
                        "error": "#ba1a1a",
                        "surface-container-low": "#eff4ff",
                        "surface-container": "#e5eeff",
                        "on-background": "#0b1c30",
                        "surface-variant": "#d3e4fe",
                        "surface-container-high": "#dce9ff",
                        "tertiary-fixed-dim": "#90d3c7",
                        "primary": "#004ac6",
                        "outline-variant": "#c3c6d7",
                        "surface-container-lowest": "#ffffff",
                        "secondary-fixed": "#6ffbbe",
                        "inverse-primary": "#b4c5ff",
                        "on-secondary-fixed-variant": "#005236",
                        "on-primary-container": "#eeefff",
                        "tertiary-container": "#34786e",
                        "on-error-container": "#93000a",
                        "background": "#f8f9ff"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "spacing": {
                        "gutter": "24px",
                        "xs": "4px",
                        "base": "8px",
                        "xl": "64px",
                        "margin": "32px",
                        "sm": "12px",
                        "md": "24px",
                        "lg": "40px"
                    },
                    "fontFamily": {
                        "headline-lg": ["Inter"],
                        "headline-lg-mobile": ["Inter"],
                        "label-sm": ["Inter"],
                        "title-lg": ["Inter"],
                        "body-sm": ["Inter"],
                        "body-lg": ["Inter"],
                        "body-md": ["Inter"],
                        "label-md": ["Inter"],
                        "headline-md": ["Inter"],
                        "display-lg": ["Inter"]
                    },
                    "fontSize": {
                        "headline-lg": ["32px", {"lineHeight": "40px", "letterSpacing": "-0.01em", "fontWeight": "600"}],
                        "headline-lg-mobile": ["28px", {"lineHeight": "36px", "fontWeight": "600"}],
                        "label-sm": ["12px", {"lineHeight": "14px", "fontWeight": "500"}],
                        "title-lg": ["20px", {"lineHeight": "28px", "fontWeight": "500"}],
                        "body-sm": ["14px", {"lineHeight": "20px", "fontWeight": "400"}],
                        "body-lg": ["18px", {"lineHeight": "28px", "fontWeight": "400"}],
                        "body-md": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
                        "label-md": ["14px", {"lineHeight": "16px", "letterSpacing": "0.01em", "fontWeight": "600"}],
                        "headline-md": ["24px", {"lineHeight": "32px", "fontWeight": "600"}],
                        "display-lg": ["48px", {"lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "700"}]
                    }
                },
            },
        }
      
      // Simple Interaction logic
        const loginForm = document.querySelector('form');
        const toast = document.getElementById('login-toast');

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Show toast
            toast.classList.remove('translate-y-24', 'opacity-0');
            toast.classList.add('translate-y-0', 'opacity-100');
            
            // Simulation of redirect
            setTimeout(() => {
                toast.classList.add('translate-y-24', 'opacity-0');
            }, 3000);
        });

        // Toggle Password visibility
        const togglePassBtn = document.querySelector('button[type="button"]');
        const passInput = document.getElementById('password');
        togglePassBtn.addEventListener('click', () => {
            const isPassword = passInput.type === 'password';
            passInput.type = isPassword ? 'text' : 'password';
            togglePassBtn.children[0].textContent = isPassword ? 'visibility_off' : 'visibility';
        });