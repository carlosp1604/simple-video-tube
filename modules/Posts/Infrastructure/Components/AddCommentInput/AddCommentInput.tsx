import { FC, useState } from 'react'
import styles from './AddCommentInput.module.scss'
import { BsChatDots } from 'react-icons/bs'
import { AutoSizableTextArea } from './AutoSizableTextArea'
import useTranslation from 'next-translate/useTranslation'
import { AvatarImage } from '~/components/AvatarImage/AvatarImage'
import { useToast } from '~/components/AppToast/ToastContext'

interface Props {
  onAddComment: (username: string, comment: string) => void
  disabled: boolean
}

export const AddCommentInput: FC<Props> = ({ onAddComment, disabled }) => {
  const [comment, setComment] = useState<string>('')
  const [username, setUsername] = useState<string>('')

  const { t } = useTranslation('post_comments')

  const { error } = useToast()

  const onClickAddComment = (comment: string) => {
    if (disabled) {
      error(t('action_cannot_be_performed_error_message'))

      return
    }

    onAddComment(username, comment)
    setComment('')
  }

  const avatar = (
    <AvatarImage
      imageUrl={ null }
      avatarClassName={ styles.addCommentInput__userAvatar }
      imageClassName={ styles.addCommentInput__userAvatar }
      avatarName={ '' }
      imageAlt={ '' }
    />
  )

  return (
    <div className={ styles.addCommentInput__addCommentSection }>
      { avatar }
      <AutoSizableTextArea
        placeHolder={ t('add_comment_placeholder') }
        comment={ comment }
        onCommentChange={ (value) => setComment(value) }
        disabled={ disabled }
      />
      <button
        className={ styles.addCommentInput__addCommentButton }
        disabled={ disabled }
        onClick={ () => onClickAddComment(comment) }
        title={ t('add_comment_button_title') }
      >
        <BsChatDots className={ styles.addCommentInput__addCommentIcon }/>
      </button>
    </div>
  )
}
