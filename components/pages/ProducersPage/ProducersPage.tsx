import { NextPage } from 'next'
import styles from './ProducersPage.module.scss'
import { ActorsPaginationSortingType } from '~/modules/Actors/Infrastructure/Frontend/ActorsPaginationSortingType'
import { useState } from 'react'
import { ElementLinkMode } from '~/modules/Shared/Infrastructure/FrontEnd/ElementLinkMode'
import { useRouter } from 'next/router'
import { useFirstRender } from '~/hooks/FirstRender'
import {
  PaginationSortingType
} from '~/modules/Shared/Infrastructure/FrontEnd/PaginationSortingType'
import { useTranslation } from 'next-i18next'
import { ProducerCardDto } from '~/modules/Producers/Infrastructure/ProducerCardDto'
import {
  ProducerCardGallery
} from '~/modules/Producers/Infrastructure/Components/ProducerCard/ProducerCardGallery/ProducerCardGallery'
import { CommonGalleryHeader } from '~/modules/Shared/Infrastructure/Components/CommonGalleryHeader/CommonGalleryHeader'
import { SortingMenuDropdown } from '~/components/SortingMenuDropdown/SortingMenuDropdown'
import { defaultPerPage, PaginationHelper } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import { PaginationBar } from '~/components/PaginationBar/PaginationBar'
import {
  ProducersPaginationSortingType
} from '~/modules/Producers/Infrastructure/Frontend/ProducersPaginationSortingType'
import { PaginationConfiguration } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationQueryParams'

export interface ProducersPagePaginationState {
  page: number
  order: ProducersPaginationSortingType
}

export interface ProducersPageProps {
  initialPage: number
  initialOrder: ProducersPaginationSortingType
  initialProducers: ProducerCardDto[]
  initialProducersNumber: number
}

export const ProducersPage: NextPage<ProducersPageProps> = ({
  initialProducers,
  initialProducersNumber,
  initialPage,
  initialOrder,
}) => {
  const [producers, setProducers] = useState<ProducerCardDto[]>(initialProducers)
  const [producersNumber, setProducersNumber] = useState<number>(initialProducersNumber)
  const [pagination, setPagination] = useState<ProducersPagePaginationState>({ page: initialPage, order: initialOrder })
  const [loading, setLoading] = useState<boolean>(false)

  const router = useRouter()
  const firstRender = useFirstRender()
  const { t } = useTranslation('producers')

  const sortingOptions: ActorsPaginationSortingType[] = [
    PaginationSortingType.NAME_FIRST,
    PaginationSortingType.NAME_LAST,
    // TODO: Add this when is supported by prisma
    // PaginationSortingType.MORE_POSTS,
    // PaginationSortingType.LESS_POSTS,
  ]

  const linkMode: ElementLinkMode = {
    replace: false,
    shallowNavigation: true,
    scrollOnClick: true,
  }

  const configuration: Partial<PaginationConfiguration<ProducersPaginationSortingType>> &
    Pick<PaginationConfiguration<ProducersPaginationSortingType>, 'page' | 'sortingOptionType'> = {
      sortingOptionType: {
        defaultValue: PaginationSortingType.NAME_FIRST,
        parseableOptionTypes: sortingOptions,
      },
      page: { defaultValue: 1, minValue: 1, maxValue: Infinity },
    }

  /**
  const updateActors = async (page:number, order: ActorsPaginationSortingType) => {
    const componentOrder = fromOrderTypeToComponentSortingOption(order)

    const newActors = await (new ActorsApiService()).getActors(
      page,
      defaultPerPage,
      componentOrder.criteria,
      componentOrder.option
    )

    if (newActors) {
      setActorsNumber(newActors.actorsNumber)
      setActors(newActors.actors.map((actor) => {
        return ActorCardDtoTranslator.fromApplicationDto(actor.actor, actor.postsNumber)
      }))
    }
  }

  useEffect(() => {
    if (firstRender) {
      return
    }

    const queryParams = new ActorsPaginationQueryParams(router.query, configuration)

    const newPage = queryParams.page ?? configuration.page.defaultValue
    const newOrder = queryParams.sortingOptionType ?? configuration.sortingOptionType.defaultValue

    if (newPage === pagination.page && newOrder === pagination.order) {
      return
    }

    setPagination({ page: newPage, order: newOrder })

    setLoading(true)
    updateActors(newPage, newOrder)
      .then(() => {
        setLoading(false)
      })
  }, [router.query])

  const sortingMenu = (
    <SortingMenuDropdown
      activeOption={ pagination.order }
      options={ sortingOptions }
      loading={ loading }
      visible={ actorsNumber > defaultPerPage }
      linkMode={ linkMode }
    />
  )
 */

  const sortingMenu = (
    <SortingMenuDropdown
      activeOption={ pagination.order }
      options={ sortingOptions }
      loading={ loading }
      visible={ producersNumber > defaultPerPage }
      linkMode={ linkMode }
    />
  )

  return (
    <div className={ styles.actorsPage__container }>
      <CommonGalleryHeader
        title={ t('producers_gallery_title') }
        subtitle={ t('producers_gallery_subtitle', { producersNumber }) }
        loading={ loading }
        sortingMenu={ sortingMenu }
      />

      <ProducerCardGallery
        producers={ producers }
        loading={ loading }
      />

      <PaginationBar
        key={ router.asPath }
        pageNumber={ pagination.page }
        pagesNumber={ PaginationHelper.calculatePagesNumber(producersNumber, defaultPerPage) }
        disabled={ loading }
        linkMode={ linkMode }
        onPageChange={ () => window.scrollTo({ top: 0 }) }
      />
    </div>
  )
}
