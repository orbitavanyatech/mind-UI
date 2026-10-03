/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  safelist: [
    // The app builds a handful of class names dynamically (e.g. `bg-${color}-600`)
    // for role/theme accent colors. Safelisting keeps those in the production build
    // (kept to the specific shades actually referenced dynamically, to avoid bloat).
    {
      pattern: /(bg|text|ring|border)-(teal|amber|indigo|violet|slate|rose)-(50|100|300|400|600|700|800|900)/
    }
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Outfit", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        /* ---- Mind Elevate design tokens — "Signal" palette ------------ */
        /* signal blue — primary brand, focus & momentum (was: jade teal) */
        teal: {
          50: "#F0F3FF", 100: "#E0E7FF", 200: "#C3D0FF", 300: "#9DB0FF",
          400: "#7089FF", 500: "#4A65FA", 600: "#3346E8", 700: "#2733C4",
          800: "#21299C", 900: "#1F267D", 950: "#14174A"
        },
        /* ink navy — dark surfaces (hero, sidebar) + org/admin accent (was: dusk indigo) */
        indigo: {
          50: "#F1F3F8", 100: "#E2E6F0", 200: "#C7CEDF", 300: "#A3AEC7",
          400: "#7986A8", 500: "#56618A", 600: "#3F4A70", 700: "#2E3759",
          800: "#1E2540", 900: "#141A2E", 950: "#0A0E1C"
        },
        /* signal magenta — coach / leader / confidential-coaching accent (was: coach plum) */
        violet: {
          50: "#FDF2FA", 100: "#FCE4F4", 200: "#FAC9EA", 300: "#F5A0D9",
          400: "#ED6EC0", 500: "#DE3FA3", 600: "#C02786", 700: "#9D1D6C",
          800: "#7C1857", 900: "#5E1444", 950: "#3A0C2A"
        },
        /* signal amber — monthly-theme / momentum accent (kept warm, retuned) */
        amber: {
          50: "#FFF8EB", 100: "#FEEDC7", 200: "#FDD888", 300: "#FBBE4E",
          400: "#F8A324", 500: "#EE8710", 600: "#CE690A", 700: "#A6500C",
          800: "#85400F", 900: "#6D350F", 950: "#3D1B06"
        },
        /* cool graphite — true-neutral gray, replaces the warm-toned slate */
        slate: {
          50: "#F7F8F9", 100: "#EEF0F2", 200: "#DDE1E5", 300: "#C1C7CD",
          400: "#9AA2AB", 500: "#747D88", 600: "#5A626D", 700: "#454C55",
          800: "#2E333A", 900: "#1C2024", 950: "#101215"
        }
      },
      boxShadow: {
        card: "0 1px 2px rgba(20, 23, 66, 0.05), 0 1px 1px rgba(20, 23, 66, 0.03)",
        lift: "0 24px 48px -14px rgba(20, 23, 66, 0.28)"
      }
    }
  },
  plugins: []
};
