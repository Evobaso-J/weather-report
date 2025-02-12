import type { Tuple } from '~/helpers'

export type APIWeatherResponse<N extends number = number> = {
  latitude: number
  longitude: number
  generationtime_ms: number
  utc_offset_seconds: number
  timezone: string
  timezone_abbreviation: string
  elevation: number
  daily_units: {
    time: string
    temperature_2m_min: string
    temperature_2m_max: string
    precipitation_sum: string
    rain_sum: string
  }
  daily: {
    time: Tuple<string, N>
    temperature_2m_min: Tuple<number, N>
    temperature_2m_max: Tuple<number, N>
    precipitation_sum: Tuple<number, N>
    rain_sum: Tuple<number, N>
  }
}

export type WeatherVariable<T> = {
  unit: string
  value: T
}

export type DailyWeather = {
  time: Date
  minTemperature: WeatherVariable<number>
  maxTemperature: WeatherVariable<number>
  precipitationSum: WeatherVariable<number>
  rainSum: WeatherVariable<number>
}
