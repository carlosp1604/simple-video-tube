import { FC, ReactElement, useMemo } from 'react'
import styles from './PaginationBar.module.scss'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import { ElementLinkMode } from '~/modules/Shared/Infrastructure/FrontEnd/ElementLinkMode'
import { PaginationHelper } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import { PaginationBarButton } from '~/components/PaginationBar/PaginationBarButton/PaginationBarButton'
import { CommonButton } from '~/modules/Shared/Infrastructure/Components/CommonButton/CommonButton'
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight
} from 'react-icons/md'
import { CommonButtonLink } from '~/modules/Shared/Infrastructure/Components/CommonButton/CommonLinkButton'

interface Props {
  pageNumber: number
  pagesNumber: number
  disabled: boolean
  linkMode: ElementLinkMode | undefined
  onPageChange: (page: number) => void
}

export const PaginationBar: FC<Partial<Props> & Pick<Props, 'pagesNumber' | 'pageNumber' | 'linkMode'>> = ({
  pagesNumber,
  pageNumber,
  linkMode,
  disabled = false,
  onPageChange = undefined,
}) => {
  const { t } = useTranslation('pagination_bar')

  const { pathname, query } = useRouter()

  const buildQuery = (page: number) => {
    const newQuery = { ...query }

    if (page === 1) {
      delete newQuery.page
    } else {
      newQuery.page = String(page)
    }

    return newQuery
  }

  const availablePages = useMemo(() => {
    return PaginationHelper.getShowablePages(
      pageNumber, pagesNumber)
  }, [pageNumber, pagesNumber])

  const pageElements = availablePages.map((availablePage) => {
    return (
      <PaginationBarButton
        title={ t('n_page_button_title', { pageNumber: availablePage }) }
        linkTitle={ String(availablePage) }
        href={ { pathname, query: buildQuery(availablePage) } }
        active={ availablePage === pageNumber }
        linkMode={ linkMode }
        onClickButton={ () => { if (onPageChange && !disabled) { onPageChange(availablePage) } } }
        key={ t('n_page_button_title', { pageNumber: availablePage }) }
        disabled={ disabled }
      />
    )
  })

  let content: ReactElement

  if (pageNumber > pagesNumber && !disabled) {
    if (linkMode) {
      return (
        <span className={ styles.paginationBar__errorButton }>
          <CommonButtonLink
            title={ t('error_state_button_title') }
            linksProps={ {
              href: { pathname, query: buildQuery(1) },
              shallow: linkMode.shallowNavigation,
              scroll: linkMode.scrollOnClick,
              replace: true,
            } }
          />
        </span>
      )
    } else {
      return (
        <span className={ styles.paginationBar__errorButton }>
          <CommonButton
            title={ t('error_state_button_title') }
            disabled={ false }
            onClick={ () => onPageChange && onPageChange(1) }
          />
        </span>
      )
    }
  } else if (pagesNumber === 1) {
    return null
  } else {
    content = (
      <div className={ styles.paginationBar__container }>
        <ul className={ styles.paginationBar__listContainer }>
          <PaginationBarButton
            title={ t('first_page_button_title') }
            linkTitle={ <MdKeyboardDoubleArrowLeft className={ styles.paginationBar__stepIcon }/> }
            href={ { pathname, query: buildQuery(1) } }
            active={ false }
            linkMode={ linkMode }
            onClickButton={ () => { if (onPageChange && !disabled) { onPageChange(1) } } }
            key={ t('first_page_button_title') }
            disabled={ disabled || pageNumber === 1 }
            hideDirection={ 'left' }
          />
          <PaginationBarButton
            title={ t('previous_page_button_title') }
            linkTitle={ <MdKeyboardArrowLeft className={ styles.paginationBar__stepIcon }/> }
            href={ { pathname, query: buildQuery(pageNumber - 1) } }
            active={ false }
            linkMode={ linkMode }
            onClickButton={ () => { if (onPageChange && !disabled) { onPageChange(pageNumber - 1) } } }
            key={ t('previous_page_button_title') }
            disabled={ disabled || pageNumber === 1 }
            hideDirection={ 'left' }
          />

          { pageElements }

          { !(availablePages.includes(pagesNumber))
            ? <PaginationBarButton
              title={ t('n_page_button_title', { pageNumber: pagesNumber }) }
              linkTitle={ String(pagesNumber) }
              href={ { pathname, query: buildQuery(pagesNumber) } }
              active={ pagesNumber === pageNumber }
              linkMode={ linkMode }
              onClickButton={ () => { if (onPageChange && !disabled) { onPageChange(pagesNumber) } } }
              key={ t('n_page_button_title', { pageNumber: pagesNumber }) }
              disabled={ disabled }
            />
            : null
          }

          <PaginationBarButton
            title={ t('next_page_button_title') }
            linkTitle={ <MdKeyboardArrowRight className={ styles.paginationBar__stepIcon }/> }
            href={ { pathname, query: buildQuery(pageNumber + 1) } }
            active={ false }
            linkMode={ linkMode }
            onClickButton={ () => { if (onPageChange && !disabled) { onPageChange(pageNumber + 1) } } }
            key={ t('next_page_button_title') }
            disabled={ disabled || pageNumber === pagesNumber }
            hideDirection={ 'right' }
          />

          <PaginationBarButton
            title={ t('last_page_button_title') }
            linkTitle={ <MdKeyboardDoubleArrowRight className={ styles.paginationBar__stepIcon }/> }
            href={ { pathname, query: buildQuery(pagesNumber) } }
            active={ false }
            linkMode={ linkMode }
            onClickButton={ () => { if (onPageChange && !disabled) { onPageChange(pagesNumber) } } }
            key={ t('last_page_button_title') }
            disabled={ disabled || pageNumber === pagesNumber }
            hideDirection={ 'right' }
          />
        </ul>
      </div>
    )
  }

  return (content)
}
