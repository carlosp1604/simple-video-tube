import { FC, ReactNode } from 'react'
import styles from './PostCardGalleryHeader.module.scss'
import { SortingMenuDropdown } from '~/components/SortingMenuDropdown/SortingMenuDropdown'
import { PostsPaginationSortingType } from '~/modules/Shared/Infrastructure/FrontEnd/PostsPaginationSortingType'

interface Props {
  title: string | ReactNode
  subtitle: string
  showSortingOptions: boolean
  activeOption: PostsPaginationSortingType
  sortingOptions: PostsPaginationSortingType[]
  onChangeOption: (option: PostsPaginationSortingType) => void
  loading: boolean
}

export const PostCardGalleryHeader: FC<Partial<Props> & Omit<Props, 'loading'>> = ({
  title,
  subtitle,
  showSortingOptions,
  activeOption,
  sortingOptions,
  onChangeOption,
  loading = false,
}) => {
  return (
    <div className={ styles.postCardGalleryHeader__container }>
      <div className={ styles.postCardGalleryHeader__title }>
        { title }
        { loading
          ? <span className={ styles.postCardGalleryHeader__videosQuantitySkeeleton }/>
          : <small className={ styles.postCardGalleryHeader__videosQuantity }>
              { subtitle }
            </small>
        }
      </div>

      <SortingMenuDropdown
        activeOption={ activeOption }
        options={ sortingOptions }
        onChangeOption={ onChangeOption }
        loading={ loading }
        visible={ showSortingOptions }
      />

    </div>
  )
}
