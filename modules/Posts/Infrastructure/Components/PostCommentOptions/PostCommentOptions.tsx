import { Dispatch, FC, ReactElement, SetStateAction, useState } from 'react'
import styles from './PostCommentOptions.module.scss'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { MenuDropdown } from '~/components/MenuDropdown/MenuDropdown'
import { FiTrash } from 'react-icons/fi'
import useTranslation from 'next-translate/useTranslation'

interface Props {
  ownerId: string
  postId: string
  postCommentId: string
  parentCommentId: string | null
  loading: boolean
  setLoading: Dispatch<SetStateAction<boolean>>
}

export const PostCommentOptions: FC<Props> = ({
  ownerId,
  postId,
  parentCommentId,
  postCommentId,
  loading,
  setLoading,
}) => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false)

  const { t } = useTranslation('post_comments')

  const menuDropdownIcon: ReactElement = (
    <BsThreeDotsVertical className={ `
      ${styles.postCommentOptions__optionsIcon}
      ${menuOpen ? styles.postCommentOptions__optionsIcon_open : ''}
    ` }
      onClick={ () => setMenuOpen(!menuOpen) }
    />
  )

  return (
    <MenuDropdown
      buttonIcon={ menuDropdownIcon }
      isOpen={ menuOpen }
      setIsOpen={ setMenuOpen }
      options={ [{
        title: t('delete_comment_option_title'),
        icon: <FiTrash />,
        onClick: async () => { console.log('asd') },
      }] }
      title={ t('post_comment_menu_options_title') }
    />
  )
}
