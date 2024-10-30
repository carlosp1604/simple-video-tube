import { ChangeEvent, FC, HTMLInputTypeAttribute, useState } from 'react'
import styles from './FormInputSection.module.scss'
import { Validator } from '~/modules/Shared/Infrastructure/FrontEnd/Validators/Validator'

interface Props {
  label: string
  errorLabel: string
  type: HTMLInputTypeAttribute
  placeholder: string
  validator: Validator<string>
  onChange: (value: string, invalidInput: boolean) => void
}

export const FormInputSection: FC<Props> = ({
  label,
  errorLabel,
  type,
  placeholder,
  validator,
  onChange,
}) => {
  const [invalidInput, setInvalidInput] = useState<boolean>(false)
  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === '') {
      setInvalidInput(false)
      onChange('', false)

      return
    }

    const isValidInput = validator.validate(event.target.value)

    if (isValidInput) {
      onChange(event.target.value, false)
      setInvalidInput(false)
    } else {
      setInvalidInput(true)
      onChange('', true)
    }
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
          ${invalidInput ? styles.formInputSection__inputElement_error : ''}
        ` }
        placeholder={ placeholder }
        onChange={ handleOnChange }
        spellCheck={ false }
      />
      <label className={ `
        ${styles.formInputSection__inputErrorMessage}
        ${invalidInput ? styles.formInputSection__inputErrorMessage_visible : ''}
      ` }>
        { errorLabel }
      </label>
    </div>
  )
}
