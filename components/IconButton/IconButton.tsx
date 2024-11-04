import styles from './IconButton.module.scss'
import dynamic from 'next/dynamic'
import TailwindConfig from '~/tailwind.config'
import { nanoid } from 'nanoid'
import { useClickAnimation } from '~/hooks/ClickAnimation/ClickAnimation'
import { FC, ReactElement, Ref, useEffect, useRef, useState } from 'react'

const Tooltip = dynamic(() =>
  import('~/components/Tooltip/Tooltip').then((module) => module.Tooltip), { ssr: false }
)

interface Props {
  onClick: (() => void) | undefined
  icon: ReactElement
  title: string
  disabled: boolean
  showTooltip: boolean
}

export const IconButton: FC<Partial<Props> & Pick<Props, 'onClick' | 'icon' | 'title'>> = ({
  onClick,
  icon,
  title,
  disabled = false,
  showTooltip = false,
}) => {
  const [mounted, setMounted] = useState<boolean>(false)
  const [tooltipId, setTooltipId] = useState<string>('')
  const ref: Ref<HTMLButtonElement> = useRef(null)

  useClickAnimation(ref, {
    color: {
      dark: TailwindConfig.theme.extend.colors.base['500'],
      light: TailwindConfig.theme.extend.colors.base['500'],
    },
  })

  useEffect(() => {
    setMounted(true)
    setTooltipId(nanoid())
  }, [])

  return (
    <button
      ref={ ref }
      className={ styles.iconButton__button }
      onClick={ () => {
        if (onClick !== undefined && !disabled) {
          onClick()
        }
      } }
      title={ title }
      disabled={ disabled }
      data-tooltip-id={ tooltipId }
    >
      { icon }
      { showTooltip && mounted
        ? <Tooltip
            tooltipId={ tooltipId }
            place={ 'bottom' }
            content={ title }
            padding={ 5 }
          />
        : null
      }

    </button>
  )
}
