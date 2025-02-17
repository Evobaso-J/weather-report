import { format } from 'date-fns/format'
import type { DailyWeather } from '~/entities/weatherHistory/types'

const getUTCMonth = (date: Date): Date => {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1))
}

type AggregatorFunction = (val1: number, val2: number) => number
/**
 * Aggregates daily weather data by month to easen rendering via chart.
 *
 * @param data - Array of daily weather data.
 * @param aggregator - Function to aggregate weather data. E.g. Math.max, Math.min, Math.avg.
 * @returns Array of aggregated daily weather data by month.
 */
export const aggregateDailyWeatherByMonth = (data: DailyWeather[], aggregator: AggregatorFunction): DailyWeather[] => {
  const months = new Map<string, DailyWeather>()

  data.forEach((dailyWeather) => {
    const { time, ...nonTimeParams } = dailyWeather
    const monthAndYear = format(new Date(time), 'MMM yyyy')
    const dataPerMonth = months.get(monthAndYear)

    if (!dataPerMonth) {
      months.set(monthAndYear, {
        time: getUTCMonth(time),
        ...nonTimeParams,
      })
    }
    else {
      const nonTimeParamsKeys = Object.keys(nonTimeParams) as (keyof typeof nonTimeParams)[]
      const aggregateData = nonTimeParamsKeys.reduce((acc, key) => {
        acc[key] = {
          value: aggregator(dataPerMonth[key].value, dailyWeather[key].value),
          unit: dailyWeather[key].unit,
        }
        return acc
      }, {} as Omit<DailyWeather, 'time'>)

      months.set(monthAndYear, {
        time: getUTCMonth(time),
        ...aggregateData,
      })
    }
  })
  return Array.from(months.values())
}
