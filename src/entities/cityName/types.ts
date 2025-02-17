export type APICityNameResponse = {
  address: {
    city: string
    country: string
    country_code: string
    county: string
    state: string
  }
  place_id: number
  name: string
  display_name: string
  lat: string
  lon: string
  class: string
  type: string
}

export type CityName = {
  id: number,
  name: string,
  latitude: number,
  longitude: number,
  country: string,
}

