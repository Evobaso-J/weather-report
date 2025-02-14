<template>
  <div class="flex gap-10">
    <UCard class="w-full">
      <section
        v-if="dataStatus === 'success'"
        class="flex gap-4 w-full"
      >
        <DaySelector
          :days
          @change="setDate"
        />
        <div>
          CURRENT DATE {{ currentDate }}
          <pre>
             {{ dailyWeather }}
            </pre>
        </div>
      </section>
      <DataAlternateStatus
        v-else
        :status="dataStatus"
      />
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { FORECAST_DAYS } from '~/entities/weather/constants'
import { weatherRepository } from '~/entities/weather/repository'
import type { DailyWeather } from '~/entities/weather/types'

const { t } = useI18n()

useHead({
  title: t('home'),
})

const currentDate = ref<Date>()
const setDate = (date: Date) => {
  currentDate.value = date
}

const { currentCity } = useCityStore()

const { unwrapResult } = useUnwrapResult()

const weather = weatherRepository()
const { data: weatherForecast, status } = useAsyncData(() => {
  return weather.query({
    latitude: currentCity.value?.latitude ?? 0,
    longitude: currentCity.value?.longitude ?? 0,
    forecast_days: FORECAST_DAYS,
  })
}, {
  transform: unwrapResult,
})

const days = computed<Date[]>(() => weatherForecast.value?.map(forecast => forecast.time) ?? [])

const dailyWeather = computed<DailyWeather[]>(() => weatherForecast.value?.filter(forecast => forecast.time.toISOString() === currentDate.value?.toISOString()) ?? [])

export type DataStatus = 'loading' | 'error' | 'empty' | 'success'

const dataStatus = computed<DataStatus>(() => {
  if (status.value === 'pending') return 'loading'
  if (status.value === 'error') return 'error'
  if (status.value === 'success' && !weatherForecast.value?.length) return 'empty'
  return 'success'
})
</script>
