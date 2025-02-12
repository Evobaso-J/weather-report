<template>
  <div class="flex gap-10">
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
  </div>
</template>

<script setup lang="ts">
import { isErr, unwrapOk } from 'option-t/plain_result'
import { FORECAST_DAYS } from '~/entities/weather/constants'
import { weatherRepository } from '~/entities/weather/repository'

const { t } = useI18n()

useHead({
  title: t('home'),
})

const currentDate = ref<Date>()
const setDate = (date: Date) => {
  currentDate.value = date
}

const { currentCity } = useCityStore()

const weather = weatherRepository()
const { data: weatherForecast } = await useAsyncData(() => {
  return weather.query({
    latitude: currentCity.value?.latitude ?? 0,
    longitude: currentCity.value?.longitude ?? 0,
    forecast_days: FORECAST_DAYS,
  })
})

const days = computed<Date[]>(() => {
  if (!weatherForecast.value) return []
  if (isErr(weatherForecast.value)) return []
  return unwrapOk(weatherForecast.value).map(forecast => forecast.time)
})

const dailyWeather = computed(() => {
  if (!weatherForecast.value) return []
  if (isErr(weatherForecast.value)) return []
  return unwrapOk(weatherForecast.value).filter((forecast) => {
    return forecast.time.toISOString() === currentDate.value?.toISOString()
  })
})
</script>
