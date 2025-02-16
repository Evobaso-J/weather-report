import { Chart, type ChartConfiguration } from 'chart.js/auto'

export const useChart = (chartConfig: {
  chartRef: Ref<HTMLCanvasElement | undefined>
  data: Ref<Chart['data']>
  type: ChartConfiguration['type']
}) => {
  const { chartRef, data, type } = chartConfig
  const toast = useToast()
  const { t } = useI18n()
  const id = useId()

  const currentChart = ref<Chart>()
  watch(
    [chartRef, data],
    () => {
      if (!chartRef.value) {
        toast.add({
          color: 'red',
          title: t('error.chartNotLoaded'),
          id,
        })
        return
      }
      if (currentChart.value) {
        currentChart.value.destroy()
      }
      currentChart.value = new Chart(chartRef.value, {
        type: type,
        data: data.value,
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
}
