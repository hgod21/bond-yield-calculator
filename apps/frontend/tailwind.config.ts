/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{ts,tsx}'],
    theme: {
        extend: {
            colors: {
                navy: {
                    900: '#0a0f2c',
                    800: '#0d1540',
                    700: '#111c52',
                    600: '#1a2770',
                },
                gold: {
                    400: '#f59e0b',
                    500: '#d97706',
                    600: '#b45309',
                },
                emerald: {
                    400: '#34d399',
                    500: '#10b981',
                },
                rose: {
                    400: '#fb7185',
                    500: '#f43f5e',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
            },
        },
    },
    plugins: [],
};
