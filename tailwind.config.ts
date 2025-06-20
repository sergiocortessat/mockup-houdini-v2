import type { Config } from 'tailwindcss';

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        xxs: '22.5rem', // 360px - very small devices
        xs: '30rem', // 480px - extra small devices
      },
      colors: {
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontSize: {
        // Display
        'display-xxl': [
          '5.5rem', // 88px
          { lineHeight: '1.09', letterSpacing: '-2.64px', fontWeight: '500' },
        ],
        'display-xl': [
          '4rem', // 64px
          { lineHeight: '1.125', letterSpacing: '-2px', fontWeight: '500' },
        ],
        'display-lg': [
          '3rem', // 48px
          { lineHeight: '1.167', letterSpacing: '-1.32px', fontWeight: '500' },
        ],
        'display-md': [
          '2.5rem', // 40px
          { lineHeight: '1.2', letterSpacing: '-1.12px', fontWeight: '500' },
        ],
        'display-sm': [
          '2.25rem', // 36px
          { lineHeight: '1.222', letterSpacing: '-1.06px', fontWeight: '500' },
        ],
        'display-xs': [
          '2rem', // 32px
          { lineHeight: '1.25', letterSpacing: '-0.88px', fontWeight: '500' },
        ],
        'display-xxs': [
          '1.5rem', // 24px
          { lineHeight: '1.333', letterSpacing: '-0.56px', fontWeight: '500' },
        ],

        // Heading
        'heading-lg': [
          '1.25rem', // 20px
          { lineHeight: '1.2', letterSpacing: '-0.48px', fontWeight: '500' },
        ],
        'heading-md': [
          '1.125rem', // 18px
          { lineHeight: '1.222', letterSpacing: '-0.4px', fontWeight: '500' },
        ],
        'heading-sm': [
          '1rem', // 16px
          { lineHeight: '1.25', letterSpacing: '-0.32px', fontWeight: '500' },
        ],
        'heading-xs': [
          '0.75rem', // 12px
          { lineHeight: '1.333', letterSpacing: '-0.2px', fontWeight: '500' },
        ],
        'heading-sub': [
          '0.75rem', // 12px
          { lineHeight: '1.333', letterSpacing: '1.6px', fontWeight: '500' },
        ],

        // Label
        'label-lg': [
          '1.125rem', // 18px
          { lineHeight: '1.556', letterSpacing: '-0.64px', fontWeight: '500' },
        ],
        'label-md': [
          '1rem', // 16px
          { lineHeight: '1.5', letterSpacing: '-0.56px', fontWeight: '500' },
        ],
        'label-sm': [
          '0.875rem', // 14px
          { lineHeight: '1.43', letterSpacing: '-0.48px', fontWeight: '500' },
        ],
        'label-xs': [
          '0.75rem', // 12px
          { lineHeight: '1.333', letterSpacing: '-0.32px', fontWeight: '500' },
        ],

        // Body
        'body-lg': [
          '1rem', // 16px
          { lineHeight: '1.75', letterSpacing: '-0.64px', fontWeight: '500' },
        ],
        'body-md': [
          '1rem', // 16px
          { lineHeight: '1.5', letterSpacing: '-0.56px', fontWeight: '500' },
        ],
        'body-sm': [
          '0.875rem', // 14px
          { lineHeight: '1.429', letterSpacing: '-0.48px', fontWeight: '500' },
        ],
        'body-xs': [
          '0.75rem', // 12px
          { lineHeight: '1.333', letterSpacing: '-0.24px', fontWeight: '500' },
        ],
        'body-xxs': [
          '0.625rem', // 10px
          { lineHeight: '1.333', letterSpacing: '-0.24px', fontWeight: '500' },
        ],
      },
      backgroundImage: {
        'swap-standard': "url('/swap-standard-bg-desktop.webp')",
      },
      height: {
        header: '72px',
      },
      spacing: {
        header: '72px',
      },

      keyframes: {
        'accordion-down': {
          from: { height: '0', opacity: '0' },
          to: {
            height: 'var(--radix-collapsible-content-height)',
            opacity: '1',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-collapsible-content-height)',
            opacity: '1',
          },
          to: { height: '0', opacity: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
