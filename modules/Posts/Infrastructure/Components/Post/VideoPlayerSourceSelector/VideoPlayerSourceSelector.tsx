import { FC } from 'react'
import styles from './VideoPlayerSourceSelector.module.scss'
import { MediaUrlComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostMedia/MediaUrlComponentDto'
import {
  ChangeVideoPlayerSourceAction,
  VideoPostCategory
} from '~/modules/Shared/Infrastructure/FrontEnd/AnalyticsEvents/PostPage'
import { sendGAEvent } from '@next/third-parties/google'

export interface Props {
  selectableMediaUrl: MediaUrlComponentDto[]
  selectedMediaUrl: MediaUrlComponentDto | null
  setSelectedMediaUrl: (mediaUrl: MediaUrlComponentDto) => void
}

export const VideoPlayerSourceSelector: FC<Props> = ({ setSelectedMediaUrl, selectedMediaUrl, selectableMediaUrl }) => {
  const onClickOption = (mediaUrl: MediaUrlComponentDto) => {
    setSelectedMediaUrl(mediaUrl)

    sendGAEvent('event', ChangeVideoPlayerSourceAction, {
      category: VideoPostCategory,
      label: mediaUrl.provider.name,
    })
  }

  return (
    <div className={ styles.videoPlayerSourceSelector__container }>
      { selectableMediaUrl.map((selectableUrl) => {
        return (
          <button
            className={ styles.videoPlayerSourceSelector__optionContainer }
            key={ selectableUrl.url }
            onClick={ () => onClickOption(selectableUrl) }
          >
            { selectableUrl.provider.name }
          </button>
        )
      }) }
    </div>
  )
}
