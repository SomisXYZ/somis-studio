/** @type {import('tailwindcss').Config} */

module.exports = {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'class',
    mode: 'jit',
    theme: {
        screens: {
            sm: '640px',
            md: '768px',
            lg: '1024px',
            xl: '1280px',
            '2xl': '1536px',
        },
        extend: {
            colors: {
                discord: {
                    DEFAULT: 'var(--color-discord)',
                    hover: 'var(--color-discord-hover)',
                },
                twitter: {
                    DEFAULT: 'var(--color-twitter)',
                    hover: 'var(--color-twitter-hover)',
                },
                sui: {
                    DEFAULT: 'var(--color-sui)',
                },
                blue: 'var(--color-blue)',
                'background-quaternary': 'var(--color-background-quaternary)',
                'footer-background': 'var(--color-footer-background)',
                'footer-text': 'var(--color-footer-text)',
                light: {
                    DEFAULT: 'var(--color-text)',
                    hover: 'var(--color-primary)',
                    spinner: 'var(--color-primary)',
                    primary: {
                        DEFAULT: 'var(--color-primary)',
                    },
                    secondary: {
                        DEFAULT: 'var(--color-text-gray)',
                        hover: 'var(--color-text-gray)',
                        border: 'var(--color-border-secondary)',
                    },
                    tertiary: {
                        DEFAULT: 'var(--color-secondary)',
                    },
                    quaternary: {
                        DEFAULT: 'var(--color-text-secondary)',
                    },
                    input: {
                        background: 'var(--color-background)',
                    },
                    success: {
                        DEFAULT: 'var(--color-success)',
                    },
                    error: {
                        DEFAULT: 'var(--color-error)',
                    },
                    dark: {
                        DEFAULT: 'var(--color-dark)',
                    },
                    card: {
                        background: 'var(--color-background-secondary)',
                        'background-hover': 'var(--color-background-secondary-hover)',
                        border: 'var(--color-border-secondary)',
                        footer: {
                            background: 'var(--color-background-tertiary)',
                        },
                    },
                    input: {
                        background: 'var(--color-input-background)',
                        placeholder: 'var(--color-text-gray)',
                        error: 'var(--color-error)',
                        border: 'var(--color-border-tertiary)',
                    },
                    select: {
                        background: 'var(--color-input-background)',
                        text: 'var(--color-text-gray)',
                    },
                    gray: ['var(--color-text-gray)'],
                    border: 'var(--color-border)',
                    background: 'var(--color-background)',
                    'content-background': 'var(--color-background)',
                    'background-hover': 'var(--color-background-hover)',
                    'selected-background': 'var(--color-background-selected)',
                    'background-modal': 'var(--color-background-modal)',
                },
                dark: {
                    DEFAULT: 'var(--color-text)',
                    hover: 'var(--color-primary)',
                    spinner: 'var(--color-primary)',
                    primary: {
                        DEFAULT: 'var(--color-primary)',
                    },
                    secondary: {
                        DEFAULT: 'var(--color-text-gray)',
                        hover: 'var(--color-text-gray)',
                        border: 'var(--color-border-secondary)',
                    },
                    tertiary: {
                        DEFAULT: 'var(--color-secondary)',
                    },
                    quaternary: {
                        DEFAULT: 'var(--color-text-secondary)',
                    },
                    input: {
                        background: 'var(--color-background)',
                    },
                    success: {
                        DEFAULT: 'var(--color-success)',
                    },
                    error: {
                        DEFAULT: 'var(--color-error)',
                    },
                    dark: {
                        DEFAULT: 'var(--color-dark)',
                    },
                    card: {
                        background: 'var(--color-background-secondary)',
                        'background-hover': 'var(--color-background-secondary-hover)',
                        border: 'var(--color-border-secondary)',
                        footer: {
                            background: 'var(--color-background-tertiary)',
                        },
                    },
                    input: {
                        background: 'var(--color-input-background)',
                        placeholder: 'var(--color-text-gray)',
                        error: 'var(--color-error)',
                        border: 'var(--color-border-tertiary)',
                    },
                    select: {
                        background: 'var(--color-input-background)',
                        text: 'var(--color-text-gray)',
                    },
                    gray: 'var(--color-text-gray)',
                    border: 'var(--color-border)',
                    background: 'var(--color-background)',
                    'content-background': 'var(--color-background)',
                    'background-hover': 'var(--color-background-hover)',
                    'selected-background': 'var(--color-background-selected)',
                    'background-modal': 'var(--color-background-modal)',
                },
                button: {
                    primary: {
                        background: 'var(--color-primary)',
                        text: 'var(--color-white)',
                        border: 'var(--color-transparent-black)',
                        hover: 'var(--color-primary-hover)',
                    },
                    secondary: {
                        background: 'var(--color-secondary)',
                        text: 'var(--color-text-reverse)',
                        border: 'var(--color-transparent-black)',
                        hover: 'var(--color-secondary-hover)',
                    },
                    tertiary: {
                        background: 'var(-color-background-secondary)',
                        text: 'var(--color-text)',
                        border: 'var(--color-border-tertiary)',
                        hover: 'var(--color-background-secondary-hover)',
                    },
                    default: {
                        background: '#3A3F55',
                        text: '#FFFFFF',
                        border: 'rgba(0, 0, 0, 0.1)',
                        hover: '#2C313D',
                    },
                    group: {
                        normal: {
                            DEFAULT: '#E3E3E3',
                            text: '#0F172A',
                        },
                        selected: {
                            DEFAULT: '#6366F1',
                            text: '#FFFFFF',
                        },
                    },
                },
            },
            fontSize: {
                // Control the global font size in _typography.scss to handle the responsive font size
            },
            animation: {
                'shrink-bounce': 'shrink-bounce 200ms cubic-bezier(.4,.0,.23,1)',
                'somis-spin': 'somis-spin 0.5s linear infinite',
            },
            aspectRatio: {
                '3/1': '3/1',
                '5/1': '5/1',
                '16/9': '16/9',
                '21/9': '21/9',
            },
            keyframes: {
                'shrink-bounce': {
                    '0%': {
                        transform: 'scale(1)',
                    },
                    '50%': {
                        transform: 'scale(0.85)',
                    },
                    '100%': {
                        transform: 'scale(1)',
                    },
                },
                'somis-spin': {
                    from: {
                        transform: 'rotate(0deg)',
                    },
                    to: {
                        transform: 'rotate(360deg)',
                    },
                },
            },
            gridTemplateColumns: {
                'auto-176': 'repeat(auto-fill, minmax(176px, 176px))',
            },
            spacing: {
                'min-6': 'min(1.5rem, 1rem)',
            },
        },
    },
    safelist: [
        'dark',
        'light',
        {
            pattern: /^flex-/,
        },
        {
            pattern: /^grid-/,
        },
        {
            pattern: /^justify-/,
        },
        {
            pattern: /^items-/,
        },
        {
            pattern: /^place-/,
        },
        {
            pattern: /^basis-/,
        },
        {
            pattern: /^gap-/,
        },
        {
            pattern: /^col-/,
        },
        {
            pattern: /^row-/,
        },
        {
            pattern: /^self-/,
        },
        {
            pattern: /^content-/,
        },
        {
            pattern: /^order-/,
        },
        {
            pattern: /^resize-/,
        },
    ],
    plugins: [require('@tailwindcss/line-clamp')],
}
