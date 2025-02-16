<template>
  <canvas ref="rainChart" />
</template>

<script setup lang='ts'>
import type { Chart } from 'chart.js/auto'
import { format } from 'date-fns/format'
import { aggregateDailyWeatherByMonth } from './chartUtils'
import type { DailyWeather } from '~/entities/weatherHistory/types'
import type { TimeSpan } from '~/entities/weatherHistory/utils'

defineComponent({ name: 'RainChart' })

type RainChartProps = {
  dailyWeather: DailyWeather[]
  timeSpan: TimeSpan
}
const props = defineProps<RainChartProps>()
const rainChart = ref<HTMLCanvasElement>()

const { t } = useI18n()

type ChartDataPerTimeSpan = Record<TimeSpan, Chart['data']>
const chartDataPerTimeSpan = computed<ChartDataPerTimeSpan[TimeSpan]>(() => {
  const label = t('entities.weatherHistory.rainSum', { unit: props.dailyWeather[0]?.rainSum.unit })

  const sumRain = (num1: number, num2: number) => num1 + num2
  const monthlyRainSum = aggregateDailyWeatherByMonth(props.dailyWeather, sumRain)
  const dailyRainValues = props.dailyWeather.map(dailyWeather => dailyWeather.rainSum.value)

  const timeSpanMap: ChartDataPerTimeSpan = {
    weekly: {
      labels: props.dailyWeather.map(dailyWeather => format(dailyWeather.time, 'EEE d MMM')),
      datasets: [{
        label,
        data: dailyRainValues,
        borderWidth: 1,
      }],
    },
    monthly: {
      labels: props.dailyWeather.map(dailyWeather => format(dailyWeather.time, 'd MMM')),
      datasets: [{
        label,
        data: dailyRainValues,
        borderWidth: 1,
      }],
    },
    yearly: {
      labels: monthlyRainSum.map(dailyWeather => format(dailyWeather.time, 'MMM yyyy')),
      datasets: [{
        label,
        data: monthlyRainSum.map(dailyWeather => dailyWeather.rainSum.value),
        borderWidth: 1,
      }],
    },
  }
  return timeSpanMap[props.timeSpan]
})

useChart({ chartRef: rainChart, data: chartDataPerTimeSpan, type: 'bar' })
</script>
