import {
  CSSProperties,
  FC,
  ReactNode,
  RefObject,
  useEffect,
  useLayoutEffect, useMemo,
  useRef,
  useState
} from 'react'
import styles from './Tooltip.module.scss'

export type TooltipPlaces = 'left' | 'right' | 'top' | 'bottom'

interface TooltipProps {
  tooltipId: string
  place: TooltipPlaces
  content: string | ReactNode
}

interface OptionalTooltipProps {
  padding: number
}

interface Position {
  x: number
  y: number
}

export const Tooltip2: FC<Required<TooltipProps> & Partial<OptionalTooltipProps>> = ({
  tooltipId,
  place,
  content,
  padding = 10,
}) => {
  const [showTooltip, setShowTooltip] = useState<boolean>(false)
  const [height, setHeight] = useState<number>(0)
  const [width, setWidth] = useState<number>(0)
  const [elementRect, setElementRect] = useState<DOMRect | null>(null)
  const ref: RefObject<HTMLDivElement> = useRef(null)

  useEffect(() => {
    const element = document.querySelector(`[data-tooltip-id="${tooltipId}"]`)

    if (element) {
      setElementRect(element.getBoundingClientRect())

      const handler = () => {
        const element = document.querySelector(`[data-tooltip-id="${tooltipId}"]`)

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

      document.addEventListener('scroll', handler)
      window.addEventListener('resize', handler)
      document.addEventListener('pointerover', handlePointerOutside)

      return () => {
        document.removeEventListener('touchstart', () => setShowTooltip(true))
        document.removeEventListener('mouseover', () => setShowTooltip(true))
        document.removeEventListener('pointerover', handlePointerOutside)
        document.removeEventListener('scroll', handler)
        window.removeEventListener('resize', handler)
      }
    }
  }, [tooltipId])

  useLayoutEffect(() => {
    if (ref.current) {
      const { height, width } = ref.current.getBoundingClientRect()

      setHeight(height)
      setWidth(width)
    }
  }, [showTooltip])

  const calculateXPosition = (place: TooltipPlaces, deviation = 0): number | null => {
    if (!elementRect) {
      return null
    }

    switch (place) {
      case 'bottom':
      case 'top': {
        let x = 0

        if (elementRect.width > width) {
          const calculatedPadding = (elementRect.width - width) / 2

          x = elementRect.x + calculatedPadding + deviation
        } else {
          const calculatedPadding = (width - elementRect.width) / 2

          x = elementRect.x - calculatedPadding + deviation
        }

        return x
      }

      case 'right':
        return elementRect.right + padding + deviation

      case 'left':
        return elementRect.left - width - padding + deviation

      default:
        return null
    }
  }

  const calculateYPosition = (place: TooltipPlaces, deviation = 0): number | null => {
    if (!elementRect) {
      return null
    }

    switch (place) {
      case 'bottom':
        return elementRect.bottom + padding + deviation
      case 'top':
        return elementRect.top - height - padding + deviation

      case 'right':
      case 'left':
        return elementRect.top

      default:
        return null
    }
  }

  const checkIsVisible = (): boolean => {
    if (!elementRect) {
      return false
    }

    return (
      elementRect.top >= 0 &&
      elementRect.left >= 0 &&
      elementRect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      elementRect.right <= (window.innerWidth || document.documentElement.clientWidth)
    )
  }

  const detectAndCorrectOverFlow = (position: Position | null): Position | null => {
    if (!position) {
      return null
    }

    let x = position.x
    let y = position.y

    if (width + (2 * padding) >= window.innerWidth) {
      return position
    }

    if (height + (2 * padding) >= window.innerHeight) {
      return position
    }

    if (position.x < 0) {
      console.log('Overflow left')

      x = padding
    }

    if (window) {
      if (window.innerWidth < width + position.x) {
        console.log('Overflow right')
        x = window.innerWidth - (width + padding)
      }
    }

    if (position.y < 0) {
      if (checkIsVisible()) {
        console.log('Overflow top')

        const newYPosition = calculateYPosition('bottom')

        if (!newYPosition) {
          return null
        }

        y = newYPosition
      }
    }

    return { x, y }
  }

  const position = useMemo(() => {
    const x = calculateXPosition(place)
    const y = calculateYPosition(place)

    if (x && y) {
      return detectAndCorrectOverFlow({ x, y })
    }

    return null
  }, [elementRect, height, width, showTooltip])

  return (
    <div
      className={ `${styles.tooltip__container} ${showTooltip ? styles.tooltip__container_visible : ''}` }
      style={ {
        '--x-position': `${position?.x ?? 0}px`,
        '--y-position': `${position?.y ?? 0}px`,
      } as CSSProperties }
      ref={ ref }
    >
      { content }
    </div>
  )
}
