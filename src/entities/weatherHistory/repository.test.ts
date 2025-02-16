import { afterEach, beforeEach, describe, expect, expectTypeOf, it, vi } from 'vitest'
import type { APIWeatherHistoryResponse } from './types'
import { FORECAST_API_URL, WEATHER_HISTORY_QUERY_PARAMS } from './constants'
import { weatherHistoryRepository, WeatherHistoryRepositoryError } from './repository'
import type { TimeSpan } from './utils'

const API_WEATHER_RESPONSE_MOCK: APIWeatherHistoryResponse = {
  daily: {
    rain_sum: [0],
    temperature_2m_max: [0],
    temperature_2m_min: [0],
    time: ['2021-09-01'],
  },
  daily_units: {
    rain_sum: 'mm',
    temperature_2m_max: '°C',
    temperature_2m_min: '°C',
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

const DAILY_WEATHER_MOCK = {
  rainSum: { unit: 'mm', value: 0 },
  temperature2mMax: { unit: '°C', value: 0 },
  temperature2mMin: { unit: '°C', value: 0 },
  time: new Date('2021-09-01'),
}

const fakeSystemTime = new Date('2021-09-01')

const $mockedFetch = vi.hoisted(() => vi.fn())

vi.stubGlobal('$fetch', $mockedFetch)

describe('weatherHistoryRepository', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(fakeSystemTime)
  })
  afterEach(() => {
    vi.resetAllMocks()
    vi.useRealTimers()
  })

  describe('weatherHistoryRepositoryQuery', () => {
    it('should require the right query params', () => {
      const weather = weatherHistoryRepository()

      expectTypeOf(weather.query).parameter(0).toMatchTypeOf<{ latitude: number, longitude: number, timeSpan: TimeSpan }>()
    })
    it('should call fetch with the correct url and query params', () => {
      const weather = weatherHistoryRepository()

      weather.query({ latitude: 0, longitude: 0, timeSpan: 'weekly' })

      expect($fetch).toHaveBeenCalledWith(FORECAST_API_URL, {
        query: {
          latitude: 0,
          longitude: 0,
          daily: WEATHER_HISTORY_QUERY_PARAMS,
          start_date: '2021-08-25',
          end_date: '2021-08-31',
        },
      })
    })
    it('should return a list of daily weather data wrapped in an Ok result if the request is successful', async () => {
      $mockedFetch.mockResolvedValueOnce(API_WEATHER_RESPONSE_MOCK)
      const weather = weatherHistoryRepository()

      const result = await weather.query({ latitude: 0, longitude: 0, timeSpan: 'weekly' })

      expect(result).toMatchObject({ ok: true, val: [DAILY_WEATHER_MOCK], err: null })
    })
    it('should return an error wrapped in an Err result if the request fails', async () => {
      $mockedFetch.mockRejectedValueOnce(new Error('test error'))
      const weather = weatherHistoryRepository()

      const result = await weather.query({ latitude: 0, longitude: 0, timeSpan: 'weekly' })

      expect(result).toMatchObject({ ok: false, val: null, err: expect.any(WeatherHistoryRepositoryError) })
    })
  })
})
