import styles from './SearchBar.module.scss'
import dynamic from 'next/dynamic'
import useTranslation from 'next-translate/useTranslation'
import { nanoid } from 'nanoid'
import { TfiClose } from 'react-icons/tfi'
import { IoSearch } from 'react-icons/io5'
import { IconButton } from '~/components/IconButton/IconButton'
import { ChangeEvent, createRef, FC, KeyboardEvent, Ref, useEffect, useState } from 'react'

const Tooltip = dynamic(() =>
  import('~/components/Tooltip/Tooltip').then((module) => module.Tooltip), { ssr: false }
)

export type Style = 'main' | 'sub'

interface Props {
  onChange: (value: string) => void
  onSearch: () => void
  placeHolderTitle: string
  searchIconTitle: string
  focus: boolean
  style: Style
  clearBarOnSearch: boolean
}

export const SearchBar: FC<Partial<Props> & Omit<Props, 'style' | 'clearBarOnSearch'>> = ({
  onChange,
  onSearch,
  placeHolderTitle,
  searchIconTitle,
  focus,
  style = 'main',
  clearBarOnSearch = false,
}) => {
  const [title, setTitle] = useState<string>('')

  const { t } = useTranslation('common')

  const [mounted, setMounted] = useState<boolean>(false)
  const [tooltipId, setTooltipId] = useState<string>('')
  const inputRef: Ref<HTMLInputElement> = createRef()

  useEffect(() => {
    setMounted(true)
    setTooltipId(nanoid())

    if (inputRef && inputRef.current && inputRef.current !== document.activeElement) {
      inputRef.current.focus()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (focus && inputRef && inputRef.current && inputRef.current !== document.activeElement) {
      inputRef.current.focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus])

  const handleSearch = () => {
    onSearch()
    if (clearBarOnSearch) {
      onChange('')
      setTitle('')
    }
  }

  const handleKeyDown = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch()
      event.currentTarget.blur()
    }
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value)
    setTitle(event.target.value)
  }

  const clearInput = () => {
    setTitle('')
    onChange('')
  }

  return (
    <div className={ styles.searchBar__container }>
      <div className={ styles.searchBar__searchInputContainer }>
        <input
          className={ `${styles.searchBar__searchInput} ${style === 'sub' ? styles.searchBar__searchInputStyle2 : ''}` }
          placeholder={ placeHolderTitle }
          onKeyDown={ async (event: KeyboardEvent<HTMLInputElement>) => { await handleKeyDown(event) } }
          onChange={ (event: ChangeEvent<HTMLInputElement>) => { handleChange(event) } }
          value={ title }
          ref={ inputRef }
          spellCheck={ false }
        />
        { title !== ''
          ? <span className={ styles.searchBar__clearButton }>
            <IconButton
              onClick={ () => clearInput() }
              icon={ <TfiClose /> }
              title={ t('clear_search_button_title') }
              showTooltip={ true }
            />
          </span>
          : null
        }
      </div>
      <button
        className={ `${styles.searchBar__searchButton} ${style === 'sub' ? styles.searchBar__searchButtonStyle2 : ''}` }
        onClick={ handleSearch }
        data-tooltip-id={ tooltipId }
      >
        <IoSearch/>
        { mounted
          ? <Tooltip
            tooltipId={ tooltipId }
            place={ 'bottom' }
            content={ searchIconTitle }
          />
          : null
        }
      </button>
    </div>
  )
}
