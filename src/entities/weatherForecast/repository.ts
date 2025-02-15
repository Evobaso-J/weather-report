import { createErr, createOk } from 'option-t/plain_result'
import type { APIWeatherResponse, HourlyWeather } from './types'
import { FORECAST_API_URL, WEATHER_QUERY_PARAMS } from './constants'
import { BaseError, type Tuple } from '~/helpers'

export class WeatherForecastRepositoryError extends BaseError<'WEATHER_REPO_ERROR'> {}

const parseApiResponse = <N extends number>({ hourly, hourly_units }: APIWeatherResponse<N>): Tuple<HourlyWeather, N> => {
  return Array.from({ length: hourly.time.length }).map<HourlyWeather>((_, index) => ({
    temperature2m: { unit: hourly_units.temperature_2m, value: hourly.temperature_2m[index]! },
    precipitationProbability: { unit: hourly_units.precipitation_probability, value: hourly.temperature_2m[index]! },
    rain: { unit: hourly_units.rain, value: hourly.rain[index]! },
    cloudCover: { unit: hourly_units.cloud_cover, value: hourly.cloud_cover[index]! },
    time: new Date(hourly.time[index]!),
  })) as Tuple<HourlyWeather, N>
}

export const weatherForecastRepository = createRepository({
  query: async (query: { latitude: number, longitude: number, forecast_days: number }) => {
    let result
    try {
      const data = await $fetch<APIWeatherResponse>(FORECAST_API_URL,
        { query: {
          ...query,
          hourly: WEATHER_QUERY_PARAMS,
        } })
      const weather = parseApiResponse(data)
      result = createOk(weather)
    }
    catch (error) {
      if (error instanceof Error) {
        result = createErr(new BaseError(error))
      }
      result = createErr(new WeatherForecastRepositoryError({
        name: 'WEATHER_REPO_ERROR',
        message: 'Failed to fetch weather data',
      }))
    }
    return result
  },
})
