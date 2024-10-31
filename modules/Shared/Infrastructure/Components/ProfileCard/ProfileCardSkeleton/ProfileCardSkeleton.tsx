import styles from './ProfileCardSkeleton.module.scss'
import { FC } from 'react'

export const ProfileCardSkeleton: FC = () => {
  return (
    <div className={ styles.profileCardSkeleton__container }>
      <div className={ styles.profileCardSkeleton__imageWrapper }>
        <span className={ styles.profileCardSkeleton__profileImage }/>
      </div>
      <div className={ styles.profileCardSkeleton__dataContainer }>
        <span className={ styles.profileCardSkeleton__profileName } />
        <div className={ styles.profileCardSkeleton__countSection }>
          <span className={ styles.profileCardSkeleton__countItem } />
          <span className={ styles.profileCardSkeleton__countItem } />
        </div>
      </div>
    </div>
  )
}
