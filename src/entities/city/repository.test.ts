import { afterEach, describe, vi, expectTypeOf, it, expect } from 'vitest'
import { cityRepository, CityRepositoryError } from './repository'
import type { APICity, APICityResponse, City } from './types'
import { GEOCODING_API_URL } from './constants'

const API_CITY_MOCK: APICity = {
  country_code: 'TE',
  country_id: 0,
  country: 'testCountry',
  elevation: 0,
  feature_code: 'testFeatureCode',
  id: 1,
  latitude: -1,
  longitude: -1,
  name: 'testName',
  population: 100,
  timezone: 'testTimezone',
  admin1: 'testAdmin1',
}

const API_CITY_RESPONSE_MOCK: APICityResponse = {
  generationtime_ms: 0,
  results: [API_CITY_MOCK],
}
const CITY_MOCK: City = {
  id: 1,
  name: 'testName',
  latitude: -1,
  longitude: -1,
  country: 'testCountry',
  admin1: 'testAdmin1',
}

const $mockedFetch = vi.hoisted(() => vi.fn())

vi.stubGlobal('$fetch', $mockedFetch)

describe('cityRepository', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('cityRepositoryQuery', () => {
    it('should require a city name as param', () => {
      const city = cityRepository()

      expectTypeOf(city.query).parameter(0).toMatchTypeOf<{ name: string }>()
    })
    it('should call fetch with the correct url and query params', () => {
      const city = cityRepository()

      city.query({ name: 'testName' })

      expect($fetch).toHaveBeenCalledWith(GEOCODING_API_URL, { query: { name: 'testName' } })
    })
    it('should return a list of cities wrapped in an Ok result if the request is successful', async () => {
      $mockedFetch.mockResolvedValueOnce(API_CITY_RESPONSE_MOCK)
      const city = cityRepository()

      const result = await city.query({ name: 'testName' })

      expect(result).toEqual({ ok: true, val: [CITY_MOCK], err: null })
    })
    it('should return an empty list wrapped in an Ok result if the request is successful but no results are returned', async () => {
      $mockedFetch.mockResolvedValueOnce({ ...API_CITY_RESPONSE_MOCK, results: undefined })
      const city = cityRepository()

      const result = await city.query({ name: 'testName' })

      expect(result).toEqual({ ok: true, val: [], err: null })
    })
    it('should return an error wrapped in an Err if the request fails', async () => {
      $mockedFetch.mockRejectedValueOnce(new Error('testError'))
      const city = cityRepository()

      const result = await city.query({ name: 'testName' })

      expect(result).toMatchObject({ ok: false, val: null, err: expect.any(CityRepositoryError) })
    })
  })
})
