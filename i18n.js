// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
const { i18nConfig } = require('./i18n.config.js')

const config = {
  defaultLocale: i18nConfig.defaultLocale,
  locales: i18nConfig.locales,
  loadLocaleFrom: (lang, ns) => {
    return new Promise((resolve, reject) => {
      import(`./public/locales/${lang}/${ns}.json`)
        .then((module) => resolve(module.default))
        .catch((exception) => reject((exception)))
    })
  },
  localeDetection: true,
  logBuild: false,
  pages: {
    '*': [
      'app_menu',
      'app_banner',
      'footer',
      'menu',
      'error',
      'common',
      'api_exceptions',
      'advertising',
    ],
    '/': [
      'sorting_menu_dropdown',
      'post',
      'pagination_bar',
      'home_page',
    ],
    'rgx:/producers/*': [
      'sorting_menu_dropdown',
      'post',
      'pagination_bar',
      'producers',
      'api_exceptions',
    ],
    'rgx:/categories/*': [
      'sorting_menu_dropdown',
      'post',
      'pagination_bar',
      'categories',
    ],
    'rgx:/actors/*': [
      'sorting_menu_dropdown',
      'post',
      'pagination_bar',
      'actors',
    ],
    'rgx:/posts/videos/*': [
      'sorting_menu_dropdown',
      'pagination_bar',
      'post_page',
      'post',
      'post_comments',
    ],
    'rgx:/posts/search/*': [
      'sorting_menu_dropdown',
      'post',
      'pagination_bar',
      'search',
    ],
  },
}

module.exports = config
