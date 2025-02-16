import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getTimeSpans } from './utils'

const fakeSystemTime = new Date('2021-09-09')

describe('weatherHistory utils', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(fakeSystemTime)
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  describe('getTimeSpans', () => {
    it('should return an object with weekly, monthly and daily periods, with yesterday as reference', () => {
      const timeSpans = getTimeSpans()

      const expectedTimespans = {
        weekly: {
          start_date: '2021-09-02',
          end_date: '2021-09-08',
        },
        monthly: {
          start_date: '2021-08-09',
          end_date: '2021-09-08',
        },
        yearly: {
          start_date: '2020-09-09',
          end_date: '2021-09-08',
        },
      }

      expect(timeSpans).toMatchObject(expectedTimespans)
    })
  })
})
