import { DateServiceInterface } from '~/helpers/Domain/DateServiceInterface'

export class DateService implements DateServiceInterface {
  public formatDate (isoDate: string, locale: string): string {
    return new Date(isoDate).toLocaleString([locale], {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  public formatSecondsToHHMMSSFormat (seconds: number): string {
    if (seconds < 3600) {
      return new Date(seconds * 1000).toISOString().substring(14, 19)
    }

    return new Date(seconds * 1000).toISOString().substring(11, 19)
  }

  public getCurrentDayWithoutTime (): Date {
    const todayDate = new Date()
    const day = todayDate.getDate()
    const month = todayDate.getMonth()
    const year = todayDate.getFullYear()

    return new Date(Date.UTC(year, month, day, 0, 0, 0, 0))
  }

  public getCurrentMonthFirstDay (): Date {
    const nowDate = new Date()
    const monthFirstDayUTC = Date.UTC(nowDate.getFullYear(), nowDate.getMonth(), 1)

    return new Date(monthFirstDayUTC)
  }

  public getCurrentWeekFirstDay (): Date {
    const nowDate = new Date()
    const day = nowDate.getDay()
    const diff = nowDate.getDate() - day + (day === 0 ? -6 : 1)
    const month = nowDate.getMonth()
    const year = nowDate.getFullYear()

    return new Date(Date.UTC(year, month, diff))
  }

  public formatDateToDateMedFromIso (isoDate: string, locale: string): string {
    return new Date(isoDate).toLocaleString([locale], {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }
}
