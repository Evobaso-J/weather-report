import { createErr, createOk } from 'option-t/plain_result'
import type { APICityResponse, City } from './types'
import { GEOCODING_API_URL } from './constants'
import { BaseError } from '~/helpers'

export class CityRepositoryError extends BaseError<'CITY_REPO_ERROR'> {}

const parseApiResponse = (data: APICityResponse): City[] => {
  if (!data.results) return []
  return data.results.map(({ id, name, latitude, longitude, country, admin1 }) => ({ id, name, latitude, longitude, country, admin1 }))
}

export const cityRepository = createRepository({
  query: async ({ name }: { name: string }) => {
    let result
    try {
      const data = await $fetch<APICityResponse>(GEOCODING_API_URL, { query: { name } })
      const cities = parseApiResponse(data)
      result = createOk(cities)
    }
    catch (error) {
      if (error instanceof Error) {
        result = createErr(new BaseError(error))
      }
      result = createErr(new CityRepositoryError({
        name: 'CITY_REPO_ERROR',
        message: 'entities.city.errors.failedToFetchCityData',
      }))
    }
    return result
  },
})
