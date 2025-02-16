<template>
  <UTabs
    orientation="vertical"
    :items="items"
    :default-index="0"
    :ui="{
      container: 'relative',
      list: {
        width: 'w-auto',
      },
    }"
    class="w-28"
    @change="changeTimeSpan"
  >
    <template #icon="{ item, selected }">
      <UIcon
        :name="item.icon"
        class="w-4 h-4 flex-shrink-0 me-2"
        :class="[selected && 'text-primary-500']"
      />
    </template>
    <template #default="{ item, selected }">
      <span
        class="truncate"
        :class="[selected && 'text-primary-500']"
      >{{
        item.label
      }}</span>
    </template>
  </UTabs>
</template>

<script setup lang="ts">
import type { TimeSpan } from '~/entities/weatherHistory/utils'
import type { TabItem } from '#ui/types'

defineComponent({ name: 'HistorySectionTimeSpanSelector' })

const selectedTimeSpan = ref<TimeSpan>('weekly')

const { t } = useI18n()
const items: (TabItem & { key: TimeSpan })[] = [
  {
    label: t('entites.weatherHistory.timeSpan.weekly'),
    icon: 'i-mdi-calendar-week',
    key: 'weekly',
  },
  {
    label: t('entites.weatherHistory.timeSpan.monthly'),
    icon: 'i-mdi-calendar-month',
    key: 'monthly',
  },
  {
    label: t('entites.weatherHistory.timeSpan.yearly'),
    icon: 'i-mdi-calendar-multiple',
    key: 'yearly',
  },
]

export type TimeSpanSelectorEmits = {
  (event: 'change-timespan', timeSpan: TimeSpan): void
}

const emit = defineEmits<TimeSpanSelectorEmits>()
const changeTimeSpan = (index: number) => {
  selectedTimeSpan.value = items[index]!.key
  emit('change-timespan', selectedTimeSpan.value)
}

onMounted(() => {
  emit('change-timespan', selectedTimeSpan.value)
})
</script>
