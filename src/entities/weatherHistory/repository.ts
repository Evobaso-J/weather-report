import { createErr, createOk } from 'option-t/plain_result'
import type { APIWeatherHistoryResponse, DailyWeather } from './types'
import { FORECAST_API_URL, WEATHER_HISTORY_QUERY_PARAMS } from './constants'
import { getTimeSpans, type TimeSpan } from './utils'
import { BaseError } from '~/helpers'

export class WeatherHistoryRepositoryError extends BaseError<'WEATHER_HISTORY_REPO_ERROR'> {}

const parseApiResponse = ({ daily, daily_units }: APIWeatherHistoryResponse): DailyWeather[] => {
  return Array.from({ length: daily.time.length }).map<DailyWeather>((_, index) => ({
    rainSum: { unit: daily_units.rain_sum, value: daily.rain_sum[index]! },
    temperature2mMax: { unit: daily_units.temperature_2m_max, value: daily.temperature_2m_max[index]! },
    temperature2mMin: { unit: daily_units.temperature_2m_min, value: daily.temperature_2m_min[index]! },
    time: new Date(daily.time[index]!),
  }))
}

export const weatherHistoryRepository = createRepository({
  query: async (query: { latitude: number, longitude: number, timeSpan: TimeSpan }) => {
    const { timeSpan, ...queryRest } = query
    const dates = getTimeSpans()[timeSpan]

    let result
    try {
      const data = await $fetch<APIWeatherHistoryResponse>(FORECAST_API_URL,
        { query: {
          ...queryRest,
          ...dates,
          daily: WEATHER_HISTORY_QUERY_PARAMS,
        } })
      const weather = parseApiResponse(data)
      result = createOk(weather)
    }
    catch (error) {
      if (error instanceof Error) {
        result = createErr(new BaseError(error))
      }
      result = createErr(new WeatherHistoryRepositoryError({
        name: 'WEATHER_HISTORY_REPO_ERROR',
        message: 'entities.weatherHistory.errors.failedToFetchWeatherHistoryData',
      }))
    }
    return result
  },
})
