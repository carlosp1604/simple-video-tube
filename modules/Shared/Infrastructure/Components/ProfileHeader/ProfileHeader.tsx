import { FC } from 'react'
import styles from './ProfileHeader.module.scss'
import { AvatarImage } from '~/components/AvatarImage/AvatarImage'

export interface Props {
  name: string
  imageUrl: string | null
  imageAlt: string
  rounded: boolean
}

export const ProfileHeader: FC<Props> = ({ name, imageUrl, imageAlt, rounded }) => {
  return (
      <header className={ styles.profileHeader__container }>
        <div className={ styles.profileHeader__background }/>
        { /**
          <Image
            src={ actor.backgroundImage }
            width={ 0 }
            height={ 0 }
            sizes={ '100vw' }
            alt={ 'aaa' }
            className={ styles.actorProfileHeader__backgroundImage }
          />
        **/ }
        <div className={ styles.profileHeader__infoContainer }>
          <div className={ styles.profileHeader__nameImageContainer } >
            <AvatarImage
              imageUrl={ imageUrl }
              avatarClassName={ `
                ${styles.profileHeader__avatar}
                ${rounded ? styles.profileHeader__avatar__rounded : ''}
              ` }
              imageClassName={ `
                ${styles.profileHeader__image}
                ${rounded ? styles.profileHeader__image__rounded : ''}
              ` }
              avatarName={ name }
              imageAlt={ imageAlt }
              rounded={ rounded }
            />

            <h1 className={ styles.profileHeader__name }>
              { name }
            </h1>
        </div>
      </div>
    </header>
  )
}
