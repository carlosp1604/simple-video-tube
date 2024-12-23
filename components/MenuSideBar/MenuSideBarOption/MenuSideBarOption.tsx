import Link from 'next/link'
import styles from './MenuSideBarOption.module.scss'
import dynamic from 'next/dynamic'
import { createPortal } from 'react-dom'
import { nanoid } from 'nanoid'
import { MenuOptionComponentInterface } from '~/components/MenuOptions/MenuOptions'
import { FC, ReactElement, useEffect, useMemo, useState } from 'react'

const Tooltip = dynamic(() =>
  import('~/components/Tooltip/Tooltip').then((module) => module.Tooltip), { ssr: false }
)

interface Props {
  menuOption: MenuOptionComponentInterface
  menuOpen: boolean
}

export const MenuSideBarOption: FC<Props> = ({ menuOption, menuOpen }) => {
  const [mounted, setMounted] = useState<boolean>(false)
  const [tooltipId, setTooltipId] = useState<string>('')

  const buildPortal = (component: ReactElement) => {
    return createPortal(component, document.getElementById('tooltip-container') as HTMLElement)
  }

  useEffect(() => {
    setMounted(true)
    setTooltipId(nanoid())
  }, [])

  const tooltip = useMemo(() => {
    return !menuOpen && mounted
      ? buildPortal(<Tooltip
        tooltipId={ tooltipId }
        place={ 'right' }
        content={ menuOption.title }
      />)
      : null
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuOption, mounted])

  const icon = useMemo(() => {
    return (
      <span className={ styles.menuSidebarOption__menuItemIcon }>
        { menuOption.picture }
      </span>
    )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuOption])

  const text = useMemo(() => {
    return (
      <span className={ `
        ${styles.menuSidebarOption__menuItemText}
        ${menuOpen ? styles.menuSidebarOption__menuItemText__open : ''}
      ` }>
        { menuOption.title }
      </span>
    )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuOption])

  if (menuOption.action) {
    return (
      <Link
        prefetch={ false }
        href={ menuOption.action.url }
        className={ `
          ${styles.menuSidebarOption__menuItemContent}
          ${menuOpen ? styles.menuSidebarOption__menuItemContent__open : ''}
          ${menuOption.isActive ? styles.menuSidebarOption__menuItemContent__active : ''}
        ` }
        target={ menuOption.action.blank ? '_blank' : '_self' }
        data-tooltip-id={ tooltipId }
        title={ menuOption.title }
      >
        { tooltip }
        { icon }
        { text }
      </Link>
    )
  }

  if (menuOption.onClick) {
    return (
      <div
        className={ `
        ${styles.menuSidebarOption__menuItemContent}
        ${menuOpen ? styles.menuSidebarOption__menuItemContent__open : ''}
        ${menuOption.isActive ? styles.menuSidebarOption__menuItemContent__active : ''}
      ` }
        onClick={ menuOption.onClick }
        data-tooltip-id={ tooltipId }
        title={ menuOption.title }
      >
        { tooltip }
        { icon }
        { text }
      </div>
    )
  }

  return null
}
