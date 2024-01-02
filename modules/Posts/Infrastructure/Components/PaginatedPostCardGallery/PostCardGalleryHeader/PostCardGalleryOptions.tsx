import styles from './PostCardGalleryOptions.module.scss'
import { FC, ReactElement } from 'react'
import { Modal } from '~/components/Modal/Modal'
import { MenuOptionComponentInterface, MenuOptions } from '~/components/MenuOptions/MenuOptions'
import { useTranslation } from 'next-i18next'
import { BsTools } from 'react-icons/bs'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'

export interface PostCardGalleryOption {
  title: string
  icon: ReactElement
  onClick: (postCard: PostCardComponentDto) => void
}

interface Props {
  isOpen: boolean
  onClose: () => void
  options: PostCardGalleryOption[]
  selectedPostCard: PostCardComponentDto
}

export const PostCardGalleryOptions: FC<Props> = ({ isOpen, onClose, options, selectedPostCard }) => {
  const { t } = useTranslation('post_card_gallery')

  const buildOptions: MenuOptionComponentInterface[] = options.map((option) => {
    return {
      title: option.title,
      isActive: false,
      onClick: () => option.onClick(selectedPostCard),
      action: undefined,
      picture: option.icon,
    }
  })

  return (
    <Modal
      isOpen={ isOpen }
      onClose={ () => onClose() }
    >
      <div className={ styles.postCardGalleryOptions__container }>
        <div className={ styles.postCardGalleryOptions__titleSection }>
          <span className={ styles.postCardGalleryOptions__iconWrapper }>
            <BsTools className={ styles.postCardGalleryOptions__icon }/>
          </span>
          <span className={ styles.postCardGalleryOptions__title }>
            { t('post_card_gallery_options_title') }
            <small className={ styles.postCardGalleryOptions__subtitle }>
              { t('post_card_gallery_options_description') }
            </small>
          </span>
        </div>
        <MenuOptions menuOptions={ buildOptions } />
      </div>
    </Modal>
  )
}