import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import type { ChartConfiguration } from 'chart.js'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const toastAddMock = vi.hoisted(() => vi.fn())

const { useToastMock } = vi.hoisted(() => ({
  useToastMock: vi.fn(() => ({
    add: toastAddMock,
  })),
}))
const { useI18nMock } = vi.hoisted(() => ({
  useI18nMock: vi.fn(() => ({
    t: vi.fn((key: string) => key),
  })),
}))

const { ChartMock } = vi.hoisted(() => ({
  ChartMock: vi.fn(),
}))

mockNuxtImport('useToast', () => useToastMock)
mockNuxtImport('useI18n', () => useI18nMock)
mockNuxtImport('useId', () => () => 'id')
vi.mock('chart.js/auto', () => ({
  Chart: ChartMock,
}))

const MOCK_CHART_DATA = {
  datasets: [{
    data: [10, 20, 30],
    label: 'test',
  }],
}

describe('useChart', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should not plot a chart on the first render', () => {
    const chartRef = ref({} as HTMLCanvasElement)
    const data = ref(MOCK_CHART_DATA)

    useChart({ chartRef, data, type: 'bar' })

    expect(toastAddMock).not.toHaveBeenCalled()
    expect(ChartMock).not.toHaveBeenCalled()
  })
  describe('once the page is loaded and the data or ref change', () => {
    it('should display an error toast if chartRef is not defined when data change', async () => {
      const chartRef = ref()
      const data = ref()

      useChart({
        data: data,
        chartRef: chartRef,
        type: 'bar',
      })
      data.value = MOCK_CHART_DATA
      await nextTick()

      expect(toastAddMock).toHaveBeenCalledWith({
        color: 'red',
        title: 'error.chartNotLoaded',
        id: 'id',
      })
    })
    it('should create a new Chart instance with the provided chartData', async () => {
      const chartRef = ref()
      const data = ref(MOCK_CHART_DATA)

      useChart({ chartRef, data, type: 'bar' })
      chartRef.value = {} as HTMLCanvasElement
      await nextTick()

      const expectedChartConfiguration: ChartConfiguration = {
        data: MOCK_CHART_DATA,
        type: 'bar',
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      }
      expect(ChartMock).toHaveBeenCalledWith(chartRef.value, expectedChartConfiguration)
    })
  })
})
