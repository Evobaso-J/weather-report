<template>
  <canvas ref="temperaturesChart" />
</template>

<script setup lang='ts'>
import type Chart from 'chart.js/auto'
import { format } from 'date-fns/format'
import { parse } from 'date-fns/parse'
import type { DailyWeather } from '~/entities/weatherHistory/types'
import type { TimeSpan } from '~/entities/weatherHistory/utils'

defineComponent({ name: 'TemperaturesChart' })

type DailyTemperatures = Pick<DailyWeather, 'time' | 'temperature2mMax' | 'temperature2mMin'>

type TemperatureChartProps = {
  dailyWeather: DailyTemperatures[]
  timeSpan: TimeSpan
}
const props = defineProps<TemperatureChartProps>()
const temperaturesChart = ref<HTMLCanvasElement>()

const aggregateByMonth = (dailyWeather: DailyTemperatures[]): DailyTemperatures[] => {
  const months = new Map<string, DailyTemperatures>()

  dailyWeather.forEach((dailyWeather) => {
    const monthYear = format(new Date(dailyWeather.time), 'MMM yyyy')
    if (!months.has(monthYear)) {
      const monthDate = parse(monthYear, 'MMM yyyy', new Date())
      months.set(monthYear, {
        time: monthDate,
        temperature2mMax: { ...dailyWeather.temperature2mMax },
        temperature2mMin: { ...dailyWeather.temperature2mMin },
      })
    }
    else {
      const existing = months.get(monthYear)
      if (existing) {
        existing.temperature2mMax.value = Math.max(existing.temperature2mMax.value, dailyWeather.temperature2mMax.value)
        existing.temperature2mMin.value = Math.min(existing.temperature2mMin.value, dailyWeather.temperature2mMin.value)
      }
    }
  })

  return Array.from(months.values())
}

const { t } = useI18n()

type ChartDataPerTimeSpan = Record<TimeSpan, Chart['data']>
const chartDataPerTimeSpan = computed<ChartDataPerTimeSpan[TimeSpan]>(() => {
  const maxTemperatureLabel = t('entities.weatherHistory.maxTemperature', { unit: props.dailyWeather[0]?.temperature2mMax.unit })
  const dailyMaxTemperature = props.dailyWeather.map(dailyWeather => dailyWeather.temperature2mMax.value)
  const maxTemperatureColor = 'rgba(255, 99, 132, 1)'

  const minTemperatureLabel = t('entities.weatherHistory.minTemperature', { unit: props.dailyWeather[0]?.temperature2mMin.unit })
  const dailyMinTemperature = props.dailyWeather.map(dailyWeather => dailyWeather.temperature2mMin.value)
  const minTemperatureColor = 'rgba(54, 162, 235, 1)'

  const monthlyTemperatures = aggregateByMonth(props.dailyWeather)

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
      labels: monthlyTemperatures.map(dailyWeather => format(dailyWeather.time, 'MMM yyyy')),
      datasets: [
        {
          backgroundColor: maxTemperatureColor,
          borderColor: maxTemperatureColor,
          label: maxTemperatureLabel,
          data: monthlyTemperatures.map(dailyWeather => dailyWeather.temperature2mMax.value),
          borderWidth: 1,
        },
        {
          backgroundColor: minTemperatureColor,
          borderColor: minTemperatureColor,
          label: minTemperatureLabel,
          data: monthlyTemperatures.map(dailyWeather => dailyWeather.temperature2mMin.value),
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
