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

const parseVariableToStringWithUnit = (variable: WeatherVariable<unknown>) => {
  return `${variable.value}${variable.unit}`
}

const filterPastHours = (weather: HourlyWeather) => {
  return weather.time >= new Date()
}

type HourlyWeatherRow = {
  [key in keyof HourlyWeather]: string
}
const rows = computed<HourlyWeatherRow[]>(() => props.dailyWeather
  .filter(filterPastHours)
  .map(weather => ({
    time: new Date(weather.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
    rain: parseVariableToStringWithUnit(weather.rain),
    temperature2m: parseVariableToStringWithUnit(weather.temperature2m),
    precipitationProbability: parseVariableToStringWithUnit(weather.precipitationProbability),
    cloudCover: parseVariableToStringWithUnit(weather.cloudCover),
  })))

type HourlyWeatherColumn = {
  key: keyof HourlyWeather
  label?: string
}

const { t } = useI18n()
const columns: HourlyWeatherColumn[] = [
  {
    key: 'time',
  },
  {
    key: 'cloudCover',
    label: t('entities.weather.cloudCover'),
  },
  {
    key: 'temperature2m',
    label: t('entities.weather.temperature'),
  },
  {
    key: 'rain',
    label: t('entities.weather.rain'),
  },
  {
    key: 'precipitationProbability',
    label: t('entities.weather.precipitationProbability'),
  },
]
</script>
