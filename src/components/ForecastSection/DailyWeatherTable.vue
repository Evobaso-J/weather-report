<template>
  <div>
    {{ dailyWeather }}
  </div>
</template>

<script setup lang='ts'>
import type { HourlyWeather } from '~/entities/weather/types'

defineComponent({ name: 'DailyWeatherTable' })
type DailyWeatherProps = {
  dailyWeather: HourlyWeather[]
}
defineProps<DailyWeatherProps>()
</script>
