<template>
  <section class="flex gap-10 w-full max-h-[35rem]">
    <HistorySectionTimeSpanSelector @change-timespan="(val) => emit('change-timespan', val)" />
    <div class="w-full overflow-scroll">
      <DataAlternateStatus
        v-if="fetchingStatus !== 'success'"
        :status="fetchingStatus"
      />
      <pre
        v-else
        class="overflow-scroll"
      >
        {{ weatherHistory }}
      </pre>
    </div>
  </section>
</template>

<script setup lang='ts'>
import type { TimeSpanSelectorEmits } from './TimeSpanSelector.vue'
import type { FetchingStatus } from '~/pages/index.vue'
import type { DailyWeather } from '~/entities/weatherHistory/types'

defineComponent({ name: 'HistorySection' })
type HistorySectionProps = {
  weatherHistory: DailyWeather[]
  fetchingStatus: FetchingStatus
}
defineProps<HistorySectionProps>()

type HistorySectionEmits = TimeSpanSelectorEmits
const emit = defineEmits<HistorySectionEmits>()
</script>
