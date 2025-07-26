// tailwind.config.js
import daisyui from 'daisyui'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      
      colors: {
        primary: {
          DEFAULT: '#facc15', // yellow-400
        },
        secondary: {
          DEFAULT: '#3b82f6', // blue-500
        },
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        instapal: {
          primary: '#facc15',   // yellow
          secondary: '#3b82f6', // blue
          accent: '#fde68a',
          neutral: '#1f2937',
          'base-200': '#f1f5f9',
          info: '#60a5fa',
          success: '#34d399',
          warning: '#fbbf24',
          error: '#f87171',
        },
      },
    ],
  },
}