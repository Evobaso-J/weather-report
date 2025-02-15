<template>
  <div>
    <DataAlternateStatus
      v-if="fetchingStatus !== 'success'"
      :status="fetchingStatus"
    />
    <section
      v-else
      class="flex gap-10 w-full max-h-[35rem]"
    >
      <ForecastSectionDaySelector
        :days
        @change="setDate"
      />
      <ForecastSectionTable
        class="pr-4"
        :daily-weather="dailyWeather"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import type { HourlyWeather } from '~/entities/weatherForecast/types'
import type { FetchingStatus } from '~/pages/index.vue'

defineComponent({ name: 'ForecastSection' })
type ForecastSectionProps = {
  weatherForecast: HourlyWeather[]
  fetchingStatus: FetchingStatus
}
const props = defineProps<ForecastSectionProps>()

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
