import styles from './DownloadMenu.module.scss'
import { FC, useState } from 'react'
import { Modal } from '~/components/Modal/Modal'
import { MenuOptionComponentInterface, MenuOptions } from '~/components/MenuOptions/MenuOptions'
import useTranslation from 'next-translate/useTranslation'
import Image from 'next/image'
import { MediaUrlComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostMedia/MediaUrlComponentDto'
import { ModalMenuHeader } from '~/modules/Shared/Infrastructure/Components/ModalMenuHeader/ModalMenuHeader'
import { rgbDataURL } from '~/modules/Shared/Infrastructure/FrontEnd/BlurDataUrlHelper'
import { MediaUrlsHelper } from '~/modules/Posts/Infrastructure/Frontend/MediaUrlsHelper'
import { MdFileDownload } from 'react-icons/md'
import { MediaProviderComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostMedia/MediaProviderComponentDto'
import {
  ProviderInfoMenu
} from '~/modules/Posts/Infrastructure/Components/Post/DownloadMenu/ProviderInfoMenu/ProviderInfoMenu'
import { IconButton } from '~/components/IconButton/IconButton'
import { BsArrowLeft } from 'react-icons/bs'

interface Props {
  mediaUrls: MediaUrlComponentDto[]
  setIsOpen: (isOpen: boolean) => void
  isOpen: boolean
  onClickOption: (mediaUrl: MediaUrlComponentDto) => void
}

export const DownloadMenu: FC<Props> = ({ mediaUrls, setIsOpen, isOpen, onClickOption }) => {
  const [provider, setProvider] = useState<MediaProviderComponentDto | null>(null)
  const { t } = useTranslation('post')

  const menuOptions: MenuOptionComponentInterface[] = MediaUrlsHelper.sortMediaUrl(mediaUrls, true).map((mediaUrl) => {
    return {
      title: `${mediaUrl.provider.name}: ${mediaUrl.title}`,
      action: {
        url: mediaUrl.url,
        blank: true,
      },
      picture: (
        <Image
          alt={ t('post_download_option_alt_title', { providerName: mediaUrl.provider.name }) }
          className={ styles.downloadMenu__optionImage }
          src={ mediaUrl.provider.logoUrl }
          width={ 0 }
          height={ 0 }
          sizes={ '100vw' }
          fill={ false }
          priority={ true }
          placeholder={ 'blur' }
          blurDataURL={ rgbDataURL(81, 80, 80) }
        />
      ),
      isActive: false,
      onClick: () => onClickOption(mediaUrl),
      onClickInfoButton: () => {
        setProvider(mediaUrl.provider)
      },
    }
  })

  let content = (
    <div className={ styles.downloadMenu__container }>
      <ModalMenuHeader
        title={ t('post_download_section_title') }
        subtitle={ t('post_download_section_description') }
        icon={ <MdFileDownload/> }
      />
      <div className={ styles.downloadMenu__menuOptionsContainer }>
        <MenuOptions menuOptions={ menuOptions }/>
      </div>
    </div>
  )

  if (provider !== null) {
    content = (
      <>
        <div className={ styles.downloadMenu__backContainer }>
          <IconButton
            onClick={ () => setProvider(null) }
            icon={ <BsArrowLeft /> }
            title={ t('post_provider_modal_back_button_title') }
          />
          { t('post_provider_modal_back_button_title') }
        </div>
        <ProviderInfoMenu provider={ provider } />
      </>
    )
  }

  return (
    <Modal
      isOpen={ isOpen }
      onClose={ () => {
        if (provider === null) {
          setIsOpen(false)
        } else {
          setProvider(null)
        }
      } }
    >
      { content }
    </Modal>
  )
}
