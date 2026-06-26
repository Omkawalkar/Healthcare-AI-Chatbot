   tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "on-error-container": "#93000a",
                    "secondary": "#006c49",
                    "on-error": "#ffffff",
                    "secondary-fixed-dim": "#4edea3",
                    "on-tertiary-fixed": "#00201c",
                    "tertiary-container": "#34786e",
                    "surface-variant": "#d3e4fe",
                    "error": "#ba1a1a",
                    "surface-container-highest": "#d3e4fe",
                    "primary-fixed-dim": "#b4c5ff",
                    "secondary-fixed": "#6ffbbe",
                    "inverse-on-surface": "#eaf1ff",
                    "on-secondary-fixed-variant": "#005236",
                    "on-primary-fixed": "#00174b",
                    "on-background": "#0b1c30",
                    "inverse-surface": "#213145",
                    "on-primary": "#ffffff",
                    "surface-container-high": "#dce9ff",
                    "surface-container": "#e5eeff",
                    "on-secondary": "#ffffff",
                    "on-primary-fixed-variant": "#003ea8",
                    "background": "#f8f9ff",
                    "outline": "#737686",
                    "tertiary": "#155f56",
                    "outline-variant": "#c3c6d7",
                    "on-tertiary": "#ffffff",
                    "error-container": "#ffdad6",
                    "surface-bright": "#f8f9ff",
                    "primary-fixed": "#dbe1ff",
                    "on-surface": "#0b1c30",
                    "on-surface-variant": "#434655",
                    "surface-container-lowest": "#ffffff",
                    "primary-container": "#2563eb",
                    "on-secondary-container": "#00714d",
                    "tertiary-fixed": "#abf0e3",
                    "primary": "#004ac6",
                    "inverse-primary": "#b4c5ff",
                    "on-tertiary-fixed-variant": "#005048",
                    "on-tertiary-container": "#b9fef1",
                    "surface-dim": "#cbdbf5",
                    "on-primary-container": "#eeefff",
                    "surface-container-low": "#eff4ff",
                    "surface": "#f8f9ff",
                    "tertiary-fixed-dim": "#90d3c7",
                    "surface-tint": "#0053db",
                    "secondary-container": "#6cf8bb",
                    "on-secondary-fixed": "#002113"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "8px",
                    "xl": "16px",
                    "full": "9999px"
            },
            "spacing": {
                    "xl": "64px",
                    "md": "24px",
                    "xs": "4px",
                    "lg": "40px",
                    "base": "8px",
                    "gutter": "24px",
                    "margin": "32px",
                    "sm": "12px"
            },
            "fontFamily": {
                    "label-md": ["Inter"],
                    "headline-lg-mobile": ["Inter"],
                    "body-md": ["Inter"],
                    "headline-md": ["Inter"],
                    "body-lg": ["Inter"],
                    "title-lg": ["Inter"],
                    "display-lg": ["Inter"],
                    "label-sm": ["Inter"],
                    "headline-lg": ["Inter"],
                    "body-sm": ["Inter"]
            },
          }
        }
      }

        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes ripple {
                to {
                    transform: scale(20);
                    opacity: 0;
                }
            }
            .active-tab {
                position: relative;
            }
            .active-tab::after {
                content: '';
                position: absolute;
                bottom: -2px;
                left: 0;
                right: 0;
                height: 2px;
                background: currentColor;
            }
        `;
        document.head.appendChild(style);