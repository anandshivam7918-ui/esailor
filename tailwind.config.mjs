/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/app/**/*.css',
    './src/components/**/*.css',
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAF7F2',
        foreground: '#2A241C',
        surface: '#FFFFFF',
        'surface-muted': '#F0EBE1',
        'surface-dark': '#F5F0EB',
        border: '#DDD4C4',
        'border-light': '#E8E3DB',
        primary: '#5C4A32',
        secondary: '#8A9A5B',
        accent: '#C17F42',
        'accent-light': '#E8D5C4',
        success: '#4A7A5E',
        'success-light': '#D0E8D9',
        warning: '#B8863B',
        error: '#A94D3F',
      },
      fontFamily: {
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
      },
      fontWeight: {
        regular: '400',
        medium: '600',
      },
      spacing: {
        0: '0px',
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        5: '24px',
        6: '32px',
        7: '48px',
        8: '64px',
        9: '96px',
      },
      borderRadius: {
        btn: '4px',
        card: '8px',
        input: '4px',
        badge: '999px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(42, 36, 28, 0.06)',
        md: '0 4px 12px rgba(42, 36, 28, 0.10)',
        lg: '0 12px 32px rgba(42, 36, 28, 0.14)',
      },
      fontSize: {
        display: ['56px', '61.6px'], // 56px, line-height 1.1
        h1: ['48px', '52.8px'], // 48px, line-height 1.1
        h2: ['36px', '43.2px'], // 36px, line-height 1.2
        h3: ['24px', '31.2px'], // 24px, line-height 1.3
        body: ['18px', '28.8px'], // 18px, line-height 1.6
        sm: ['14px', '21px'], // 14px, line-height 1.5
        xs: ['12px', '16.8px'], // 12px, line-height 1.4
      },
      lineHeight: {
        tight: '1.1',
        normal: '1.2',
        relaxed: '1.6',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        zoomIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        zoomOut: {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.9)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        countUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};