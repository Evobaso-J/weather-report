<template>
  <canvas ref="temperaturesChart" />
</template>

<script setup lang='ts'>
import type Chart from 'chart.js/auto'
import { format } from 'date-fns/format'
import { aggregateDailyWeatherByMonth } from './chartUtils'
import type { DailyWeather } from '~/entities/weatherHistory/types'
import type { TimeSpan } from '~/entities/weatherHistory/utils'

defineComponent({ name: 'TemperaturesChart' })

type TemperatureChartProps = {
  dailyWeather: DailyWeather[]
  timeSpan: TimeSpan
}
const props = defineProps<TemperatureChartProps>()
const temperaturesChart = ref<HTMLCanvasElement>()

const { t } = useI18n()

type ChartDataPerTimeSpan = Record<TimeSpan, Chart['data']>
const chartDataPerTimeSpan = computed<ChartDataPerTimeSpan[TimeSpan]>(() => {
  const maxTemperatureLabel = t('entities.weatherHistory.maxTemperature', { unit: props.dailyWeather[0]?.temperature2mMax.unit })
  const dailyMaxTemperature = props.dailyWeather.map(dailyWeather => dailyWeather.temperature2mMax.value)
  const maxTemperatureColor = 'rgba(255, 99, 132, 1)'
  const compareMaxTemperature = (num1: number, num2: number) => Math.max(num1, num2)
  const monthlyMaxTemperature = aggregateDailyWeatherByMonth(props.dailyWeather, compareMaxTemperature)

  const minTemperatureLabel = t('entities.weatherHistory.minTemperature', { unit: props.dailyWeather[0]?.temperature2mMin.unit })
  const dailyMinTemperature = props.dailyWeather.map(dailyWeather => dailyWeather.temperature2mMin.value)
  const minTemperatureColor = 'rgba(54, 162, 235, 1)'
  const compareMinTemperature = (num1: number, num2: number) => Math.min(num1, num2)
  const monthlyMinTemperature = aggregateDailyWeatherByMonth(props.dailyWeather, compareMinTemperature)

  const timeSpanMap: ChartDataPerTimeSpan = {
    weekly: {
      labels: props.dailyWeather.map(dailyWeather => format(dailyWeather.time, 'EEE d MMM')),
      datasets: [
        {
          backgroundColor: maxTemperatureColor,
          borderColor: maxTemperatureColor,
          label: maxTemperatureLabel,
          data: dailyMaxTemperature,
          borderWidth: 1,
        },
        {
          backgroundColor: minTemperatureColor,
          borderColor: minTemperatureColor,
          label: minTemperatureLabel,
          data: dailyMinTemperature,
          borderWidth: 1,
        },
      ],
    },
    monthly: {
      labels: props.dailyWeather.map(dailyWeather => format(dailyWeather.time, 'd MMM')),
      datasets: [
        {
          backgroundColor: maxTemperatureColor,
          borderColor: maxTemperatureColor,
          label: maxTemperatureLabel,
          data: dailyMaxTemperature,
          borderWidth: 1,
        },
        {
          backgroundColor: minTemperatureColor,
          borderColor: minTemperatureColor,
          label: minTemperatureLabel,
          data: dailyMinTemperature,
          borderWidth: 1,
        },
      ],
    },
    yearly: {
      labels: monthlyMaxTemperature.map(dailyWeather => format(dailyWeather.time, 'MMM yyyy')),
      datasets: [
        {
          backgroundColor: maxTemperatureColor,
          borderColor: maxTemperatureColor,
          label: maxTemperatureLabel,
          data: monthlyMaxTemperature.map(dailyWeather => dailyWeather.temperature2mMax.value),
          borderWidth: 1,
        },
        {
          backgroundColor: minTemperatureColor,
          borderColor: minTemperatureColor,
          label: minTemperatureLabel,
          data: monthlyMinTemperature.map(dailyWeather => dailyWeather.temperature2mMin.value),
          borderWidth: 1,
        },
      ],
    },
  }
  return timeSpanMap[props.timeSpan]
})

useChart({
  type: 'line',
  chartRef: temperaturesChart,
  data: chartDataPerTimeSpan,
})
</script>
