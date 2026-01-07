import type { Config } from "tailwindcss";

export default {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                // Climate Colors
                climate: {
                    warming: '#FF4D4D', // Red
                    cooling: '#4DA6FF', // Blue
                    co2: '#555555', // Grey/Black
                    nature: '#2E8B57', // Sea Green
                    ocean: '#1E90FF',
                }
            },
            fontFamily: {
                mono: ['var(--font-geist-mono)'],
                sans: ['var(--font-geist-sans)'],
            },
        },
    },
    plugins: [],
} satisfies Config;
