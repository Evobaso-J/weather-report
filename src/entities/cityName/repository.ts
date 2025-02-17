import { createErr, createOk } from 'option-t/plain_result'
import type { APICityNameResponse, CityName } from './types'
import { REVERSE_GEOCODING_API_URL } from './constants'
import { BaseError } from '~/helpers'

export class CityNameRepositoryError extends BaseError<'CITY_NAME_REPO_ERROR'> { }

const parseApiResponse = (data: APICityNameResponse): [CityName] => {
  const { place_id, display_name, lat, lon, address } = data
  return [{
    id: place_id,
    name: display_name,
    latitude: parseFloat(lat),
    longitude: parseFloat(lon),
    country: address.country,
  }]
}

export const cityNameRepository = createRepository({
  query: async (query: { latitude: number, longitude: number }) => {
    let result
    try {
      const data = await $fetch<APICityNameResponse>(REVERSE_GEOCODING_API_URL, {
        query: {
          lat: query.latitude,
          lon: query.longitude,
          format: 'json',
          zoom: 10,
        },
      })
      const cityNames = parseApiResponse(data)
      result = createOk(cityNames)
    }
    catch (error) {
      if (error instanceof Error) {
        result = createErr(new BaseError(error))
      }
      result = createErr(new CityNameRepositoryError({
        name: 'CITY_NAME_REPO_ERROR',
        message: 'entities.cityName.errors.failedToFetchCityNameData',
      }))
    }
    return result
  },
})
