import { MenuOptionComponentInterface } from '~/components/MenuOptions/MenuOptions'
import { FC, ReactElement, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import Link from 'next/link'
import styles from './MenuSideBarOption.module.scss'
import { Tooltip2 } from '~/components/Tooltip2/Tooltip'
import { useClickAnimation } from '~/hooks/ClickAnimation/ClickAnimation'
import { nanoid } from 'nanoid'

interface Props {
  menuOption: MenuOptionComponentInterface
  menuOpen: boolean
}

export const MenuSideBarOption: FC<Props> = ({ menuOption, menuOpen }) => {
  const [mounted, setMounted] = useState<boolean>(false)
  const [tooltipId, setTooltipId] = useState<string>('')
  const linkRef = useRef<HTMLAnchorElement>(null)
  const divRef = useRef<HTMLDivElement>(null)

  const buildPortal = (component: ReactElement) => {
    return ReactDOM.createPortal(component, document.getElementById('tooltip-container') as HTMLElement)
  }

  useClickAnimation(linkRef)
  useClickAnimation(divRef)

  useEffect(() => {
    setMounted(true)
    setTooltipId(nanoid())
  }, [])

  if (menuOption.action) {
    return (
      <Link
        href={ menuOption.action.url }
        className={ `
          ${styles.menuSidebarOption__menuItemContent}
          ${menuOpen ? styles.menuSidebarOption__menuItemContent__open : ''}
          ${menuOption.isActive ? styles.menuSidebarOption__menuItemContent__active : ''}
        ` }
        target={ menuOption.action.blank ? '_blank' : '_self' }
        data-tooltip-id={ tooltipId }
        ref={ linkRef }
      >
        { !menuOpen && mounted
          ? buildPortal(<Tooltip2
            tooltipId={ tooltipId }
            place={ 'right' }
            content={ menuOption.title }
          />)
          : null
        }
        <span className={ styles.menuSidebarOption__menuItemIcon }>
        { menuOption.picture }
      </span>
        <span className={ `
        ${styles.menuSidebarOption__menuItemText}
        ${menuOpen ? styles.menuSidebarOption__menuItemText__open : ''}
      ` }>
        { menuOption.title }
      </span>
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
        ref={ divRef }
      >
        { mounted && !menuOpen
          ? buildPortal(<Tooltip2
            tooltipId={ tooltipId }
            place={ 'right' }
            content={ menuOption.title }
          />)
          : null
        }
        <span className={ styles.menuSidebarOption__menuItemIcon }>
        { menuOption.picture }
      </span>
        <span className={ `
        ${styles.menuSidebarOption__menuItemText}
        ${menuOpen ? styles.menuSidebarOption__menuItemText__open : ''}
      ` }>
        { menuOption.title }
      </span>
      </div>
    )
  }

  return null
}
