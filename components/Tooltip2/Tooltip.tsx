import {
  CSSProperties,
  FC,
  ReactNode,
  RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react'
import styles from './Tooltip.module.scss'

export type TooltipPlaces = 'left' | 'right' | 'top' | 'bottom'

interface TooltipProps {
  id: string
  place: TooltipPlaces
  content: string | ReactNode
}

interface Position {
  x: number
  y: number
}

interface Dimensions {
  width: number
  height: number
}

export const Tooltip2: FC<TooltipProps> = ({ id, place, content }) => {
  const [showTooltip, setShowTooltip] = useState<boolean>(false)
  const [height, setHeight] = useState<number>(0)
  const [width, setWidth] = useState<number>(0)
  const [elementRect, setElementRect] = useState<DOMRect | null>(null)
  const ref: RefObject<HTMLDivElement> = useRef(null)

  useEffect(() => {
    const element = document.querySelector(`[tooltip-id="${id}"]`)

    if (element) {
      const handler = () => {
        const element = document.querySelector(`[tooltip-id="${id}"]`)

        if (element) {
          setElementRect(element.getBoundingClientRect())
        }
      }

      const handlePointerOutside = (event: PointerEvent) => {
        if (element && event.target && !element.contains(event.target as Node)) {
          setShowTooltip(false)
        }
      }

      element.addEventListener('touchstart', () => setShowTooltip(true))
      element.addEventListener('mouseover', () => setShowTooltip(true))

      setElementRect(element.getBoundingClientRect())
      document.addEventListener('scroll', handler)
      document.addEventListener('pointerover', handlePointerOutside)

      return () => {
        document.removeEventListener('touchstart', () => setShowTooltip(true))
        document.removeEventListener('mouseover', () => setShowTooltip(true))
        document.removeEventListener('pointerover', handlePointerOutside)
        document.removeEventListener('scroll', handler)
      }
    }
  }, [id])

  useLayoutEffect(() => {
    if (ref.current) {
      const { height, width } = ref.current.getBoundingClientRect()

      setHeight(height)
      setWidth(width)
    }
  }, [showTooltip])

  const calculatePositionForTopPlace = () => {
    // y: bottom + offset padding

    // si la anchura de la referencia es mayor que el tooltip
    // padding = (refWith - tooltipWidth) / 2
    // x = padding + x

    // si la anchura del tooltip es mayor que la referencia
    // padding = (tooltipWidth - refWidth) / 2
    // x = padding - x

    if (!elementRect) {
      return null
    }

    const y = elementRect.top - height - 10
    let x = 0

    if (elementRect.width > width) {
      const padding = (elementRect.width - width) / 2

      x = elementRect.x + padding
    } else {
      // 45 - 30 = 15 /2 = 7,5
      const padding = (width - elementRect.width) / 2

      x = elementRect.x - padding
    }

    return {
      x, y,
    }
  }

  const calculatePositionForRightPlace = () => {
    // y: bottom + offset padding

    // si la anchura de la referencia es mayor que el tooltip
    // padding = (refWith - tooltipWidth) / 2
    // x = padding + x

    // si la anchura del tooltip es mayor que la referencia
    // padding = (tooltipWidth - refWidth) / 2
    // x = padding - x

    if (!elementRect) {
      return null
    }

    let y = elementRect.top
    const x = elementRect.right + 10

    const elementHeight = elementRect.bottom - elementRect.top

    if (elementHeight > height) {
      const padding = (elementHeight - height) / 2

      y = elementRect.y + padding
    } else {
      // 45 - 30 = 15 /2 = 7,5
      const padding = (height - elementHeight) / 2

      y = elementRect.y - padding
    }

    return {
      x, y,
    }
  }

  const calculatePositionForLeftPlace = () => {

  }

  const calculatePositionForBottomPlace = (): Position | null => {
    // y: bottom + offset padding

    // si la anchura de la referencia es mayor que el tooltip
    // padding = (refWith - tooltipWidth) / 2
    // x = padding + x

    // si la anchura del tooltip es mayor que la referencia
    // padding = (tooltipWidth - refWidth) / 2
    // x = padding - x

    if (!elementRect) {
      return null
    }

    const y = elementRect.bottom + 10
    let x = 0

    if (elementRect.width > width) {
      const padding = (elementRect.width - width) / 2

      x = elementRect.x + padding
    } else {
      // 45 - 30 = 15 /2 = 7,5
      const padding = (width - elementRect.width) / 2

      x = elementRect.x - padding
    }

    return {
      x, y,
    }
  }

  const position = () => {
    if (place === 'bottom') {
      return calculatePositionForBottomPlace()
    }

    if (place === 'right') {
      return calculatePositionForRightPlace()
    }

    if (place === 'top') {
      return calculatePositionForTopPlace()
    }

    return null
  }

  return (
    <div
      className={ `${styles.tooltip__container} ${showTooltip ? styles.tooltip__container_visible : ''}` }
      style={ {
        '--x-position': `${position()?.x ?? 0}px`,
        '--y-position': `${position()?.y ?? 0}px`,
      } as CSSProperties }
      ref={ ref }
    >
      { content }
    </div>
  )
}
