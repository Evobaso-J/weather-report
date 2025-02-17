import { afterEach, describe, vi, expectTypeOf, it, expect } from 'vitest'
import type { APICityNameResponse, CityName } from './types'
import { cityNameRepository, CityNameRepositoryError } from './repository'
import { REVERSE_GEOCODING_API_URL } from './constants'

const API_CITY_NAME_RESPONSE_MOCK: APICityNameResponse = {
  place_id: 1,
  lat: '-1',
  lon: '-1',
  name: 'testName',
  display_name: 'testDisplayName',
  type: 'testType',
  class: 'testClass',
  address: {
    city: 'testCity',
    country: 'testCountry',
    country_code: 'testCountryCode',
    county: 'testCounty',
    state: 'testState',
  },
}

const CITY_NAME_MOCK: CityName = {
  id: 1,
  name: 'testDisplayName',
  latitude: -1,
  longitude: -1,
  country: 'testCountry',
}

const $mockedFetch = vi.hoisted(() => vi.fn())

vi.stubGlobal('$fetch', $mockedFetch)

describe('cityNameRepository', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('cityNameRepositoryQuery', () => {
    it('should require a city name as param', () => {
      const city = cityNameRepository()

      expectTypeOf(city.query).parameter(0).toMatchTypeOf<{ latitude: number, longitude: number }>()
    })
    it('should call fetch with the correct url and query params', () => {
      const city = cityNameRepository()

      city.query({ latitude: 1, longitude: 1 })

      const expected = {
        query: {
          lat: 1,
          lon: 1,
          format: 'json',
          zoom: 10,
        },
      }
      expect($fetch).toHaveBeenCalledWith(REVERSE_GEOCODING_API_URL, expected)
    })
    it('should return a list of cities wrapped in an Ok result if the request is successful', async () => {
      $mockedFetch.mockResolvedValueOnce(API_CITY_NAME_RESPONSE_MOCK)
      const city = cityNameRepository()

      const result = await city.query({ latitude: -1, longitude: -1 })

      expect(result).toEqual({ ok: true, val: [CITY_NAME_MOCK], err: null })
    })
    it('should return an error wrapped in an Err if the request fails', async () => {
      $mockedFetch.mockRejectedValueOnce(new Error('testError'))
      const city = cityNameRepository()

      const result = await city.query({ latitude: -1, longitude: -1 })

      expect(result).toMatchObject({ ok: false, val: null, err: expect.any(CityNameRepositoryError) })
    })
  })
})
