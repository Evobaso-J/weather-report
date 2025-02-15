import type { SnakeToCamel, Tuple } from '~/helpers'

export type PerTimeWeatherValues<TQueryParams extends string, N extends number = number> = {
  [key in TQueryParams]: Tuple<number, N>
} & {
  time: Tuple<string, N>
}

export type PerTimeWeatherUnits<TQueryParams extends string> = {
  [key in TQueryParams]: string
} & {
  time: string
}

export type WeatherVariable<T> = {
  unit: string
  value: T
}

export type PerTimeWeather<TQueryParams extends string> = {
  time: Date
} & {
  [key in SnakeToCamel<TQueryParams>]: WeatherVariable<number>
}
