import styles from './ReportModal.module.scss'
import { FC, useState } from 'react'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import { ModalMenuHeader } from '~/modules/Shared/Infrastructure/Components/ModalMenuHeader/ModalMenuHeader'
import dynamic from 'next/dynamic'
import { MdOutlineFlag } from 'react-icons/md'
import { FormInputSection } from '~/components/FormInputSection/FormInputSection'
import { z } from 'zod'
import { SubmitButton } from '~/components/SubmitButton/SubmitButton'
import { AutoSizableTextArea } from '~/modules/Posts/Infrastructure/Components/AddCommentInput/AutoSizableTextArea'

const Modal = dynamic(() =>
  import('~/components/Modal/Modal').then((module) => module.Modal),
{ ssr: false }
)

export interface Props {
  isOpen: boolean
  onClose: () => void
}

export const ReportModal: FC<Props> = ({ isOpen, onClose }) => {
  const { t } = useTranslation('post')

  const [userName, setUserName] = useState<string>('')
  const [userEmail, setUserEmail] = useState<string>('')
  const [content, setContent] = useState<string>('')

  const { pathname, query, asPath, push } = useRouter()
  const locale = useRouter().locale ?? 'en'

  const onUserNameChange = (value: string) => {
    setUserName(value)
  }

  const onUserEmailChange = (value: string) => {
    setUserEmail(value)
  }

  const onContentChange = (value: string) => {
    setContent(value)
  }

  return (
    <Modal
      isOpen={ isOpen }
      onClose={ onClose }
    >
      <div className={ styles.reportModal__container }>
        <ModalMenuHeader
          title={ 'Report' }
          subtitle={ 'Submit a report related to current post' }
          icon={ <MdOutlineFlag /> }
        />
        <FormInputSection
          label={ 'Name' }
          errorLabel={ 'Invalid name' }
          type={ 'text' }
          placeholder={ 'Name' }
          validator={ z.string() }
          onChange={ onUserNameChange }
        />

        <FormInputSection
          label={ 'Email' }
          errorLabel={ 'Invalid email' }
          type={ 'email' }
          placeholder={ 'Email' }
          validator={ z.string().email() }
          onChange={ onUserEmailChange }
        />

        <div></div>
        <AutoSizableTextArea
          placeHolder={ 'Info (1024 characters)' }
          onCommentChange={ onContentChange }
          comment={ content }
          disabled={ false }
        />

        <SubmitButton
          title={ 'Reportar' }
          enableButton={ userEmail !== '' && userName !== '' }
          loading={ false }
        />
      </div>
    </Modal>
  )
}
