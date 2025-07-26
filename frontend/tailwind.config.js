/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        // Adjust these paths to match your project structure
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/index.html",
    ],
    theme: {
        extend: {
            animation: {
                fadeIn: "fadeIn 0.5s ease-out forwards",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: 0, transform: "scale(0.50)" },
                    "25%": { opacity: 0, transform: "scale(0.65)" },
                    "50%": { opacity: 0, transform: "scale(0.75)" },
                    "75%": { opacity: 0, transform: "scale(0.95)" },
                    "100%": { opacity: 1, transform: "scale(1)" },
                },
            },
            boxShadow: {
                "xl-glow": "0 0 30px rgba(0, 0, 0, 0.1)",
            },
        },
    },
    plugins: [],
};
