      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "surface-container-low": "#eff4ff",
                    "surface-container-high": "#dce9ff",
                    "on-surface": "#0b1c30",
                    "inverse-primary": "#b4c5ff",
                    "secondary-fixed-dim": "#4edea3",
                    "primary-fixed-dim": "#b4c5ff",
                    "tertiary-fixed": "#abf0e3",
                    "tertiary-container": "#34786e",
                    "on-error-container": "#93000a",
                    "on-background": "#0b1c30",
                    "inverse-surface": "#213145",
                    "on-tertiary-container": "#b9fef1",
                    "primary-container": "#2563eb",
                    "on-error": "#ffffff",
                    "error-container": "#ffdad6",
                    "surface-variant": "#d3e4fe",
                    "background": "#f8f9ff",
                    "surface-container": "#e5eeff",
                    "tertiary-fixed-dim": "#90d3c7",
                    "secondary-fixed": "#6ffbbe",
                    "primary-fixed": "#dbe1ff",
                    "on-tertiary": "#ffffff",
                    "surface-bright": "#f8f9ff",
                    "on-primary-fixed-variant": "#003ea8",
                    "surface-tint": "#0053db",
                    "tertiary": "#155f56",
                    "on-tertiary-fixed-variant": "#005048",
                    "on-secondary-fixed-variant": "#005236",
                    "error": "#ba1a1a",
                    "inverse-on-surface": "#eaf1ff",
                    "surface-container-lowest": "#ffffff",
                    "secondary": "#006c49",
                    "on-tertiary-fixed": "#00201c",
                    "on-primary-fixed": "#00174b",
                    "surface-dim": "#cbdbf5",
                    "primary": "#004ac6",
                    "secondary-container": "#6cf8bb",
                    "surface-container-highest": "#d3e4fe",
                    "outline-variant": "#c3c6d7",
                    "on-primary": "#ffffff",
                    "on-primary-container": "#eeefff",
                    "on-secondary": "#ffffff",
                    "surface": "#f8f9ff",
                    "on-secondary-fixed": "#002113",
                    "outline": "#737686",
                    "on-secondary-container": "#00714d",
                    "on-surface-variant": "#434655"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
            },
            "spacing": {
                    "sm": "12px",
                    "xl": "64px",
                    "md": "24px",
                    "gutter": "24px",
                    "margin": "32px",
                    "lg": "40px",
                    "base": "8px",
                    "xs": "4px"
            },
            "fontFamily": {
                    "title-lg": ["Inter"],
                    "headline-md": ["Inter"],
                    "display-lg": ["Inter"],
                    "body-lg": ["Inter"],
                    "body-sm": ["Inter"],
                    "label-md": ["Inter"],
                    "headline-lg-mobile": ["Inter"],
                    "headline-lg": ["Inter"],
                    "body-md": ["Inter"],
                    "label-sm": ["Inter"]
            }
          }
        }
      }
     
     
     
     
     document.querySelectorAll('button, a').forEach(el => {
            el.addEventListener('mousedown', () => {
                el.style.transform = 'scale(0.97)';
                el.style.opacity = '0.9';
            });
            el.addEventListener('mouseup', () => {
                el.style.transform = '';
                el.style.opacity = '';
            });
            el.addEventListener('mouseleave', () => {
                el.style.transform = '';
                el.style.opacity = '';
            });
        });