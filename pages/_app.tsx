import '~/styles/globals.scss'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import styles from '~/styles/pages/_app.module.scss'
import dynamic from 'next/dynamic'
import UsingRouterProvider from '~/modules/Shared/Infrastructure/Components/UsingRouterProvider'
import { Roboto } from 'next/font/google'
import { AppMenu } from '~/components/AppMenu/AppMenu'
import { MenuSideBar } from '~/components/MenuSideBar/MenuSideBar'
import { ThemeProvider } from 'next-themes'
import { ToastProvider } from '~/components/AppToast/ToastProvider'
import { AppProgressBar } from '~/components/AppProgressBar/AppProgressBar'
import { GoogleAnalytics } from '@next/third-parties/google'
import { LanguageMenuProvider } from '~/modules/Shared/Infrastructure/Components/LanguageMenu/LanguageMenuProvider'
import { ReactElement, useState } from 'react'
import { TopMobileMenu } from '~/components/TopMobileMenu/TopMobileMenu'
import {
  OctoclickInitializationCode
} from '~/modules/Shared/Infrastructure/Components/Advertising/OctoClick/OctoclickInitializationCode'
import { OctoClickInPage } from '~/modules/Shared/Infrastructure/Components/Advertising/OctoClick/OctoClickInPage'
import { OctoclickPopUnder } from '~/modules/Shared/Infrastructure/Components/Advertising/OctoClick/OctoclickPopUnder'

const AppFooter = dynamic(() => import('~/components/AppFooter/AppFooter')
  .then((module) => module.AppFooter),
{ ssr: false })

const AppBanner = dynamic(() => import('~/modules/Shared/Infrastructure/Components/AppBanner/AppBanner')
  .then((module) => module.AppBanner))

// const LiveCams = dynamic(() =>
// import('~/components/LiveCams/LiveCams').then((module) => module.LiveCams),
// { ssr: false })

const Menu = dynamic(() => import('~/components/Menu/Menu')
  .then((module) => module.Menu),
{ ssr: false })

const LanguageMenu = dynamic(() => import('~/modules/Shared/Infrastructure/Components/LanguageMenu/LanguageMenu')
  .then((module) => module.LanguageMenu),
{ ssr: false })

const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  variable: '--font-roboto',
  display: 'swap',
  style: 'normal',
  adjustFontFallback: false,
  subsets: ['latin'],
})

function App ({
  Component,
  pageProps: {
    ...pageProps
  },
}: AppProps) {
  const [menuOpen, setMenuOpen] = useState<boolean>(false)
  const [octoClickCodeInitializated, setOctoclickCodeInitializated] = useState<boolean>(false)

  let googleAnalytics: ReactElement | null = null

  // Environment var make sense only for production
  if (process.env.NEXT_PUBLIC_NODE_ENV === 'production' && process.env.NEXT_PUBLIC_ANALYTICS_TRACKING_ID) {
    googleAnalytics = (<GoogleAnalytics gaId={ process.env.NEXT_PUBLIC_ANALYTICS_TRACKING_ID } />)
  }

  return (
    <UsingRouterProvider >
      <LanguageMenuProvider >
        <ThemeProvider enableSystem={ true } attribute={ 'data-mode' }>
          <ToastProvider>
            <div className={ `${styles.app__layout} ${roboto.variable}` } translate={ 'no' }>
              <Head>
                <link rel="icon" href="/favicon.ico"/>
              </Head>

              <AppProgressBar/>

              <LanguageMenu />

              <AppMenu onClickMenuButton={ () => setMenuOpen(!menuOpen) } />

              <Menu
                open={ menuOpen }
                onClose={ () => setMenuOpen(false) }
              />

              <MenuSideBar menuOpen={ menuOpen }/>

              <OctoclickInitializationCode onRender={ () => setOctoclickCodeInitializated(true) }/>
              <OctoClickInPage initCodeRendered={ octoClickCodeInitializated }/>
              <OctoclickPopUnder initCodeRendered={ octoClickCodeInitializated }/>

              { /** Workaround to work with the sidebar fixed **/ }
              <div className={
                `${styles.app__mainLayout} ${menuOpen ? styles.app__mainLayout__open : ''} ${roboto.variable}` }
              >
                { /** Workaround to show tooltip in the sidebar menú **/ }
                <div id="tooltip-container" className={ 'z-tooltip fixed' }/>
                <main className={ styles.app__container }>
                  <TopMobileMenu />
                  <Component { ...pageProps }/>
                  { googleAnalytics }
                </main>

                <AppBanner/>

                <AppFooter/>
              </div>
            </div>
          </ToastProvider>
        </ThemeProvider>
      </LanguageMenuProvider>
    </UsingRouterProvider>
  )
}

export default App
