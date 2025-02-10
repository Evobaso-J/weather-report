import { createErr, createOk } from 'option-t/plain_result'
import type { City, APICity } from './types'
import { BaseError, type APIResponse } from '~/helpers'

export const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search'

export class CityRepositoryError extends BaseError<'CITY_REPO_ERROR'> {}

const parseApiResponse = (data: APIResponse<APICity>): City[] => {
  if (!data.results) return []
  return data.results.map(({ id, name, latitude, longitude, country, admin1 }) => ({ id, name, latitude, longitude, country, admin1 }))
}

export const cityRepository = createRepository({
  query: async ({ name }: { name: string }) => {
    let result
    try {
      const data = await $fetch<APIResponse<APICity>>(GEOCODING_API_URL, { query: { name } })
      const cities = parseApiResponse(data)
      result = createOk(cities)
    }
    catch (error) {
      if (error instanceof Error) {
        result = createErr(new BaseError(error))
      }
      result = createErr(new CityRepositoryError({
        name: 'CITY_REPO_ERROR',
        message: 'Failed to fetch city data',
      }))
    }
    return result
  },
})
