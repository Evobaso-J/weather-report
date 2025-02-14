<template>
  <UTable
    :columns
    :rows
  />
</template>

<script setup lang='ts'>
import type { HourlyWeather, WeatherVariable } from '~/entities/weather/types'

defineComponent({ name: 'DailyWeatherTable' })
type DailyWeatherProps = {
  dailyWeather: HourlyWeather[]
}
const props = defineProps<DailyWeatherProps>()

type WeatherColumns = {
  key: keyof HourlyWeather
  label?: string
}

const columns: WeatherColumns[] = [
  {
    key: 'time',
    // label: 'Hour',
  },
  {
    key: 'rain',
    label: 'Rain',
  },
  {
    key: 'temperature2m',
    label: 'Temperature',
  },
  {
    key: 'precipitationProbability',
    label: 'Precipitation Probability',
  },
]

const parseVariableToStringWithUnit = (variable: WeatherVariable<unknown>) => {
  return `${variable.value}${variable.unit}`
}

const filterPastHours = (weather: HourlyWeather) => {
  return weather.time >= new Date()
}

const rows = computed(() => props.dailyWeather
  .filter(filterPastHours)
  .map(weather => ({
    time: new Date(weather.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
    rain: parseVariableToStringWithUnit(weather.rain),
    temperature2m: parseVariableToStringWithUnit(weather.temperature2m),
    precipitationProbability: parseVariableToStringWithUnit(weather.precipitationProbability),
  })))
</script>
