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
        "white" : "#ffffff",
        "gray" : "#b5b5b5"
      }
    }
  }
} satisfies Config;
