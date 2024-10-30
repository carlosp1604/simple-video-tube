import Link from 'next/link'
import styles from './ActorCard.module.scss'
import { ActorCardDto } from '~/modules/Actors/Infrastructure/ActorCardDto'
import { AvatarImage } from '~/components/AvatarImage/AvatarImage'
import { FC } from 'react'
import useTranslation from 'next-translate/useTranslation'
import { NumberFormatter } from '~/modules/Shared/Infrastructure/FrontEnd/NumberFormatter'
import { useRouter } from 'next/router'
import { i18nConfig } from '~/i18n.config'

export interface Props {
  actor: ActorCardDto
}

export const ActorCard: FC<Props> = ({ actor }) => {
  const { t } = useTranslation('actors')

  const locale = useRouter().locale ?? i18nConfig.defaultLocale

  return (
    <div className={ styles.actorCard__container }>
      <div className={ styles.actorCard__imageWrapper }>
        <Link
          href={ `/actors/${actor.slug}` }
          title={ actor.name }
        >
          <AvatarImage
            imageUrl={ actor.imageUrl }
            avatarClassName={ styles.actorCard__actorAvatar }
            imageClassName={ styles.actorCard__actorImage }
            avatarName={ actor.name }
            imageAlt={ t('actor_card_image_alt_title', { actorName: actor.name }) }
            rounded={ false }
          />
        </Link>
      </div>
      <div className={ styles.actorCard__dataContainer }>
        <Link
          className={ styles.actorCard__actorName }
          href={ `/actors/${actor.slug}` }
          title={ actor.name }
        >
          { actor.name }
        </Link>
        <div className={ styles.actorCard__countSection }>
          { t('actor_card_posts_count_title', { postsNumber: actor.postsNumber }) }
          <span className={ styles.actorCard__viewsTitle }>
            { t('actor_card_views_count_title',
              { viewsNumber: NumberFormatter.compatFormat(actor.actorViews, locale) }) }
          </span>
        </div>
      </div>
    </div>
  )
}
