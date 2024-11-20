import Link from 'next/link'
import styles from './ProfileCard.module.scss'
import { ActorCardDto } from '~/modules/Actors/Infrastructure/ActorCardDto'
import { AvatarImage } from '~/components/AvatarImage/AvatarImage'
import { FC } from 'react'
import useTranslation from 'next-translate/useTranslation'
import { NumberFormatter } from '~/modules/Shared/Infrastructure/FrontEnd/NumberFormatter'
import { useRouter } from 'next/router'
import { i18nConfig } from '~/i18n.config'
import { ProducerCardDto } from '~/modules/Producers/Infrastructure/ProducerCardDto'

export interface Props {
  profile: ActorCardDto | ProducerCardDto
}

export const ProfileCard: FC<Props> = ({ profile }) => {
  const { t } = useTranslation('common')

  const locale = useRouter().locale ?? i18nConfig.defaultLocale

  let route = ''
  let views = 0
  let imageAlt = ''

  if ('actorViews' in profile) {
    route = 'actors'
    views = profile.actorViews
    imageAlt = t('profile_actor_card_image_alt_title', { actorName: profile.name })
  }

  if ('producerViews' in profile) {
    route = 'producers'
    views = profile.producerViews
    imageAlt = t('profile_producer_card_image_alt_title', { producerName: profile.name })
  }

  return (
    <div className={ styles.profileCard__container }>
      <div className={ styles.profileCard__imageWrapper }>
        <Link
          prefetch={ false }
          href={ `/${route}/${profile.slug}` }
          title={ profile.name }
        >
          <AvatarImage
            imageUrl={ profile.imageUrl }
            avatarClassName={ styles.profileCard__profileAvatar }
            imageClassName={ styles.profileCard__profileImage }
            avatarName={ profile.name }
            imageAlt={ imageAlt }
            rounded={ false }
          />
        </Link>
      </div>
      <div className={ styles.profileCard__dataContainer }>
        <Link
          prefetch={ false }
          className={ styles.profileCard__profileName }
          href={ `/${route}/${profile.slug}` }
          title={ profile.name }
        >
          { profile.name }
        </Link>
        <div className={ styles.profileCard__countSection }>
          { t('profile_card_posts_count_title', { postsNumber: profile.postsNumber }) }
          <span className={ styles.profileCard__viewsTitle }>
            { t('profile_card_views_count_title',
              { viewsNumber: NumberFormatter.compatFormat(views, locale) }) }
          </span>
        </div>
      </div>
    </div>
  )
}
