import { ChangeEvent, FC, useRef } from 'react'
import styles from './AutoSizableTextArea.module.scss'

interface AutoSizableTextAreaProps {
  placeHolder: string
  onCommentChange: (value: string) => void
  comment: string
}

export const AutoSizableTextArea: FC<AutoSizableTextAreaProps> = ({
  placeHolder,
  onCommentChange,
  comment,
}) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  const handleOnChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onCommentChange(event.target.value)

    if (textAreaRef !== null && textAreaRef.current !== null) {
      // We need to keep sync this with the styles (32px = h-8)
      textAreaRef.current.style.height = '32px'

      let scrollHeight = textAreaRef.current.scrollHeight

      if (scrollHeight === 0) {
        scrollHeight = 40
      }
      textAreaRef.current.style.height = Math.min(scrollHeight, 90) + 'px'
    }
  }

  return (
    <textarea
      className={ styles.autoSizableTextArea__commentInput }
      placeholder={ placeHolder }
      onChange={ handleOnChange }
      value={ comment }
      ref={ textAreaRef }
    />
  )
}
