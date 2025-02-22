import { type Config } from "tailwindcss";

export default {
  content: [
    "{routes,islands,components}/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        "background" : "#080708",
        "background-light" : "#141414",
        "background-dark" : "#030303",
        "pink" : "#ff90f9",
        "pink-dark" : "#b567b1",
        "pink-light" : "#ffb0fb",
        "white" : "#ffffff",
        "gray" : "#b5b5b5"
      },
      
      animation: {
        'bounce-dots-1': 'bounce 1s infinite alternate 0s',
        'bounce-dots-2': 'bounce 1s infinite alternate 0.2s',
        'bounce-dots-3': 'bounce 1s infinite alternate 0.4s',
        'fade-in': 'fade_in 500ms ease-in forwards',
        'fade-in-fast': 'fade_in 200ms ease-in forwards',
        'fade-in-slow': 'fade_in 3000ms',
        'fade-in-delay': 'fade_in 1000ms backwards ease-out 2s',
        'fade-out': 'fade_out 500ms ease-out forwards',
        'fade-out-slow': 'fade_out 1000ms forwards',
        'scale-in-left': 'scale_in_left 500ms',
        'scale-in-right': 'scale_in_right 500ms',
        'scale-in-bottom': 'scale_in_bottom 500ms',
      },

      keyframes: {
        bounce: {
          '0%': {
            transform: 'scale(1)',
          },
          '50%': {
            transform: 'scale(1.2)',
          },
          '100%': {
            transform: 'scale(1)',
          },
        },
        scale_in_left: {
          '0%': {
            transform: 'scale(0.5) translate(-50%, 0%)',
            opacity: "0",
          },
          '20%': {
            transform: 'scale(0.75) translate(-50%, 0%)',
            opacity: "0",
          },
          '100%': {
            transform: 'scale(1)',
          },
        },
        scale_in_right: {
          '0%': {
            transform: 'scale(0.5) translate(50%, 0%)',
            opacity: "0",
          },
          '20%': {
            transform: 'scale(0.75) translate(50%, 0%)',
            opacity: "0",
          },
          '100%': {
            transform: 'scale(1)',
          },
        },
        scale_in_bottom: {
          '0%': {
            transform: 'scale(0.5) translate(0%, 50%)',
            opacity: "0",
          },
          '20%': {
            transform: 'scale(0.75) translate(0%, 50%)',
            opacity: "0",
          },
          '100%': {
            transform: 'scale(1)',
          },
        },
        fade_in: {
          '0%': {
            opacity: "0",
          },
          '100%': {
            opacity: "1",
          },
        },
        fade_out: {
          '0%': {
            opacity: "1",
          },
          '100%': {
            opacity: "0",
          },
        }
      },
    }
  }
} satisfies Config;
