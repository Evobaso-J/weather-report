import { afterEach, describe, expect, expectTypeOf, it, vi } from 'vitest'
import type { APIWeatherResponse, DailyWeather } from './types'
import { weatherRepository, WeatherRepositoryError } from './repository'
import { FORECAST_API_URL } from './constants'

const API_WEATHER_RESPONSE_MOCK: APIWeatherResponse = {
  daily: {
    precipitation_sum: [0],
    rain_sum: [0],
    temperature_2m_max: [0],
    temperature_2m_min: [0],
    time: ['2021-09-01'],
  },
  daily_units: {
    precipitation_sum: 'mm',
    rain_sum: 'mm',
    temperature_2m_max: '°C',
    temperature_2m_min: '°C',
    time: 'date',
  },
  elevation: 0,
  generationtime_ms: 0,
  latitude: 0,
  longitude: 0,
  timezone: 'testTimezone',
  timezone_abbreviation: 'testTimezoneAbbreviation',
  utc_offset_seconds: 0,
}

const DAILY_WEATHER_MOCK: DailyWeather = {
  maxTemperature: { unit: '°C', value: 0 },
  minTemperature: { unit: '°C', value: 0 },
  precipitationSum: { unit: 'mm', value: 0 },
  rainSum: { unit: 'mm', value: 0 },
  time: { unit: 'date', value: '2021-09-01' },
}

const $mockedFetch = vi.hoisted(() => vi.fn())

vi.stubGlobal('$fetch', $mockedFetch)

describe('weatherRepository', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('weatherRepositoryQuery', () => {
    it('should require a latitude and longitude as param', () => {
      const weather = weatherRepository()

      expectTypeOf(weather.query).parameter(0).toMatchTypeOf<{ latitude: number, longitude: number }>()
    })
    it('should call fetch with the correct url and query params', () => {
      const weather = weatherRepository()

      weather.query({ latitude: 0, longitude: 0, forecast_days: 1 })

      expect($fetch).toHaveBeenCalledWith(FORECAST_API_URL, { query: { latitude: 0, longitude: 0, daily: ['temperature_2m_min', 'temperature_2m_max', 'precipitation_sum', 'rain_sum'], forecast_days: 1 } })
    })
    it('should return a list of daily weather wrapped in an Ok result if the request is successful', async () => {
      $mockedFetch.mockResolvedValueOnce(API_WEATHER_RESPONSE_MOCK)
      const weather = weatherRepository()

      const result = await weather.query({ latitude: 0, longitude: 0, forecast_days: 1 })

      expect(result).toStrictEqual({ ok: true, val: [DAILY_WEATHER_MOCK], err: null })
    })
    it('should return an error wrapped in an Err result if the request fails', async () => {
      $mockedFetch.mockRejectedValueOnce(new Error('testError'))
      const weather = weatherRepository()

      const result = await weather.query({ latitude: 0, longitude: 0, forecast_days: 1 })

      expect(result).toMatchObject({ ok: false, val: null, err: expect.any(WeatherRepositoryError) })
    })
  })
})
