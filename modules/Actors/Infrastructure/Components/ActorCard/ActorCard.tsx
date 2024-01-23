import Link from 'next/link'
import styles from './ActorCard.module.scss'
import { ActorCardDto } from '~/modules/Actors/Infrastructure/ActorCardDto'
import { AvatarImage } from '~/components/AvatarImage/AvatarImage'
import { FC } from 'react'
import { useTranslation } from 'next-i18next'

export interface Props {
  actor: ActorCardDto
}

export const ActorCard: FC<Props> = ({ actor }) => {
  const { t } = useTranslation('actors')

  return (
    <div className={ styles.actorCard__container }>
      <div className={ styles.actorCard__imageWrapper }>
        <Link href={ `/actors/${actor.slug}` }>
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
        >
          { actor.name }
        </Link>
        <span className={ styles.actorCard__postsNumber }>
          { `${actor.postsNumber} posts` }
        </span>
      </div>
    </div>

  )
}
