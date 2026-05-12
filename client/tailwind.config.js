/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0B",
        night: "#0A0A0B",
        panel: "#121214",
        sidebar: "#18181B",
        card: "#1C1C1F",
        "card-hover": "#232326",
        border: "#2A2A2E",
        "border-soft": "#2A2A2E",
        text: {
          primary: "#F4F4F5",
          secondary: "#A1A1AA",
          muted: "#71717A",
        },
        "text-primary": "#F4F4F5",
        "text-secondary": "#A1A1AA",
        "text-muted": "#71717A",
        accent: {
          purple: "#A78BFA",
          green: "#6EE7A8",
          cyan: "#22D3EE",
          yellow: "#FACC15",
          red: "#FB7185",
          surface: "#17181C",
        },
        "accent-primary": "#A78BFA",
        "accent-green": "#6EE7A8",
        "accent-cyan": "#22D3EE",
        "accent-yellow": "#FACC15",
        "accent-red": "#FB7185",
        "accent-surface": "#17181C",
      },
      fontFamily: {
        display: ["Sora", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      boxShadow: {
        panel:
          "0 1px 0 rgba(255,255,255,0.03) inset, 0 0 0 1px rgba(42,42,46,0.9), 0 24px 80px rgba(0,0,0,0.45)",
        hover:
          "0 1px 0 rgba(255,255,255,0.05) inset, 0 0 0 1px rgba(167,139,250,0.28), 0 18px 60px rgba(0,0,0,0.38)",
      },
      backgroundImage: {
        "dashboard-grid":
          "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
        "dashboard-radial":
          "radial-gradient(circle at top left, rgba(167,139,250,0.14), transparent 32%), radial-gradient(circle at 80% 0%, rgba(34,211,238,0.12), transparent 24%), radial-gradient(circle at 50% 100%, rgba(110,231,168,0.08), transparent 24%)",
      },
    },
  },
  plugins: [],
};
