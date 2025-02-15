import type { PerTimeWeather, PerTimeWeatherUnits, PerTimeWeatherValues } from '../weatherHelpers'
import type { WEATHER_FORECAST_QUERY_PARAMS } from './constants'

export type WeatherForecastQueryParams = typeof WEATHER_FORECAST_QUERY_PARAMS[number]

type HourlyWeatherValues<N extends number> = PerTimeWeatherValues<WeatherForecastQueryParams, N>
type HourlyWeatherUnits = PerTimeWeatherUnits<WeatherForecastQueryParams>

export type APIWeatherForecastResponse<N extends number = number> = {
  latitude: number
  longitude: number
  generationtime_ms: number
  utc_offset_seconds: number
  timezone: string
  timezone_abbreviation: string
  elevation: number
  hourly: HourlyWeatherValues<N>
  hourly_units: HourlyWeatherUnits
}

export type HourlyWeather = PerTimeWeather<WeatherForecastQueryParams>
