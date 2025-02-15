import type { PerTimeWeather, PerTimeWeatherUnits, PerTimeWeatherValues } from '../weatherHelpers'
import type { WEATHER_HISTORY_QUERY_PARAMS } from './constants'

export type WeatherHistoryQueryParams = typeof WEATHER_HISTORY_QUERY_PARAMS[number]

export type DailyWeatherValues = PerTimeWeatherValues<WeatherHistoryQueryParams>
export type DailyWeatherUnits = PerTimeWeatherUnits<WeatherHistoryQueryParams>

export type APIWeatherHistoryResponse = {
  latitude: number
  longitude: number
  generationtime_ms: number
  utc_offset_seconds: number
  timezone: string
  timezone_abbreviation: string
  elevation: number
  daily: DailyWeatherValues
  daily_units: DailyWeatherUnits
}

export type DailyWeather = PerTimeWeather<WeatherHistoryQueryParams>
