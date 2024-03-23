import { ParsedUrlQuery } from 'querystring'
import { GetServerSidePropsContext, PreviewData } from 'next'
import nextI18nextConfig from '~/next-i18next.config'
import { localeWithTerritory } from '~/modules/Shared/Domain/Locale'
import { HtmlPageMetaContextServiceInterface } from './HtmlPageMetaContextServiceInterface'
import {AlternateUrl, HtmlPageMetaContextProps} from './HtmlPageMetaContextProps'

/**
 * Service to extract metadata properties which are dependent on the context.
 */
export class HtmlPageMetaContextService implements HtmlPageMetaContextServiceInterface {
  private context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>

  public constructor (context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>) {
    this.context = context
  }

  public getProperties (): HtmlPageMetaContextProps {
    return {
      url: this.getCurrentUrl(),
      locale: this.getExtendedLocale(),
      alternateLocaleWithTerritory: this.getExtendedAlternateLocale(),
      alternateLocale: this.getAlternateLocaleWithAlternateUrl(),
    }
  }

  private getLocale (): string {
    return this.context.locale ? this.context.locale : nextI18nextConfig.i18n.defaultLocale
  }

  private getExtendedLocale (): string {
    return localeWithTerritory(this.getLocale())
  }

  private getAlternateLocaleWithAlternateUrl (): AlternateUrl[] {
    const locales: string[] = this.context.locales?.filter((locale) => locale !== this.getLocale()) || []

    const alternateLocale: AlternateUrl[] = []

    locales.forEach((locale) => {
      const alternateUrl = this.getUrlForLocale(locale)

      alternateLocale.push({ locale, alternateUrl } )
    })

    return alternateLocale
  }

  private getAlternateLocale (): string[] {
    return this.context.locales?.filter((locale) => locale !== this.getLocale()) || []
  }

  private getExtendedAlternateLocale (): string[] {
    return this.getAlternateLocale().map(localeWithTerritory)
  }

  private getCurrentUrl (): string {
    const env = process.env
    const baseUrl = env.BASE_URL

    return `${baseUrl}/${this.getLocale()}${this.context.req.url}`
  }

  private getUrlForLocale (locale: string): string {
    const env = process.env
    const baseUrl = env.BASE_URL

    return `${baseUrl}/${locale}${this.context.req.url}`
  }
}