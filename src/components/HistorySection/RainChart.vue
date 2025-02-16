<template>
  <canvas ref="rainChart" />
</template>

<script setup lang='ts'>
import { Chart } from 'chart.js/auto'
import { format } from 'date-fns/format'
import { parse } from 'date-fns/parse'
import type { DailyWeather } from '~/entities/weatherHistory/types'
import type { TimeSpan } from '~/entities/weatherHistory/utils'

defineComponent({ name: 'RainChart' })

type DailyRainSum = Pick<DailyWeather, 'time' | 'rainSum'>

type RainChartProps = {
  dailyWeather: DailyRainSum[]
  timeSpan: TimeSpan
}
const props = defineProps<RainChartProps>()

const rainChart = ref<HTMLCanvasElement>()

const aggregateByMonth = (dailyWeather: DailyRainSum[]): DailyRainSum[] => {
  const months = new Map<string, DailyRainSum>()

  dailyWeather.forEach((dailyWeather) => {
    const monthYear = format(new Date(dailyWeather.time), 'MMM yyyy')
    if (!months.has(monthYear)) {
      const monthDate = parse(monthYear, 'MMM yyyy', new Date())
      months.set(monthYear, {
        time: monthDate,
        rainSum: { ...dailyWeather.rainSum },
      })
    }
    else {
      const existing = months.get(monthYear)
      if (existing) {
        existing.rainSum.value += dailyWeather.rainSum.value
      }
    }
  })

  return Array.from(months.values())
}

type ChartData = Record<TimeSpan, Chart['data']>
const chartDataPerTimeSpan = computed<ChartData[TimeSpan]>(() => {
  const label = `Rainfall ${(props.dailyWeather[0]?.rainSum.unit ?? '')}`

  const monthlyRainSum = aggregateByMonth(props.dailyWeather)
  const dailyRainValues = props.dailyWeather.map(dailyWeather => dailyWeather.rainSum.value)

  const timeSpanMap: ChartData = {
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

const toast = useToast()
const { t } = useI18n()
watch(
  [rainChart, chartDataPerTimeSpan],
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
      data: chartDataPerTimeSpan.value,
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
