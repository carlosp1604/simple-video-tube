import { NextPage } from 'next'
import useTranslation from 'next-translate/useTranslation'
import { ProducerCardDto } from '~/modules/Producers/Infrastructure/ProducerCardDto'
import {
  ProducersPaginationSortingType
} from '~/modules/Producers/Infrastructure/Frontend/ProducersPaginationSortingType'
import {
  HtmlPageMetaContextResourceType,
  HtmlPageMetaResourceService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaResourceService/HtmlPageMetaResourceService'
import {
  HtmlPageMetaContextProps
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextProps'
import { Producers } from '~/modules/Producers/Infrastructure/Components/Producers/Producers'
import { HtmlPageMeta } from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMeta'

export interface ProducersPageProps {
  initialSearchTerm: string
  initialPage: number
  initialOrder: ProducersPaginationSortingType
  initialProducers: ProducerCardDto[]
  initialProducersNumber: number
  htmlPageMetaContextProps: HtmlPageMetaContextProps
}

export const ProducersPage: NextPage<ProducersPageProps> = ({
  initialSearchTerm,
  initialProducers,
  initialProducersNumber,
  initialPage,
  initialOrder,
  htmlPageMetaContextProps,
}) => {
  const { t } = useTranslation('producers')

  const htmlPageMetaUrlProps = (
    new HtmlPageMetaResourceService(
      t('producers_page_title'),
      t('producers_page_description'),
      HtmlPageMetaContextResourceType.ARTICLE,
      htmlPageMetaContextProps.canonicalUrl
    )
  ).getProperties()

  const htmlPageMetaProps = {
    ...htmlPageMetaContextProps,
    resourceProps: htmlPageMetaUrlProps,
  }

  return (
    <>
      <HtmlPageMeta { ...htmlPageMetaProps } />

      <Producers
        initialSearchTerm={ initialSearchTerm }
        initialPage={ initialPage }
        initialProducers={ initialProducers }
        initialOrder={ initialOrder }
        initialProducersNumber={ initialProducersNumber }
      />
    </>
  )
}
