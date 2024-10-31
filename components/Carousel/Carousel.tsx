import { createRef, FC, ReactNode, useEffect, useState } from 'react'
import styles from './Carousel.module.scss'
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs'
import useTranslation from 'next-translate/useTranslation'

export interface KeyedComponent {
  key: string
  component: ReactNode
}

interface Props {
  children: KeyedComponent[]
  itemsAutoWidth: boolean
  onEndReached: (() => void) | undefined
}

export const Carousel: FC<Props> = ({ children, itemsAutoWidth, onEndReached }) => {
  const [scrollX, setScrollX] = useState(0)
  const [scrollXBottom, setScrollXBottom] = useState(false)
  const scrollElement = createRef<HTMLDivElement>()

  const { t } = useTranslation('common')

  const checkIfEndIsReached = () => {
    if (scrollElement.current) {
      const endReached = scrollElement.current.scrollLeft + scrollElement.current.offsetWidth + 1 >=
        scrollElement.current.scrollWidth

      setScrollXBottom(endReached)

      if (endReached && onEndReached) {
        onEndReached()
      }
    }
  }

  useEffect(() => {
    checkIfEndIsReached()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleScrollXRightClick = () => {
    if (scrollElement.current) {
      scrollElement.current.scrollLeft += (scrollElement.current.offsetWidth - 20)
    }
  }

  const handleScrollXLeftClick = () => {
    if (scrollElement.current) {
      scrollElement.current.scrollLeft -= (scrollElement.current.offsetWidth - 20)
    }
  }

  const onScroll = () => {
    if (scrollElement.current) {
      setScrollX(scrollElement.current?.scrollLeft)
      checkIfEndIsReached()
    }
  }

  return (
    <div className={ styles.carousel__container }>
      <button
        className={ `
          ${styles.carousel__scrollButton}
          ${styles.carousel__leftScrollButton}
          ${scrollX === 0 ? styles.carousel__leftScrollButton_hidden : ''}        
        ` }
        onClick={ () => handleScrollXLeftClick() }
        title={ t('carousel_left_button_title') ?? '' }
      >
        <BsChevronLeft className={ styles.carousel__carouselIcon }/>
      </button>
      <button
        className={ `
          ${styles.carousel__scrollButton}
          ${styles.carousel__rightScrollButton}
          ${scrollXBottom ? styles.carousel__rightScrollButton_hidden : ''}        
        ` }
        onClick={ () => handleScrollXRightClick() }
        title={ t('carousel_right_button_title') ?? '' }
      >
        <BsChevronRight className={ styles.carousel__carouselIcon }/>
      </button>

      <div
        className={ styles.carousel__slider }
        ref={ scrollElement }
        onScroll={ onScroll }
      >
        { children.map((child) => (
          <div
            key={ child.key }
            className={ itemsAutoWidth ? `${styles.carousel__sliderItem_auto}` : `${styles.carousel__sliderItem}` }>
            { child.component }
          </div>
        )) }
      </div>
    </div>
  )
}
