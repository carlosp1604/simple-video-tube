function classNamesToZIndex (classNames) {
  return classNames.reduce((zIndexes, className, index) => {
    zIndexes[className] = index + 1

    return zIndexes
  }, {})
}

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  important: true,
  darkMode: ['class', '[data-mode="dark"]'],
  corePlugins: {
    aspectRatio: false,
  },
  theme: {
    container: {
      // you can configure the container to be centered
      center: true,

      // or have default horizontal padding
      padding: '1rem',

      // default breakpoints but with 40px removed
      screens: {
        sm: '100%',
        md: '100%',
        lg: '100%',
        xl: '1240px',
        '2xl': '1496px',
      },
    },
    screens: {
      sm: '500px',
      tb: '600px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      keyframes: {
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '0.7' },
          '100%': { transform: 'scale(6)', opacity: '0' },
        },
      },
      animation: {
        'bounce-short': 'bounce 0.3s ease-in-out 2',
        'click-ripple': 'ripple 0.5s linear forwards',
      },
      boxShadow: {
        all: '0px 0px 10px 2px rgba(0, 0, 0, 0.3)',
        'all-sm': '0px 0px 4px 2px rgba(0, 0, 0, 0.3)',
      },
      colors: {
        sidebar: {
          item: '#a06c3f',
          active: '#007880',
        },
        body: {
          dark: '#1d1d1d',
          light: '#f1f1f1',
        },
        base: {
          950: '#0c0a09',
          900: '#1C1917',
          800: '#292524',
          700: '#44403C',
          600: '#57534E',
          500: '#78716C',
          400: '#A8A29E',
          300: '#D6D3D1',
          200: '#E7E5E4',
          100: '#F5F5F4',
          50: '#FAFAF9',
        },
        brand: {
          primary: {
            light: '#3d78e6', // 600
            bg: '#3d78e6', // 700
            dark: '#3464dc', // 800
          },
        },
        tooltip: '#3464dc',
        toast: {
          error: {
            bg: '#DC143C',
            icon: '#F28585',
          },
          bg: '#3d78e6',
          icon: '#3464dc',
        },
        'progress-bar': '#3d78e6',
        red: '#FF0000',
        blue: '#00BFFF',
        green: '#008000',
        yellow: '#FFFF00',
        black: '#000000',
        white: '#FFFFFF',
        transparent: 'transparent',
      },
      fontFamily: {
        roboto: ['var(--font-roboto)'],
      },
      transitionProperty: {
        width: 'width',
        height: 'height',
        'max-height': 'max-height',
        border: 'border',
        opacity: 'opacity',
        visibility: 'visibility',
      },
      zIndex: classNamesToZIndex([
        'card-link',
        'post-card-video',
        'post-card-video-time',
        'carousel-button',
        'sort-menu-dropdown',
        'menu-dropdown',
        'video-player',
        'video-player-options',
        'video-player-options-button',
        'video-player-overlay',
        'advertising',
        'video-comments',
        'comment-options',
        'comment-to-reply',
        'comment-replies',
        'floating-action-app-menu',
        'sidebar-menu',
        'top-mobile',
        'app-menu',
        'mobile-menu',
        'tooltip',
        'modal-backdrop',
        'toast',
      ]),
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
