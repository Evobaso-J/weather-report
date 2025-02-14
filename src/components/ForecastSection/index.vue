<template>
  <section class="flex gap-10 w-full">
    <DaySelector
      :days
      @change="setDate"
    />
    <DailyWeatherTable
      :daily-weather="dailyWeather"
    />
  </section>
</template>

<script setup lang="ts">
import DailyWeatherTable from './DailyWeatherTable.vue'
import type { HourlyWeather } from '~/entities/weather/types'

defineComponent({ name: 'ForecastSection' })
type ForecastSectionProps = {
  weatherForecast: HourlyWeather[]
}
const props = defineProps<ForecastSectionProps>()

defineEmits<{
  (event: 'date-change', date: Date): void
}>()

const currentDate = ref<Date>()
const setDate = (date: Date) => {
  currentDate.value = date
}

const days = computed<Date[]>(() => {
  const uniqueDates = new Set(props.weatherForecast.map(forecast => forecast.time.toDateString()))
  return Array.from(uniqueDates).map(dateString => new Date(dateString))
})

const dailyWeather = computed<HourlyWeather[]>(() => props.weatherForecast.filter(
  forecast => forecast.time.toDateString() === currentDate.value?.toDateString(),
),
)
</script>
