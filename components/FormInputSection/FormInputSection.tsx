import { ChangeEvent, FC, HTMLInputTypeAttribute } from 'react'
import styles from './FormInputSection.module.scss'

interface Props {
  label: string
  errorLabel: string
  type: HTMLInputTypeAttribute
  placeholder: string
  invalidInput: boolean
  value: string
  onChange: (value: string) => void
}

export const FormInputSection: FC<Props> = ({
  label,
  errorLabel,
  type,
  placeholder,
  invalidInput,
  value,
  onChange,
}) => {
  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === '') {
      onChange('')

      return
    }

    onChange(event.target.value)
  }

  return (
    <div className={ styles.formInputSection__container }>
      <label className={ styles.formInputSection__inputLabel }>
        { label }
      </label>
      <input
        type={ type }
        className={ `
          ${styles.formInputSection__inputElement}
          ${invalidInput && value ? styles.formInputSection__inputElement_error : ''}
        ` }
        placeholder={ placeholder }
        onChange={ handleOnChange }
        spellCheck={ false }
        value={ value }
      />
      <label className={ `
        ${styles.formInputSection__inputErrorMessage}
        ${invalidInput && value ? styles.formInputSection__inputErrorMessage_visible : ''}
      ` }>
        { errorLabel }
      </label>
    </div>
  )
}
