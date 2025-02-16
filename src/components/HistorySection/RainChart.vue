<template>
  <canvas ref="rainChart" />
</template>

<script setup lang='ts'>
import { Chart } from 'chart.js/auto'
import { format } from 'date-fns/format'
import type { DailyWeather } from '~/entities/weatherHistory/types'
import type { TimeSpan } from '~/entities/weatherHistory/utils'

defineComponent({ name: 'RainChart' })
type RainChartProps = {
  dailyWeather: DailyWeather[]
  timeSpan: TimeSpan
}
const props = defineProps<RainChartProps>()

const rainChart = ref<HTMLCanvasElement>()

const chartDataPerTimeSpan: Record<TimeSpan, Chart['data']> = {
  weekly: {
    labels: props.dailyWeather.map(dailyWeather => format(dailyWeather.time, 'EEE d MMM')),
    datasets: [{
      label: 'Rainfall ' + props.dailyWeather[0]!.rainSum.unit,
      data: props.dailyWeather.map(dailyWeather => dailyWeather.rainSum.value),
      borderWidth: 1,
    }],
  },
  monthly: {
    labels: props.dailyWeather.map(dailyWeather => format(dailyWeather.time, 'd MMM')),
    datasets: [{
      label: 'Rainfall ' + props.dailyWeather[0]!.rainSum.unit,
      data: props.dailyWeather.map(dailyWeather => dailyWeather.rainSum.value),
      borderWidth: 1,
    }],
  },
  yearly: {
    labels: props.dailyWeather.map(dailyWeather => format(dailyWeather.time, 'MMMM')),
    datasets: [{
      label: 'Rainfall ' + props.dailyWeather[0]!.rainSum.unit,
      data: props.dailyWeather.map(dailyWeather => dailyWeather.rainSum.value),
      borderWidth: 1,
    }],
  },
}

const toast = useToast()
const { t } = useI18n()
watch(
  [rainChart,
    () => props.timeSpan],
  () => {
    if (!rainChart.value) {
      console.log(rainChart.value)
      toast.add({
        color: 'red',
        title: t('error.chartNotLoaded'),
      })
      return
    }

    new Chart(rainChart.value, {
      type: 'bar',
      data: chartDataPerTimeSpan[props.timeSpan],
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    })
  },
)
</script>
