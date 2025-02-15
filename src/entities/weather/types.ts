import type { WEATHER_QUERY_PARAMS } from './constants'
import type { SnakeToCamel, Tuple } from '~/helpers'

export type WeatherQueryParams = typeof WEATHER_QUERY_PARAMS[number]

type Hourly<N extends number = number> = {
  [key in WeatherQueryParams]: Tuple<number, N>
} & {
  time: Tuple<string, N>
}

type HourlyUnits = {
  [key in WeatherQueryParams]: string
} & {
  time: string
}

export type APIWeatherResponse<N extends number = number> = {
  latitude: number
  longitude: number
  generationtime_ms: number
  utc_offset_seconds: number
  timezone: string
  timezone_abbreviation: string
  elevation: number
  hourly: Hourly<N>
  hourly_units: HourlyUnits
}

export type WeatherVariable<T> = {
  unit: string
  value: T
}

export type HourlyWeather = {
  time: Date
} & {
  [key in SnakeToCamel<WeatherQueryParams>]: WeatherVariable<number>
}
