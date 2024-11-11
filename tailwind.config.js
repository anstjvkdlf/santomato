// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],  // Update 'purge' to 'content'
  darkMode: 'media', // Optionally set to 'media', or you can remove this line entirely
  theme: {
    extend: {
      colors: {
        'black-100': '#1a1a1a'
      },
      aspectRatio: {
        '3/4': '3/4',
        '9/16': '9/16'
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}
