import { createErr, createOk } from 'option-t/plain_result'
import type { APIWeatherResponse, DailyWeather } from './types'
import { FORECAST_API_URL } from './constants'
import { BaseError, type Tuple } from '~/helpers'

export class WeatherRepositoryError extends BaseError<'WEATHER_REPO_ERROR'> {}

const parseApiResponse = <N extends number>({ daily, daily_units }: APIWeatherResponse<N>): Tuple<DailyWeather, N> => {
  return Array.from({ length: daily.time.length }).map<DailyWeather>((_, index) => ({
    maxTemperature: { unit: daily_units.temperature_2m_max, value: daily.temperature_2m_max[index]! },
    minTemperature: { unit: daily_units.temperature_2m_min, value: daily.temperature_2m_min[index]! },
    precipitationSum: { unit: daily_units.precipitation_sum, value: daily.precipitation_sum[index]! },
    rainSum: { unit: daily_units.rain_sum, value: daily.rain_sum[index]! },
    time: new Date(daily.time[index]!),
  })) as Tuple<DailyWeather, N>
}

export const weatherRepository = createRepository({
  query: async (query: { latitude: number, longitude: number, forecast_days: number }) => {
    let result
    try {
      const data = await $fetch<APIWeatherResponse>(FORECAST_API_URL,
        { query: {
          ...query,
          daily: ['temperature_2m_min', 'temperature_2m_max', 'precipitation_sum', 'rain_sum'],
        } })
      const weather = parseApiResponse(data)
      result = createOk(weather)
    }
    catch (error) {
      if (error instanceof Error) {
        result = createErr(new BaseError(error))
      }
      result = createErr(new WeatherRepositoryError({
        name: 'WEATHER_REPO_ERROR',
        message: 'Failed to fetch weather data',
      }))
    }
    return result
  },
})
