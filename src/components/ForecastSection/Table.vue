<template>
  <UTable
    :columns
    :rows
    :ui="{
      wrapper: 'grow p-1 pt-[1px] pb-2',
      divide: 'divide-y divide-gray-300',
      thead: 'sticky top-0 rounded-md ring-1 ring-gray-200 bg-white',
      th: {
        base: 'text-left rtl:text-right rounded-md',
      },
    }"
  />
</template>

<script setup lang='ts'>
import type { HourlyWeather, WeatherVariable } from '~/entities/weather/types'

defineComponent({ name: 'ForecastSectionTable' })
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
    key: 'temperature2m',
    label: 'Temperature',
  },
  {
    key: 'rain',
    label: 'Rain',
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
