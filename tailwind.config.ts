import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: {
          DEFAULT: 'hsl(var(--border))',
          light: 'hsl(var(--border-light))',
          dark: 'hsl(var(--border-dark))',
          muted: 'hsl(var(--border-muted))',
          accent: 'hsl(var(--border-accent))',
          blue: 'hsl(210 40% 96.1%)', // Adding a blue border option
          medical: 'hsl(var(--medical-500))', // Medical theme blue
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        },
        medical: {
          '50': '#f0f7ff',
          '100': '#E6F7FF',
          '200': '#BAE7FF',
          '300': '#91D5FF',
          '400': '#69C0FF',
          '500': '#40A9FF',
          '600': '#1890FF',
          '700': '#096DD9',
          '800': '#0050B3',
          '900': '#003A8C'
        }
      },
      borderWidth: {
        '0.5': '0.5px',
        '1.5': '1.5px'
      },
      borderRadius: {
        'sm-md': '0.375rem',  // Between sm and md
        'lg-xl': '0.75rem',   // Between lg and xl
      },
      boxShadow: {
        'border-subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        'border-medium': '0 2px 6px -1px rgba(0, 0, 0, 0.1)',
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
