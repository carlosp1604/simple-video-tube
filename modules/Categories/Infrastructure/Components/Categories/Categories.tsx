import { FC, useMemo, useState } from 'react'
import styles from './Categories.module.scss'
import { CategoryCardComponentDto } from '~/modules/Categories/Infrastructure/Dtos/CategoryCardComponentDto'
import { CategoryCard } from '~/modules/Categories/Infrastructure/Components/CategoryCard/CategoryCard'
import { CommonGalleryHeader } from '~/modules/Shared/Infrastructure/Components/CommonGalleryHeader/CommonGalleryHeader'
import useTranslation from 'next-translate/useTranslation'
import { SearchBar } from '~/components/SearchBar/SearchBar'
import { CommonButton } from '~/modules/Shared/Infrastructure/Components/CommonButton/CommonButton'
import { EmptyState } from '~/components/EmptyState/EmptyState'
import { useToast } from '~/components/AppToast/ToastContext'

export interface Props {
  categoryCards: CategoryCardComponentDto[]
}

export const Categories: FC<Props> = ({ categoryCards }) => {
  const [searchBarTerm, setSearchBarTerm] = useState<string>('')
  const [currentTerm, setCurrentTerm] = useState<string>('')

  const { t } = useTranslation('categories')
  const { error } = useToast()

  const categoriesToShow = useMemo(() => {
    return categoryCards.filter((category) => {
      return category.name.toLocaleLowerCase().includes(currentTerm.toLocaleLowerCase())
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTerm])

  const onSearch = async () => {
    const dompurify = (await import('dompurify')).default
    const cleanTerm = dompurify.sanitize(searchBarTerm.trim())

    if (!currentTerm && cleanTerm === '') {
      return
    }

    if (currentTerm && currentTerm === cleanTerm) {
      error(t('already_searching_term_error_message'))

      return
    }

    setCurrentTerm(cleanTerm)
    setSearchBarTerm('')
  }

  let galleryHeader

  if (currentTerm) {
    galleryHeader = (
      <CommonGalleryHeader
        title={ 'categories:categories_search_result_title' }
        subtitle={ t('categories_gallery_subtitle', { categoriesNumber: categoriesToShow.length }) }
        term={ { title: 'searchTerm', value: currentTerm } }
      />
    )
  } else {
    galleryHeader = (
      <CommonGalleryHeader
        title={ t('categories_gallery_title') }
        subtitle={ t('categories_gallery_subtitle', { categoriesNumber: categoriesToShow.length }) }
      />
    )
  }

  return (
    <div className={ styles.categories__container }>
      { galleryHeader }

      <div className={ styles.categories__searchBar }>
        { currentTerm &&
          <CommonButton
            title={ t('categories_see_all_button_title') }
            disabled={ !currentTerm }
            onClick={ () => setCurrentTerm('') }
          />
        }
        <SearchBar
          onChange={ setSearchBarTerm }
          onSearch={ onSearch }
          placeHolderTitle={ t('categories_search_placeholder_title') }
          searchIconTitle={ t('categories_search_button_title') }
          style={ 'sub' }
          focus={ false }
          clearBarOnSearch={ true }
        />
      </div>

      <section className={ styles.categories__categoriesGalleryContainer }>
        { categoriesToShow.map((categoryCardDto) => (
          <CategoryCard
            key={ categoryCardDto.id }
            categoryCardDto={ categoryCardDto }/>
        )) }
      </section>

      { categoriesToShow.length === 0 &&
        <EmptyState
          title={ t('categories_gallery_empty_state_title') }
          subtitle={ t('categories_gallery_empty_state_subtitle') }
        />
      }
    </div>
  )
}
