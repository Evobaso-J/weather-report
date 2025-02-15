import type { City } from '~/entities/city/types'

const city = ref<City>()

/**
 * Provides a setter and a reactive getter for the currently selected city
 * to share state between components.
 */
export const useCityStore = () => ({
  setCurrentCity: (newCity: City) => {
    city.value = newCity
  },
  currentCity: computed(() => city.value),
})
