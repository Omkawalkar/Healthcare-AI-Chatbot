       
       
       
             tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "on-surface": "#0b1c30",
                    "outline-variant": "#c3c6d7",
                    "surface-dim": "#cbdbf5",
                    "on-tertiary-container": "#b9fef1",
                    "secondary-fixed-dim": "#4edea3",
                    "on-secondary-fixed": "#002113",
                    "primary-fixed-dim": "#b4c5ff",
                    "surface-container-low": "#eff4ff",
                    "on-secondary": "#ffffff",
                    "on-primary-fixed-variant": "#003ea8",
                    "tertiary": "#155f56",
                    "surface-bright": "#f8f9ff",
                    "primary": "#004ac6",
                    "on-secondary-container": "#00714d",
                    "on-surface-variant": "#434655",
                    "surface-variant": "#d3e4fe",
                    "tertiary-fixed-dim": "#90d3c7",
                    "secondary": "#006c49",
                    "on-error": "#ffffff",
                    "secondary-container": "#6cf8bb",
                    "on-tertiary-fixed-variant": "#005048",
                    "on-primary-fixed": "#00174b",
                    "surface-container-highest": "#d3e4fe",
                    "on-tertiary-fixed": "#00201c",
                    "on-secondary-fixed-variant": "#005236",
                    "background": "#f8f9ff",
                    "on-error-container": "#93000a",
                    "outline": "#737686",
                    "on-primary-container": "#eeefff",
                    "primary-container": "#2563eb",
                    "secondary-fixed": "#6ffbbe",
                    "tertiary-fixed": "#abf0e3",
                    "inverse-surface": "#213145",
                    "on-background": "#0b1c30",
                    "on-tertiary": "#ffffff",
                    "tertiary-container": "#34786e",
                    "surface-container": "#e5eeff",
                    "on-primary": "#ffffff",
                    "inverse-on-surface": "#eaf1ff",
                    "error-container": "#ffdad6",
                    "surface-container-lowest": "#ffffff",
                    "inverse-primary": "#b4c5ff",
                    "surface-container-high": "#dce9ff",
                    "surface-tint": "#0053db",
                    "surface": "#f8f9ff",
                    "primary-fixed": "#dbe1ff",
                    "error": "#ba1a1a"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
            },
            "spacing": {
                    "xl": "64px",
                    "md": "24px",
                    "lg": "40px",
                    "sm": "12px",
                    "gutter": "24px",
                    "xs": "4px",
                    "base": "8px",
                    "margin": "32px"
            },
            "fontFamily": {
                    "label-md": ["Inter"],
                    "display-lg": ["Inter"],
                    "body-md": ["Inter"],
                    "headline-lg": ["Inter"],
                    "label-sm": ["Inter"],
                    "headline-lg-mobile": ["Inter"],
                    "body-lg": ["Inter"],
                    "body-sm": ["Inter"],
                    "headline-md": ["Inter"],
                    "title-lg": ["Inter"]
            },
            "fontSize": {
                    "label-md": ["14px", {"lineHeight": "16px", "letterSpacing": "0.01em", "fontWeight": "600"}],
                    "display-lg": ["48px", {"lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
                    "body-md": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
                    "headline-lg": ["32px", {"lineHeight": "40px", "letterSpacing": "-0.01em", "fontWeight": "600"}],
                    "label-sm": ["12px", {"lineHeight": "14px", "fontWeight": "500"}],
                    "body-lg": ["18px", {"lineHeight": "28px", "fontWeight": "400"}],
                    "body-sm": ["14px", {"lineHeight": "20px", "fontWeight": "400"}],
                    "headline-md": ["24px", {"lineHeight": "32px", "fontWeight": "600"}],
                    "title-lg": ["20px", {"lineHeight": "28px", "fontWeight": "500"}]
            }
          },
        },
      }
       document.querySelectorAll('tbody tr').forEach(row => {
            row.addEventListener('mouseenter', () => {
                row.style.cursor = 'pointer';
            });
        });

        // Search Input Glow Effect
        const searchInput = document.querySelector('input[type="text"]');
        searchInput.addEventListener('focus', () => {
            searchInput.parentElement.classList.add('ring-2', 'ring-primary/20');
        });
        searchInput.addEventListener('blur', () => {
            searchInput.parentElement.classList.remove('ring-2', 'ring-primary/20');
        });