import { FC } from 'react'
import { CategoryCardComponentDto } from '~/modules/Categories/Infrastructure/Dtos/CategoryCardComponentDto'
import { AvatarImage } from '~/components/AvatarImage/AvatarImage'
import Link from 'next/link'
import styles from './CategoryCard.module.scss'

export interface Props {
  categoryCardDto: CategoryCardComponentDto
}

export const CategoryCard: FC<Props> = ({ categoryCardDto }) => {
  return (
    <div className={ styles.categoryCard__container }>
      <Link
        href={ `/categories/${categoryCardDto.slug}` }
        title={ categoryCardDto.name }
      >
        <AvatarImage
          imageUrl={ categoryCardDto.imageUrl }
          avatarClassName={ styles.categoryCard__avatarContainer }
          imageClassName={ styles.categoryCard__imageContainer }
          avatarName={ categoryCardDto.name }
          imageAlt={ categoryCardDto.name }
        />
        <span className={ styles.categoryCard__nameContainer }>
          { categoryCardDto.name }
        </span>
      </Link>
    </div>
  )
}
