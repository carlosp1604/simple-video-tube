import { FC, FormEvent, useState } from 'react'
import styles from './Register.module.scss'
import { useTranslation } from 'next-i18next'
import { AuthApiService } from '~/modules/Auth/Infrastructure/Frontend/AuthApiService'
import { emailValidator } from '~/modules/Auth/Infrastructure/Frontend/DataValidation'
import { FormInputSection } from '~/components/FormInputSection/FormInputSection'

export interface Props {
  onConfirm: (email: string) => void
}

export const VerifyEmail: FC<Props> = ({ onConfirm }) => {
  const { t } = useTranslation('user_signup')

  const [email, setEmail] = useState<string>('')
  const [invalidEmail, setInvalidEmail] = useState<boolean>(false)
  const [verificationError, setVerificationError] = useState<boolean>(false)
  const [resendEmail, setResendEmail] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] =
    useState<string>('')

  const authApiService = new AuthApiService()

  const onSubmit = async (event: FormEvent) => {
    setVerificationError(false)
    setErrorMessage('')
    event.preventDefault()

    if (email === '') {
      return
    }

    try {
      const result = await authApiService.verifyEmailForAccountCreation(email, resendEmail)

      if (!result.ok) {
        if (result.status === 409) {
          const jsonResponse = await result.json()

          setVerificationError(true)

          if (jsonResponse.code === 'verify-email-address-conflict-token-already-issued') {
            setResendEmail(true)
            setErrorMessage(t('verify_email_email_already_sent_message') ?? '')
          } else {
            setErrorMessage(t('verify_email_email_not_available_message') ?? '')
          }

          return
        }

        if (result.status === 422) {
          const jsonResponse = await result.json()

          setVerificationError(true)

          switch (jsonResponse.code) {
            case 'verify-email-address-invalid-email':
              setErrorMessage(t('verify_email_invalid_email_message') ?? '')
              break
            default:
              setErrorMessage(t('verify_email_server_error_message') ?? '')
              break
          }

          return
        }

        setErrorMessage(t('verify_email_server_error_message') ?? '')
        setVerificationError(true)

        return
      }

      onConfirm(email)
    } catch (exception: unknown) {
      console.error(exception)
      setErrorMessage(t('verify_email_server_error_message') ?? '')
      setVerificationError(true)
    }
  }

  const onClickHasVerificationCode = () => {
    if (email !== '' && !invalidEmail) {
      onConfirm(email)
    }
  }

  const canSubmit = (): boolean => {
    return !invalidEmail && email !== ''
  }

  return (
    <form
      className={ styles.register__container }
      onSubmit={ onSubmit }
    >
      <div className={ styles.register__title }>
        { t('verify_email_title') }
        <small className={ styles.register__subtitle }>
          { t('verify_email_subtitle') }
        </small>
      </div>

      <p className={ `
        ${styles.register__error}
        ${verificationError ? styles.register__error_visible : ''}
      ` }>
        { errorMessage }
      </p>

      <FormInputSection
        label={ t('verify_email_email_input_label') }
        errorLabel={ t('verify_email_email_error_message') }
        type={ 'email' }
        placeholder={ t('verify_email_email_input_placeholder') }
        validator={ emailValidator }
        onChange={ (value, invalidInput) => {
          setEmail(value)
          setInvalidEmail(invalidInput)
        } }
      />

      <button
        type={ 'submit' }
        className={ `
          ${styles.register__submit}
          ${canSubmit() ? styles.register__submit__enabled : ''}
          ${resendEmail ? styles.register__submit_resendEmail : ''}
        ` }
        disabled={ !canSubmit() }
      >
        { resendEmail ? t('verify_email_resend_email') : t('verify_email_submit_button') }
      </button>
      <button className={ `
        ${styles.register__verificationCodeLink}
        ${canSubmit() ? styles.register__verificationCodeLink_active : ''}
      ` }
        onClick={ onClickHasVerificationCode }
        disabled={ !canSubmit() }
      >
        { t('verify_email_already_has_a_code_button_title') }
      </button>
    </form>
  )
}