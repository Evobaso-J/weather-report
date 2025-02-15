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
    it('should return the correct query when the timespan is $span', () => {
      const timeSpans = getTimeSpans()

      const expectedTimespans = {
        weekly: {
          start_date: '2021-09-02',
          end_date: '2021-09-09',
        },
        monthly: {
          start_date: '2021-08-09',
          end_date: '2021-09-09',
        },
        yearly: {
          start_date: '2020-09-09',
          end_date: '2021-09-09',
        },
      }

      expect(timeSpans).toMatchObject(expectedTimespans)
    })
  })
})
