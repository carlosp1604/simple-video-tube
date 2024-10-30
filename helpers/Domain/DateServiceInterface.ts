export interface DateServiceInterface {
  formatDate (isoDate: string, locale: string): string
  getCurrentDayWithoutTime(): Date
  getCurrentMonthFirstDay(): Date
  getCurrentWeekFirstDay(): Date
  formatDateToDateMedFromIso(isoDate: string, locale: string): string
}
