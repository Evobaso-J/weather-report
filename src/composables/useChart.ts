import { Chart, type ChartConfiguration } from 'chart.js/auto'

/**
 * Initializes and manages a Chart.js chart through Vue references and reactivity.
 * NOTE: this requires a canvas element to be present in the template.
 *
 * @param chartConfig
 * @param chartConfig.chartRef - Reference to the HTML canvas element for the chart.
 * @param chartConfig.data - Reactive reference to the chart data.
 * @param chartConfig.type - Type of the chart. E.g. 'line', 'bar', 'pie'.
 */
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
