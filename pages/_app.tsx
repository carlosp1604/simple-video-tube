import '~/styles/globals.scss'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import styles from '~/styles/pages/_app.module.scss'
import dynamic from 'next/dynamic'
import ReactGA from 'react-ga4'
import UsingRouterProvider from '~/modules/Shared/Infrastructure/Components/UsingRouterProvider'
import { Roboto } from 'next/font/google'
import { AppMenu } from '~/components/AppMenu/AppMenu'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { MobileMenu } from '~/components/AppMenu/MobileMenu'
import { MenuSideBar } from '~/components/MenuSideBar/MenuSideBar'
import { LanguageMenu } from '~/modules/Shared/Infrastructure/Components/LanguageMenu/LanguageMenu'
import { ToastProvider } from '~/components/AppToast/ToastProvider'
import { TopMobileMenu } from '~/components/TopMobileMenu/TopMobileMenu'
import { AppProgressBar } from '~/components/AppProgressBar/AppProgressBar'
import {
  TrafficstarsVideoSlider
} from '~/modules/Shared/Infrastructure/Components/Trafficstars/TrafficstarsVideoSlider'

const AppFooter = dynamic(() => import('~/components/AppFooter/AppFooter')
  .then((module) => module.AppFooter),
{ ssr: false }
)

const AppBanner = dynamic(() => import('~/modules/Shared/Infrastructure/Components/AppBanner/AppBanner')
  .then((module) => module.AppBanner),
{ ssr: false }
)

const LiveCams = dynamic(() =>
  import('~/components/LiveCams/LiveCams').then((module) => module.LiveCams),
{ ssr: false }
)

const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  variable: '--font-roboto',
  display: 'swap',
  style: 'normal',
  subsets: ['latin'],
})

function App ({
  Component,
  pageProps: {
    ...pageProps
  },
}: AppProps) {
  const [menuOpen, setMenuOpen] = useState<boolean>(false)
  const [openLanguageMenu, setOpenLanguageMenu] = useState<boolean>(false)

  const { pathname } = useRouter()

  // Environment var make sense only for production
  if (process.env.NEXT_PUBLIC_NODE_ENV === 'production' && process.env.NEXT_PUBLIC_ANALYTICS_TRACKING_ID) {
    ReactGA.initialize(process.env.NEXT_PUBLIC_ANALYTICS_TRACKING_ID)
  }

  /** Post video embed page **/
  if (pathname.startsWith('/posts/videos/embed')) {
    return (
      <main className={ styles.app__embedContainer } translate={ 'no' }>
        <Component { ...pageProps }/>
      </main>
    )
  }

  return (
    <UsingRouterProvider >
      <ToastProvider>
        <div className={ `${styles.app__layout} ${roboto.variable}` } translate={ 'no' }>
          <Head>
            <link rel="icon" href="/favicon.ico"/>
          </Head>

          <AppProgressBar/>

          <LanguageMenu isOpen={ openLanguageMenu } onClose={ () => setOpenLanguageMenu(false) }/>

          <MobileMenu
            setOpenLanguageMenu={ setOpenLanguageMenu }
            openMenu={ menuOpen }
            setOpenMenu={ setMenuOpen }
          />

          <AppMenu
            onClickMenuButton={ () => setMenuOpen(!menuOpen) }
            setOpenLanguageMenu={ setOpenLanguageMenu }
          />

          <MenuSideBar
            menuOpen={ menuOpen }
            setOpenLanguageMenu={ setOpenLanguageMenu }
          />

          <TrafficstarsVideoSlider/>

            { /** Workaround to work with the sidebar fixed **/ }
            <div className={
              `${styles.app__mainLayout} ${menuOpen ? styles.app__mainLayout__open : ''} ${roboto.variable}` }
            >
              { /** Workaround to show tooltip in the sidebar menú**/ }
              <div id="tooltip-container" className={ 'z-tooltip fixed' }></div>
              <main className={ styles.app__container }>
                <TopMobileMenu />

                <Component { ...pageProps }/>

                <LiveCams/>
              </main>

            <AppBanner/>

            <AppFooter/>
          </div>
        </div>
      </ToastProvider>
    </UsingRouterProvider>
  )
}

export default App
