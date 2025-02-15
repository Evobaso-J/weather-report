import { afterEach, describe, expect, expectTypeOf, it, vi } from 'vitest'
import type { APIWeatherForecastResponse, WeatherForecastQueryParams } from './types'
import { weatherForecastRepository, WeatherForecastRepositoryError } from './repository'
import { FORECAST_API_URL } from './constants'

const API_WEATHER_RESPONSE_MOCK: APIWeatherForecastResponse = {
  hourly: {
    precipitation_probability: [0],
    rain: [0],
    temperature_2m: [0],
    cloud_cover: [0],
    time: ['2021-09-01'],
  },
  hourly_units: {
    precipitation_probability: '%',
    rain: 'mm',
    temperature_2m: '°C',
    cloud_cover: '%',
    time: 'iso8601',
  },
  elevation: 0,
  generationtime_ms: 0,
  latitude: 0,
  longitude: 0,
  timezone: 'testTimezone',
  timezone_abbreviation: 'testTimezoneAbbreviation',
  utc_offset_seconds: 0,
}

const HOURLY_WEATHER_MOCK = {
  temperature2m: { unit: '°C', value: 0 },
  precipitationProbability: { unit: '%', value: 0 },
  rain: { unit: 'mm', value: 0 },
  cloudCover: { unit: '%', value: 0 },
  time: new Date('2021-09-01'),
}

const $mockedFetch = vi.hoisted(() => vi.fn())

vi.stubGlobal('$fetch', $mockedFetch)

describe('weatherForecastRepository', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('weatherForecastRepositoryQuery', () => {
    it('should require a latitude and longitude as param', () => {
      const weather = weatherForecastRepository()

      expectTypeOf(weather.query).parameter(0).toMatchTypeOf<{ latitude: number, longitude: number }>()
    })
    it('should call fetch with the correct url and query params', () => {
      const weather = weatherForecastRepository()

      weather.query({ latitude: 0, longitude: 0, forecast_days: 1 })

      const expectedWeatherQueryParams: WeatherForecastQueryParams[] = ['temperature_2m', 'precipitation_probability', 'rain', 'cloud_cover']
      expect($fetch).toHaveBeenCalledWith(FORECAST_API_URL, { query: { latitude: 0, longitude: 0, hourly: expectedWeatherQueryParams, forecast_days: 1 } })
    })
    it('should return a list of hourly weather data wrapped in an Ok result if the request is successful', async () => {
      $mockedFetch.mockResolvedValueOnce(API_WEATHER_RESPONSE_MOCK)
      const weather = weatherForecastRepository()

      const result = await weather.query({ latitude: 0, longitude: 0, forecast_days: 1 })

      expect(result).toStrictEqual({ ok: true, val: [HOURLY_WEATHER_MOCK], err: null })
    })
    it('should return an error wrapped in an Err result if the request fails', async () => {
      $mockedFetch.mockRejectedValueOnce(new Error('testError'))
      const weather = weatherForecastRepository()

      const result = await weather.query({ latitude: 0, longitude: 0, forecast_days: 1 })

      expect(result).toMatchObject({ ok: false, val: null, err: expect.any(WeatherForecastRepositoryError) })
    })
  })
})
