import { describe, expect, it } from 'vitest'
import { aggregateDailyWeatherByMonth } from './chartUtils'

const DAILY_WEATHER_MOCK = [
  {
    time: new Date('2021-01-01'),
    rainSum: { value: 1, unit: 'mm' },
    temperature2mMax: { value: 10, unit: '°C' },
    temperature2mMin: { value: 5, unit: '°C' },
  },
  {
    time: new Date('2021-01-02'),
    rainSum: { value: 1, unit: 'mm' },
    temperature2mMax: { value: 10, unit: '°C' },
    temperature2mMin: { value: 5, unit: '°C' },
  },
  {
    time: new Date('2021-02-01'),
    rainSum: { value: 1, unit: 'mm' },
    temperature2mMax: { value: 10, unit: '°C' },
    temperature2mMin: { value: 5, unit: '°C' },
  },
]

describe('chartUtils', () => {
  describe('aggregateDailyWeatherByMonth', () => {
    it('should aggregate daily values by month', () => {
      const result = aggregateDailyWeatherByMonth(DAILY_WEATHER_MOCK, () => 0)
      const resultDates = result.map(r => r.time)

      expect(resultDates).toEqual([
        new Date('2021-01-01'),
        new Date('2021-02-01'),
      ])
    })
    it('the values should be aggregated by the aggregator function', () => {
      const sumAggregator = (val1: number, val2: number) => val1 + val2
      const sumResult = aggregateDailyWeatherByMonth(DAILY_WEATHER_MOCK, sumAggregator)

      expect(sumResult).toEqual([
        {
          time: new Date('2021-01-01'),
          rainSum: { value: 2, unit: 'mm' },
          temperature2mMax: { value: 20, unit: '°C' },
          temperature2mMin: { value: 10, unit: '°C' },
        },
        {
          time: new Date('2021-02-01'),
          rainSum: { value: 1, unit: 'mm' },
          temperature2mMax: { value: 10, unit: '°C' },
          temperature2mMin: { value: 5, unit: '°C' },
        },
      ])
    })
  })
})
