       
         tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                "inverse-on-surface": "#eaf1ff",
                "tertiary": "#155f56",
                "secondary": "#006c49",
                "surface-dim": "#cbdbf5",
                "surface-tint": "#0053db",
                "surface-container-high": "#dce9ff",
                "secondary-fixed-dim": "#4edea3",
                "on-primary-fixed": "#00174b",
                "on-secondary-container": "#00714d",
                "error-container": "#ffdad6",
                "on-primary": "#ffffff",
                "on-tertiary-fixed": "#00201c",
                "inverse-surface": "#213145",
                "on-primary-fixed-variant": "#003ea8",
                "secondary-container": "#6cf8bb",
                "tertiary-fixed-dim": "#90d3c7",
                "primary-fixed": "#dbe1ff",
                "surface-container-highest": "#d3e4fe",
                "on-secondary-fixed-variant": "#005236",
                "surface": "#f8f9ff",
                "primary-container": "#2563eb",
                "outline-variant": "#c3c6d7",
                "tertiary-fixed": "#abf0e3",
                "on-surface-variant": "#434655",
                "surface-container-lowest": "#ffffff",
                "surface-bright": "#f8f9ff",
                "on-tertiary-fixed-variant": "#005048",
                "surface-container-low": "#eff4ff",
                "on-secondary-fixed": "#002113",
                "on-secondary": "#ffffff",
                "on-error-container": "#93000a",
                "inverse-primary": "#b4c5ff",
                "secondary-fixed": "#6ffbbe",
                "primary": "#004ac6",
                "on-tertiary": "#ffffff",
                "error": "#ba1a1a",
                "on-surface": "#0b1c30",
                "on-error": "#ffffff",
                "surface-variant": "#d3e4fe",
                "on-primary-container": "#eeefff",
                "tertiary-container": "#34786e",
                "primary-fixed-dim": "#b4c5ff",
                "on-tertiary-container": "#b9fef1",
                "surface-container": "#e5eeff",
                "outline": "#737686",
                "background": "#f8f9ff",
                "on-background": "#0b1c30"
            },
            "borderRadius": {
                "DEFAULT": "0.25rem",
                "lg": "0.5rem",
                "xl": "0.75rem",
                "full": "9999px",
                "card": "16px"
            },
            "spacing": {
                "xs": "4px",
                "margin": "32px",
                "gutter": "24px",
                "sm": "12px",
                "lg": "40px",
                "base": "8px",
                "md": "24px",
                "xl": "64px"
            },
            "fontFamily": {
                "title-lg": ["Inter"],
                "headline-lg": ["Inter"],
                "label-md": ["Inter"],
                "label-sm": ["Inter"],
                "headline-md": ["Inter"],
                "body-lg": ["Inter"],
                "body-sm": ["Inter"],
                "headline-lg-mobile": ["Inter"],
                "display-lg": ["Inter"],
                "body-md": ["Inter"]
            },
            "fontSize": {
                "title-lg": ["20px", {"lineHeight": "28px", "fontWeight": "500"}],
                "headline-lg": ["32px", {"lineHeight": "40px", "letterSpacing": "-0.01em", "fontWeight": "600"}],
                "label-md": ["14px", {"lineHeight": "16px", "letterSpacing": "0.01em", "fontWeight": "600"}],
                "label-sm": ["12px", {"lineHeight": "14px", "fontWeight": "500"}],
                "headline-md": ["24px", {"lineHeight": "32px", "fontWeight": "600"}],
                "body-lg": ["18px", {"lineHeight": "28px", "fontWeight": "400"}],
                "body-sm": ["14px", {"lineHeight": "20px", "fontWeight": "400"}],
                "headline-lg-mobile": ["28px", {"lineHeight": "36px", "fontWeight": "600"}],
                "display-lg": ["48px", {"lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
                "body-md": ["16px", {"lineHeight": "24px", "fontWeight": "400"}]
            }
          },
        },
      }
       function togglePassword(id) {
            const input = document.getElementById(id);
            const icon = input.nextElementSibling.querySelector('.material-symbols-outlined');
            if (input.type === 'password') {
                input.type = 'text';
                icon.textContent = 'visibility_off';
            } else {
                input.type = 'password';
                icon.textContent = 'visibility';
            }
        }

        // Simple parallax effect for the brain image
        document.addEventListener('mousemove', (e) => {
            const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
            const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
            const brainImg = document.querySelector('img[src*="IMAGE_25"]');
            if (brainImg) {
                brainImg.style.transform = `translate(${moveX}px, ${moveY}px)`;
            }
        });