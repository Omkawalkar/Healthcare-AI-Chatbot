    
    
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "error": "#ba1a1a",
                    "surface-container": "#e5eeff",
                    "error-container": "#ffdad6",
                    "primary-fixed": "#dbe1ff",
                    "secondary-container": "#6cf8bb",
                    "surface-container-low": "#eff4ff",
                    "secondary-fixed": "#6ffbbe",
                    "primary": "#004ac6",
                    "on-surface": "#0b1c30",
                    "on-error": "#ffffff",
                    "surface-tint": "#0053db",
                    "primary-container": "#2563eb",
                    "on-secondary-fixed": "#002113",
                    "outline-variant": "#c3c6d7",
                    "outline": "#737686",
                    "on-tertiary": "#ffffff",
                    "background": "#f8f9ff",
                    "tertiary-fixed-dim": "#90d3c7",
                    "on-tertiary-fixed": "#00201c",
                    "on-tertiary-fixed-variant": "#005048",
                    "surface-container-lowest": "#ffffff",
                    "surface-dim": "#cbdbf5",
                    "on-background": "#0b1c30",
                    "on-error-container": "#93000a",
                    "tertiary": "#155f56",
                    "inverse-surface": "#213145",
                    "secondary": "#006c49",
                    "surface": "#f8f9ff",
                    "on-tertiary-container": "#b9fef1",
                    "on-secondary-container": "#00714d",
                    "on-primary-fixed": "#00174b",
                    "on-primary-fixed-variant": "#003ea8",
                    "tertiary-container": "#34786e",
                    "primary-fixed-dim": "#b4c5ff",
                    "on-primary": "#ffffff",
                    "surface-bright": "#f8f9ff",
                    "on-primary-container": "#eeefff",
                    "inverse-on-surface": "#eaf1ff",
                    "tertiary-fixed": "#abf0e3",
                    "secondary-fixed-dim": "#4edea3",
                    "surface-container-highest": "#d3e4fe",
                    "on-surface-variant": "#434655",
                    "on-secondary": "#ffffff",
                    "inverse-primary": "#b4c5ff",
                    "surface-variant": "#d3e4fe",
                    "surface-container-high": "#dce9ff",
                    "on-secondary-fixed-variant": "#005236"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
            },
            "spacing": {
                    "md": "24px",
                    "gutter": "24px",
                    "base": "8px",
                    "sm": "12px",
                    "margin": "32px",
                    "xs": "4px",
                    "lg": "40px",
                    "xl": "64px"
            },
            "fontFamily": {
                    "label-sm": ["Inter"],
                    "headline-lg-mobile": ["Inter"],
                    "body-md": ["Inter"],
                    "headline-lg": ["Inter"],
                    "label-md": ["Inter"],
                    "body-sm": ["Inter"],
                    "body-lg": ["Inter"],
                    "title-lg": ["Inter"],
                    "display-lg": ["Inter"],
                    "headline-md": ["Inter"]
            },
            "fontSize": {
                    "label-sm": ["12px", {"lineHeight": "14px", "fontWeight": "500"}],
                    "headline-lg-mobile": ["28px", {"lineHeight": "36px", "fontWeight": "600"}],
                    "body-md": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
                    "headline-lg": ["32px", {"lineHeight": "40px", "letterSpacing": "-0.01em", "fontWeight": "600"}],
                    "label-md": ["14px", {"lineHeight": "16px", "letterSpacing": "0.01em", "fontWeight": "600"}],
                    "body-sm": ["14px", {"lineHeight": "20px", "fontWeight": "400"}],
                    "body-lg": ["18px", {"lineHeight": "28px", "fontWeight": "400"}],
                    "title-lg": ["20px", {"lineHeight": "28px", "fontWeight": "500"}],
                    "display-lg": ["48px", {"lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
                    "headline-md": ["24px", {"lineHeight": "32px", "fontWeight": "600"}]
            }
          },
        },
      }
    
    document.addEventListener('DOMContentLoaded', () => {
            // Active interaction for buttons
            const buttons = document.querySelectorAll('button');
            buttons.forEach(btn => {
                btn.addEventListener('mousedown', () => {
                    btn.classList.add('scale-95');
                });
                btn.addEventListener('mouseup', () => {
                    btn.classList.remove('scale-95');
                });
                btn.addEventListener('mouseleave', () => {
                    btn.classList.remove('scale-95');
                });
            });
        });