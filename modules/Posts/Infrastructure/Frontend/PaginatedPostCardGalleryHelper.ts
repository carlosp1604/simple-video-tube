import { FetchFilter } from '~/modules/Shared/Infrastructure/FrontEnd/FetchFilter'
import { PostFilterOptions } from '~/modules/Posts/Infrastructure/Frontend/PostFilterOptions'

export const nativeAdsData = [
  {
    titleKey: 'native_ads_cams_offer_title',
    thumb: 'https://cdn.cheemsporn.com/img/banner-cams-advertising-native.jpg',
    offerUrl: 'https://t.ajrkm.link/258265/6224/0?bo=2779,2778,2777,2776,2775&aff_sub5=SF_006OG000004lmDN',
    adNetworkName: 'Royal Cams',
  },
  {
    titleKey: 'native_ads_dating_offer_title',
    thumb: 'https://cdn.cheemsporn.com/img/banner-dating-advertising-native.jpg',
    offerUrl: 'https://t.anchat.link/258265/5165?bo=2753,2754,2755,2756&popUnder=true&aff_sub5=SF_006OG000004lmDN',
    adNetworkName: 'Adult Friend Finder',
  },
  {
    titleKey: 'native_ads_porn_games_offer_title',
    thumb: 'https://cdn.cheemsporn.com/img/banner-porn-games-advertising-native.jpg',
    // eslint-disable-next-line max-len
    offerUrl: 'https://t.aagm.link/58qbufimio?url_id=0&aff_id=258265&offer_id=7930&bo=3511,3512,3521,3522&aff_sub5=SF_006OG000004lmDN',
    adNetworkName: 'Comix Harem',
  },
  {
    titleKey: 'native_ads_ia_offer_title',
    thumb: 'https://cdn.cheemsporn.com/img/banner-ia-advertising-native.jpg',
    offerUrl: 'https://t.ajump.link/258265/6646?popUnder=false&aff_sub5=SF_006OG000004lmDN',
    adNetworkName: 'Candy.ai',
  },
  {
    titleKey: 'native_ads_partner_offer_title',
    thumb: 'https://cdn.cheemsporn.com/img/banner-partner-advertising-native.jpg',
    offerUrl: 'https://cheemsporno.com',
    adNetworkName: 'Cheemsporno',
  },
]

export class PaginatedPostCardGalleryHelper {
  public static arraysEqual (
    currentFiltersArray: FetchFilter<PostFilterOptions>[],
    newFiltersArray: FetchFilter<PostFilterOptions>[]) {
    if (currentFiltersArray.length !== newFiltersArray.length) {
      return false
    }

    for (const currentFilterArray of currentFiltersArray) {
      const foundOnNewArray = newFiltersArray.find((newFilter) =>
        newFilter.type === currentFilterArray.type && newFilter.value === currentFilterArray.value
      )

      if (!foundOnNewArray) {
        return false
      }

      const index = newFiltersArray.indexOf(foundOnNewArray)

      newFiltersArray.splice(index, 1)
    }

    return true
  }

  public static genRandomValue (min: number, max: number, except: Array<number>): number {
    const random = Math.floor(Math.random() * (max - min + 1)) + min

    if (except.includes(random)) {
      PaginatedPostCardGalleryHelper.genRandomValue(min, max, except)
    }

    return random
  }
}
