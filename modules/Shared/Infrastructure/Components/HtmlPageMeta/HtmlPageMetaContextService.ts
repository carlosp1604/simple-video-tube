import { ParsedUrlQuery } from 'querystring'
import { GetServerSidePropsContext, GetStaticPropsContext, PreviewData } from 'next'
import { i18nConfig } from '~/i18n.config'
import { HtmlPageMetaContextServiceInterface } from './HtmlPageMetaContextServiceInterface'
import {
  AlternateUrl, CanonicalUrl,
  HtmlPageMetaContextProps,
  HtmlPageMetaRobots
} from './HtmlPageMetaContextProps'

export interface StaticContext extends GetStaticPropsContext {
  pathname: string
  locale: string
  req: { url: string }
}

export class HtmlPageMetaContextService implements HtmlPageMetaContextServiceInterface {
  public constructor (
    private context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData> | StaticContext,
    private readonly canonicalUrl: CanonicalUrl = null,
    private readonly robots: HtmlPageMetaRobots = { index: true, follow: true }
  ) {
    this.context = context
    this.canonicalUrl = canonicalUrl
    this.robots = robots
  }

  public getProperties (): HtmlPageMetaContextProps {
    return {
      url: this.getFullUrl(this.getLocale()),
      locale: this.getExtendedLocale(),
      alternateLocale: this.getAlternateLocaleWithAlternateUrl(),
      canonicalUrl: this.getCanonicalUrl(),
      robots: this.robots,
    }
  }

  private getLocale (): string {
    return this.context.locale ? this.context.locale : i18nConfig.defaultLocale
  }

  private getExtendedLocale (): string {
    return this.getLocale()
  }

  private getAlternateLocale (): string[] {
    return i18nConfig.locales
  }

  private getAlternateLocaleWithAlternateUrl (): AlternateUrl[] {
    const locales = this.getAlternateLocale()

    const alternateLocale: AlternateUrl[] = []

    locales.forEach((locale) => {
      const alternateUrl = this.getFullUrl(locale)

      alternateLocale.push({ locale, alternateUrl })
    })

    return alternateLocale
  }

  private getFullUrl (locale: string): string {
    const env = process.env
    const baseUrl = env.BASE_URL

    return `${baseUrl}/${locale}${this.context.req.url}`
  }

  private getCanonicalUrl (): string | null {
    if (!this.canonicalUrl) {
      return null
    }

    const env = process.env
    const baseUrl = env.BASE_URL

    if (typeof this.canonicalUrl === 'string') {
      return `${baseUrl}/${this.canonicalUrl}`
    }

    let canonicalUrl = baseUrl

    if (this.canonicalUrl.includeLocale) {
      canonicalUrl = `${canonicalUrl}/${this.getLocale()}`
    }

    if (this.canonicalUrl.includeQuery) {
      canonicalUrl = `${canonicalUrl}${this.context.req.url}`
    } else {
      canonicalUrl = `${canonicalUrl}${(this.context.req.url ?? '').split('?')[0]}`
    }

    return canonicalUrl
  }
}
