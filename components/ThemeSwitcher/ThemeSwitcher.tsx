import { useState, useEffect, FC } from 'react'
import { useTheme } from 'next-themes'
import styles from './ThemeSwitcher.module.scss'
import { BsMoonStars, BsSun } from 'react-icons/bs'
import { HiOutlineComputerDesktop } from 'react-icons/hi2'
import useTranslation from 'next-translate/useTranslation'
import { MdOutlineWbSunny } from 'react-icons/md'
import { FiMoon } from 'react-icons/fi'
import { PiDesktopTowerBold } from 'react-icons/pi'

export const ThemeSwitcher: FC = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const { t } = useTranslation('common')

  const skeleton = (
    <div className={ styles.themeSwitcher__container }>
      <span className={ styles.themeSwitcher__themeOption }>
        <BsSun className={ styles.themeSwitcher__themeOptionIcon }/>
      </span>
      <span className={ styles.themeSwitcher__themeOption }>
        <BsMoonStars className={ styles.themeSwitcher__themeOptionIcon }/>
      </span>
      <span className={ styles.themeSwitcher__themeOption }>
        <HiOutlineComputerDesktop className={ styles.themeSwitcher__themeOptionIcon }/>
      </span>
    </div>
  )

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return skeleton
  }

  return (
    <div className={ styles.themeSwitcher__container }>
      <button
        title={ t('theme_switcher_light_theme_title') }
        className={ `${styles.themeSwitcher__themeOption} ${theme === 'light'
          ? styles.themeSwitcher__themeOption__active
          : ''}
         ` }
        onClick={ () => setTheme('light') }
      >
        <MdOutlineWbSunny className={ styles.themeSwitcher__themeOptionIcon }/>
      </button>
      <button
        title={ t('theme_switcher_dark_theme_title') }
        className={ `${styles.themeSwitcher__themeOption} ${theme === 'dark'
          ? styles.themeSwitcher__themeOption__active
          : ''} 
        ` }
        onClick={ () => setTheme('dark') }
      >
        <FiMoon className={ styles.themeSwitcher__themeOptionIcon }/>
      </button>
      <button
        title={ t('theme_switcher_system_theme_title') }
        className={ `${styles.themeSwitcher__themeOption} ${theme === 'system'
          ? styles.themeSwitcher__themeOption__active
          : ''} 
        ` }
        onClick={ () => setTheme('system') }
      >
        <PiDesktopTowerBold className={ styles.themeSwitcher__themeOptionIcon } />
      </button>
    </div>
  )
}
