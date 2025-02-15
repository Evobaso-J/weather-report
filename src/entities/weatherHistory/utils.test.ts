import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { formatWeatherHistoryQueryParams, type StartEndDateQueryParams, type TimeSpan } from './utils'
import { WEATHER_HISTORY_QUERY_PARAMS } from './constants'

const fakeSystemTime = new Date('2021-09-09T00:00:00Z')

describe('weatherHistory utils', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(fakeSystemTime)
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  describe('formatWeatherHistoryQueryParams', () => {
    const timeSpans: {
      span: TimeSpan
      expected: StartEndDateQueryParams & {
        hourly?: typeof WEATHER_HISTORY_QUERY_PARAMS
        daily?: typeof WEATHER_HISTORY_QUERY_PARAMS
      } }[] = [
      {
        span: 'weekly',
        expected: {
          start_date: '2021-09-02',
          end_date: '2021-09-09',
          hourly: WEATHER_HISTORY_QUERY_PARAMS,
        },
      },
      { span: 'monthly',
        expected: {
          start_date: '2021-08-09',
          end_date: '2021-09-09',
          daily: WEATHER_HISTORY_QUERY_PARAMS,
        },
      },
      {
        span: 'yearly',
        expected: {
          start_date: '2020-09-09',
          end_date: '2021-09-09',
          daily: WEATHER_HISTORY_QUERY_PARAMS,
        },
      },
    ]

    it.each(timeSpans)('should return the correct query when the timespan is $span', ({ span, expected }) => {
      const query = { latitude: 0, longitude: 0, timeSpan: span }
      expect(formatWeatherHistoryQueryParams(query)).toMatchObject(expected)
    })
  })
})
