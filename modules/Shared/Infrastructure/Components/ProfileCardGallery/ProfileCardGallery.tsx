import { FC, ReactElement } from 'react'
import styles from './ProfileCardGallery.module.scss'
import { defaultPerPage } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import { ProducerCardDto } from '~/modules/Producers/Infrastructure/ProducerCardDto'
import { ActorCardDto } from '~/modules/Actors/Infrastructure/ActorCardDto'
import { ProfileCard } from '~/modules/Shared/Infrastructure/Components/ProfileCard/ProfileCard'
import {
  ProfileCardSkeleton
} from '~/modules/Shared/Infrastructure/Components/ProfileCard/ProfileCardSkeleton/ProfileCardSkeleton'

interface Props {
  profiles: Array<ProducerCardDto | ActorCardDto>
}

interface OptionalProps {
  loading: boolean
  emptyState: ReactElement | null
}

export const ProfileCardGallery: FC<Props & Partial<OptionalProps>> = ({
  profiles,
  loading = false,
  emptyState = null,
}) => {
  let profilesSkeletonNumber

  if (profiles.length <= defaultPerPage) {
    profilesSkeletonNumber = defaultPerPage - profiles.length
  } else {
    profilesSkeletonNumber = profiles.length % defaultPerPage
  }

  const profileSkeletons = Array.from(Array(profilesSkeletonNumber).keys()).map((index) => (
    <ProfileCardSkeleton key={ index }/>
  ))

  if (!loading && profiles.length === 0) {
    return emptyState
  }

  return (
    <div className={ `
      ${styles.profileCardGallery__container}
      ${loading ? styles.profileCardGallery__container__loading : ''}
    ` }
    >
      { profiles.map((profile) => {
        return (
          <ProfileCard
            profile={ profile }
            key={ profile.id }
          />
        )
      }) }
      { loading ? profileSkeletons : null }
    </div>
  )
}
