<template>
  <section class="flex gap-10 w-full">
    <DaySelector
      :days
      @change="setDate"
    />
    <div>
      CURRENT DATE {{ currentDate }}
      <pre>{{ dailyWeather }}</pre>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { DailyWeather } from '~/entities/weather/types'

defineComponent({ name: 'ForecastSection' })
type ForecastSectionProps = {
  weatherForecast: DailyWeather[]
}
const props = defineProps<ForecastSectionProps>()

defineEmits<{
  (event: 'date-change', date: Date): void
}>()

const currentDate = ref<Date>()
const setDate = (date: Date) => {
  currentDate.value = date
}

const days = computed<Date[]>(() => props.weatherForecast.map(forecast => forecast.time))

const dailyWeather = computed<DailyWeather[]>(() =>
  props.weatherForecast.filter(
    forecast =>
      forecast.time.toISOString() === currentDate.value?.toISOString(),
  ),
)
</script>
