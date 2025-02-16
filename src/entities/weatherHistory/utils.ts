import { format, startOfToday, subDays, subMonths, subYears } from 'date-fns'

export type StartEndDateQueryParams = { start_date: string, end_date: string }

const formatPastTimeSpan = (date: Date): StartEndDateQueryParams => {
  const yesterday = subDays(startOfToday(), 1)
  return {
    start_date: format(date, 'yyyy-MM-dd'),
    end_date: format(yesterday, 'yyyy-MM-dd'),
  }
}

export const getTimeSpans = () => ({
  weekly: formatPastTimeSpan(subDays(new Date(), 7)),
  monthly: formatPastTimeSpan(subMonths(new Date(), 1)),
  yearly: formatPastTimeSpan(subYears(new Date(), 1)),
})

export type TimeSpan = keyof ReturnType<typeof getTimeSpans>
