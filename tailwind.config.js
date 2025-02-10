import tailwindcss from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
export default {
    darkMode: ["class"],
    content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
  	extend: {
  		listStyleType: {
  			none: 'none',
  			disc: 'disc',
  			decimal: 'decimal',
  			square: 'square',
  			roman: 'upper-roman'
  		},
  		spacing: {
  			'54': '54px'
  		},
  		fontFamily: {
  			playfair: [
  				'Playfair Display"',
  				'serif'
  			],
  			sans: [
  				'DM Sans',
  				'sans-serif'
  			],
  			helvetica: [
  				'Helvetica Neue',
  				'Helvetica',
  				'-apple-system',
  				'BlinkMacSystemFont',
  				'Segoe UI',
  				'Roboto',
  				'Arial',
  				'sans-serif'
  			],
  			bageta: [
  				'Bageta',
  				'sans-serif'
  			],
  			roboto: [
  				'Roboto',
  				'sans-serif'
  			]
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
      buttonVariants: {
        primary: 'bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-200',
        secondary: 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 transition-colors duration-200',
      }
  	}
},
  plugins: [tailwindcss(), tailwindcssAnimate],
}
