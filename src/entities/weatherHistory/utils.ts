const formatDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export type StartEndDateQueryParams = { start_date: string, end_date: string }
const formatPastTimeSpan = (dateNumber: number): StartEndDateQueryParams => {
  const now = new Date(new Date().setHours(0, 0, 0, 0))
  return {
    start_date: formatDate(new Date(dateNumber)),
    end_date: formatDate(now),
  }
}

export const getTimeSpans = () => ({
  weekly: formatPastTimeSpan(new Date().setDate(new Date().getDate() - 7)),
  monthly: formatPastTimeSpan(new Date().setMonth(new Date().getMonth() - 1)),
  yearly: formatPastTimeSpan(new Date().setFullYear(new Date().getFullYear() - 1)),
})
export type TimeSpan = keyof ReturnType<typeof getTimeSpans>
