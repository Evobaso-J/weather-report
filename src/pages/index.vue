<template>
  <UCard class="w-full">
    <ForecastSection
      v-if="dataStatus === 'success'"
      :weather-forecast="weatherForecast ?? []"
    />
    <DataAlternateStatus
      v-else
      :status="dataStatus"
    />
  </UCard>
</template>

<script setup lang="ts">
import { FORECAST_DAYS } from '~/entities/weather/constants'
import { weatherRepository } from '~/entities/weather/repository'

const { t } = useI18n()

useHead({
  title: t('home'),
})

const { currentCity } = useCityStore()

const { unwrapResult } = useUnwrapResult()

const weatherRepo = weatherRepository()
const { data: weatherForecast, status } = useAsyncData(() => weatherRepo.query({
  latitude: currentCity.value?.latitude ?? 0,
  longitude: currentCity.value?.longitude ?? 0,
  forecast_days: FORECAST_DAYS,
}), {
  transform: unwrapResult,
  watch: [currentCity],
})

export type DataStatus = 'loading' | 'error' | 'empty' | 'success'

const dataStatus = computed<DataStatus>(() => {
  if (status.value === 'pending') return 'loading'
  if (status.value === 'error') return 'error'
  if (status.value === 'success' && !weatherForecast.value?.length) return 'empty'
  return 'success'
})
</script>
