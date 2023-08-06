import { FC, useState } from 'react'
import styles from './SortingMenuDropdown.module.scss'
import { BsSortDown } from 'react-icons/bs'
import { SortingOption } from '~/components/SortingMenuDropdown/SortingMenuDropdownOptions'
import { useTranslation } from 'next-i18next'
import { IconButton } from '~/components/IconButton/IconButton'

interface Props {
  activeOption: SortingOption
  onChangeOption: (option: SortingOption) => void
  options: SortingOption[]
}

export const SortingMenuDropdown: FC<Props> = ({ activeOption, onChangeOption, options }) => {
  const [openMenu, setOpenMenu] = useState<boolean>(false)
  const { t } = useTranslation('sorting_menu_dropdown')

  return (
    <div
      className={ styles.sortingMenuDropdown__container }
      title={ t('dropdown_button_title') }
    >
      <span className={ styles.sortingMenuDropdown__dropdownButton }>
        <IconButton
          onClick={ () => setOpenMenu(!openMenu) }
          icon={ <BsSortDown className={ styles.sortingMenuDropdown__dropdownButtonIcon }/> }
        />
        { t('dropdown_explanation_title') }
      </span>

      <div className={ `
        ${styles.sortingMenuDropdown__dropdownContainer}
        ${openMenu ? styles.sortingMenuDropdown__dropdownContainer_open : ''}
      ` }
        onMouseLeave={ () => setOpenMenu(false) }
        onClick={ () => setOpenMenu(!openMenu) }
      >
        { options.map((option) => {
          return (
            <span
              key={ option.translationKey }
              className={ `
              ${styles.sortingMenuDropdown__dropdownItem}
              ${option.translationKey === activeOption.translationKey
                ? styles.sortingMenuDropdown__dropdownItem_active
                : ''}
            ` }
              onClick={ () => onChangeOption(option) }
            >
              { t(option.translationKey) }
            </span>
          )
        }) }
      </div>
    </div>
  )
}
