import styles from '~/components/pages/ActorPage/ActorPage.module.scss'
import { Actor } from '~/modules/Actors/Infrastructure/Components/Actor/Actor'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { HtmlPageMeta } from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMeta'
import { ProfileHeader } from '~/modules/Shared/Infrastructure/Components/ProfileHeader/ProfileHeader'
import useTranslation from 'next-translate/useTranslation'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { ActorPageComponentDto } from '~/modules/Actors/Infrastructure/ActorPageComponentDto'
import {
  HtmlPageMetaContextResourceType,
  HtmlPageMetaResourceService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaResourceService/HtmlPageMetaResourceService'
import {
  HtmlPageMetaContextProps
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextProps'
import { BsStarFill } from 'react-icons/bs'
import { NumberFormatter } from '~/modules/Shared/Infrastructure/FrontEnd/NumberFormatter'
import { i18nConfig } from '~/i18n.config'

export interface ActorPageProps {
  actor: ActorPageComponentDto
  initialPosts: PostCardComponentDto[]
  initialPostsNumber: number
  htmlPageMetaContextProps: HtmlPageMetaContextProps
  baseUrl: string
}

export const ActorPage: NextPage<ActorPageProps> = ({
  actor,
  initialPosts,
  initialPostsNumber,
  htmlPageMetaContextProps,
  baseUrl,
}) => {
  const { t } = useTranslation('actors')
  const locale = useRouter().locale ?? i18nConfig.defaultLocale

  const structuredData = {
    '@context': 'http://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{
      '@type': 'ListItem',
      position: 1,
      name: t('actors_breadcrumb_list_title'),
      item: `${baseUrl}/${locale}/actors`,
    }, {
      '@type': 'ListItem',
      position: 2,
      name: actor.name,
      item: `${baseUrl}/${locale}/actors/${actor.slug}`,
    }],
  }

  const htmlPageMetaUrlProps = (
    new HtmlPageMetaResourceService(
      t('actor_page_title', { actorName: actor.name }),
      t('actor_page_description', { actorName: actor.name }),
      HtmlPageMetaContextResourceType.ARTICLE,
      htmlPageMetaContextProps.canonicalUrl,
      actor.imageUrl ?? undefined
    )
  ).getProperties()

  const htmlPageMetaProps = {
    ...htmlPageMetaContextProps,
    resourceProps: htmlPageMetaUrlProps,
    structuredData: JSON.stringify(structuredData),
  }

  return (
    <div className={ styles.actorPage__container }>
      <HtmlPageMeta { ...htmlPageMetaProps } />

      <ProfileHeader
        name={ actor.name }
        imageAlt={ t('actor_image_alt_title', { actorName: actor.name }) }
        imageUrl={ actor.imageUrl }
        profileType={ t('actor_page_profile_type_title') }
        icon={ <BsStarFill /> }
        subtitle={ t('actor_page_profile_count_title',
          { viewsNumber: NumberFormatter.compatFormat(actor.viewsCount, locale) }) }
      />

      <Actor
        actorId={ actor.id }
        actorName={ actor.name }
        actorSlug={ actor.slug }
        initialPosts={ initialPosts }
        actorViews={ actor.viewsCount }
        initialPostsNumber={ initialPostsNumber }
      />
    </div>
  )
}
