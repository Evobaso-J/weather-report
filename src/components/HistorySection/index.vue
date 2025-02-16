<template>
  <section class="flex gap-10 w-full max-h-[35rem]">
    <HistorySectionTimeSpanSelector @change-timespan="(val) => emit('change-timespan', val)" />
    <div class="w-full overflow-scroll">
      <DataAlternateStatus
        v-if="fetchingStatus !== 'success'"
        :status="fetchingStatus"
      />
      <div
        v-else
        class="flex flex-col gap-7 overflow-hidden"
      >
        <HistorySectionRainChart
          :time-span="timeSpan"
          :daily-weather="weatherHistory"
        />
        <HistorySectionTemperaturesChart
          :time-span="timeSpan"
          :daily-weather="weatherHistory"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang='ts'>
import type { TimeSpanSelectorEmits } from './TimeSpanSelector.vue'
import type { FetchingStatus } from '~/pages/index.vue'
import type { DailyWeather } from '~/entities/weatherHistory/types'
import type { TimeSpan } from '~/entities/weatherHistory/utils'

defineComponent({ name: 'HistorySection' })
type HistorySectionProps = {
  weatherHistory: DailyWeather[]
  fetchingStatus: FetchingStatus
  timeSpan: TimeSpan
}
defineProps<HistorySectionProps>()

type HistorySectionEmits = TimeSpanSelectorEmits
const emit = defineEmits<HistorySectionEmits>()
</script>
