import { FC, ReactElement } from 'react'
import styles from './ProfileHeader.module.scss'
import { AvatarImage } from '~/components/AvatarImage/AvatarImage'

export interface Props {
  name: string
  profileType: string
  subtitle: string
  icon: ReactElement
  imageUrl: string | null
  imageAlt: string
}

export const ProfileHeader: FC<Props> = ({ name, profileType, subtitle, icon, imageUrl, imageAlt }) => {
  return (
    <header className={ styles.profileHeader__container }>
      <div className={ styles.profileHeader__nameImageContainer } >
        <AvatarImage
          imageUrl={ imageUrl }
          avatarClassName={ styles.profileHeader__avatar }
          imageClassName={ styles.profileHeader__image }
          avatarName={ name }
          imageAlt={ imageAlt }
        />

        <h1 className={ styles.profileHeader__name }>
          { name }
          <small className={ styles.profileHeader__profileType }>
            { icon }
            { profileType }
          </small>
          <small className={ styles.profileHeader__subtitle }>
            { subtitle }
          </small>
        </h1>
      </div>
    </header>
  )
}
