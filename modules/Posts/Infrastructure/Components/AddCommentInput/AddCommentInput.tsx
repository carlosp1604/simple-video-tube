import { FC, useState } from 'react'
import styles from './AddCommentInput.module.scss'
import { TextArea } from './TextArea'
import useTranslation from 'next-translate/useTranslation'
import { useToast } from '~/components/AppToast/ToastContext'
import { FormInputSection } from '~/components/FormInputSection/FormInputSection'
import { NameValidator } from '~/modules/Shared/Infrastructure/FrontEnd/Validators/NameValidator'
import { CommonButton } from '~/modules/Shared/Infrastructure/Components/CommonButton/CommonButton'

interface Props {
  onAddComment: (username: string, comment: string) => void
  disabled: boolean
}

export const AddCommentInput: FC<Props> = ({ onAddComment, disabled }) => {
  const [comment, setComment] = useState<string>('')
  const [userName, setUserName] = useState<string>('')

  const { t } = useTranslation('post_comments')

  const { error } = useToast()

  const onClickAddComment = (comment: string) => {
    if (disabled) {
      error(t('action_cannot_be_performed_error_message'))

      return
    }

    onAddComment(userName, comment)
    setComment('')
    setUserName('')
  }

  const enableSubmitButton = () => {
    return comment !== '' && userName !== ''
  }

  return (
    <div className={ styles.addCommentInput__addCommentSection }>
      <FormInputSection
        label={ t('add_comment_name_label_title') }
        errorLabel={ t('add_comment_name_invalid_name_message_error') }
        type={ 'text' }
        placeholder={ t('add_comment_name_placeholder') }
        validator={ new NameValidator() }
        onChange={ setUserName }
      />

      <span className={ styles.addCommentInput__addCommentLabel }>
        { t('add_comment_comment_label_title') }
      </span>

      <TextArea
        placeHolder={ t('add_comment_placeholder') }
        comment={ comment }
        onCommentChange={ (value) => setComment(value) }
        disabled={ disabled }
        maxLength={ 1024 }
      />

      <CommonButton
        title={ t('add_comment_button_title') }
        disabled={ disabled || !enableSubmitButton() }
        onClick={ () => onClickAddComment(comment) }
      />
    </div>
  )
}
