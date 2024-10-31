import styles from './ReportModal.module.scss'
import { FC, useCallback, useState } from 'react'
import useTranslation from 'next-translate/useTranslation'
import { ModalMenuHeader } from '~/modules/Shared/Infrastructure/Components/ModalMenuHeader/ModalMenuHeader'
import { MdOutlineFlag } from 'react-icons/md'
import { FormInputSection } from '~/components/FormInputSection/FormInputSection'
import { SubmitButton } from '~/components/SubmitButton/SubmitButton'
import { TextArea } from '~/modules/Posts/Infrastructure/Components/AddCommentInput/TextArea'
import { NameValidator } from '~/modules/Shared/Infrastructure/FrontEnd/Validators/NameValidator'
import { EmailValidator } from '~/modules/Shared/Infrastructure/FrontEnd/Validators/EmailValidator'
import { Modal } from '~/components/Modal/Modal'
import { ReportsApiService } from '~/modules/Reports/Infrastructure/Frontend/ReportsApiService'
import { FaRegCircleCheck } from 'react-icons/fa6'
import { BiErrorAlt } from 'react-icons/bi'
import { APIException } from '~/modules/Shared/Infrastructure/FrontEnd/ApiException'
import { useToast } from '~/components/AppToast/ToastContext'
import { CommonButton } from '~/modules/Shared/Infrastructure/Components/CommonButton/CommonButton'

export interface Props {
  postId: string
  isOpen: boolean
  onClose: () => void
}

type ReportModalStep = 'report' | 'success' | 'error'

export const ReportModal: FC<Props> = ({ postId, isOpen, onClose }) => {
  const { t } = useTranslation('post')

  const [userName, setUserName] = useState<string>('')
  const [validName, setValidName] = useState<boolean>(false)
  const [userEmail, setUserEmail] = useState<string>('')
  const [validEmail, setValidEmail] = useState<boolean>(false)
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const [reportModalStep, setReportModalStep] = useState<ReportModalStep>('report')
  const [errorMessage, setErrorMessage] = useState('')

  const { error } = useToast()

  const onUserNameChange = useCallback((value: string) => {
    const isValidInput = new NameValidator().validate(value)

    setUserName(value)
    setValidName(isValidInput)
  }, [])

  const onUserEmailChange = useCallback((value: string) => {
    const isValidInput = new EmailValidator().validate(value)

    setUserEmail(value)
    setValidEmail(isValidInput)
  }, [])

  const onContentChange = (value: string) => {
    setContent(value)
  }

  const onSubmit = async () => {
    if (userEmail === '' || userName === '' || content === '') {
      return
    }

    const reportsApiService = new ReportsApiService()

    try {
      setLoading(true)

      await reportsApiService.create(
        postId,
        userName,
        userEmail,
        content
      )

      setReportModalStep('success')
    } catch (exception: unknown) {
      if (!(exception instanceof APIException)) {
        console.error(exception)

        return
      }

      if (exception.apiCode === 422) {
        error(t(`api_exceptions:${exception.translationKey}`))

        return
      }

      setErrorMessage(t(`api_exceptions:${exception.translationKey}`))
      setReportModalStep('error')
    } finally {
      setContent('')
      setUserEmail('')
      setUserName('')
      setLoading(false)
    }
  }

  let modalContent = (
    <div className={ styles.reportModal__container }>
      <ModalMenuHeader
        title={ t('post_report_section_title') }
        subtitle={ t('post_report_section_subtitle') }
        icon={ <MdOutlineFlag/> }
      />
      <FormInputSection
        label={ t('post_report_section_name_label_title') }
        errorLabel={ t('post_report_section_invalid_name_message_title') }
        type={ 'text' }
        placeholder={ t('post_report_section_name_placeholder') }
        invalidInput={ !validName }
        onChange={ onUserNameChange }
        value={ userName }
      />

      <FormInputSection
        label={ t('post_report_section_email_label_title') }
        errorLabel={ t('post_report_section_invalid_email_message_title') }
        type={ 'email' }
        placeholder={ t('post_report_section_email_placeholder') }
        invalidInput={ !validEmail }
        onChange={ onUserEmailChange }
        value={ userEmail }
      />

      <span className={ styles.reportModal__infoSectionTitle }>
        { t('post_report_section_info_label_title') }
      </span>

      <TextArea
        placeHolder={ t('post_report_section_info_label_placeholder') }
        onCommentChange={ onContentChange }
        comment={ content }
        disabled={ false }
        maxLength={ 1024 }
      />

      <SubmitButton
        title={ t('post_report_section_submit_button_title') }
        disabled={ userEmail === '' || userName === '' || content === '' }
        loading={ loading }
        onClick={ onSubmit }
      />
    </div>
  )

  if (reportModalStep === 'success') {
    modalContent = (
      <div className={ styles.reportModal__container }>
        <FaRegCircleCheck className={ styles.reportModal__successIcon }/>
        <span className={ styles.reportModal__message }>
          { t('post_report_section_success_message') }
        </span>
      </div>
    )
  }

  if (reportModalStep === 'error') {
    modalContent = (
      <div className={ styles.reportModal__container }>
        <BiErrorAlt className={ styles.reportModal__errorIcon }/>
        <span className={ styles.reportModal__message }>
          { errorMessage }
        </span>

        <CommonButton
          title={ t('post_report_section_try_again_button_message') }
          disabled={ false }
          onClick={ () => setReportModalStep('report') }
        />
      </div>
    )
  }

  return (
    <Modal
      isOpen={ isOpen }
      onClose={ onClose }
    >
      { modalContent }
    </Modal>
  )
}
