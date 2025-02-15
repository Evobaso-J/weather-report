<template>
  <UTable
    :columns
    :rows
    :ui="{
      wrapper: 'grow p-1 pt-[1px] pb-2',
      divide: 'divide-y divide-gray-300',
      thead: 'sticky top-0 rounded-md ring-1 ring-gray-200 bg-white z-10',
      th: {
        base: 'text-left rtl:text-right rounded-md',
      },
    }"
  >
    <template #time-data="{ row }">
      <div class="flex items-center gap-2">
        <span>
          {{ new Date(row.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) }}
        </span>
        <ForecastSectionCloudCoverIcon
          :cloud-cover-percentage="row.cloudCover.value"
          :rain="row.rain.value"
          :temperature="row.temperature2m.value"
        />
      </div>
    </template>
    <template #rain-data="{ row }">
      {{ parseVariableToStringWithUnit(row.rain) }}
    </template>
    <template #temperature2m-data="{ row }">
      {{ parseVariableToStringWithUnit(row.temperature2m) }}
    </template>
    <template #precipitationProbability-data="{ row }">
      {{ parseVariableToStringWithUnit(row.precipitationProbability) }}
    </template>

    <template #cloudCover-data="{ row }">
      {{ parseVariableToStringWithUnit(row.cloudCover) }}
    </template>
  </UTable>
</template>

<script setup lang='ts'>
import type { HourlyWeather } from '~/entities/weatherForecast/types'
import type { WeatherVariable } from '~/entities/weatherHelpers'

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

const rows = computed<HourlyWeather[]>(() => props.dailyWeather
  .filter(filterPastHours),
)

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
    label: t('entities.weatherForecast.cloudCover'),
  },
  {
    key: 'temperature2m',
    label: t('entities.weatherForecast.temperature'),
  },
  {
    key: 'rain',
    label: t('entities.weatherForecast.rain'),
  },
  {
    key: 'precipitationProbability',
    label: t('entities.weatherForecast.precipitationProbability'),
  },
]
</script>
