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
    @change="emitDate"
  >
    <template #icon="{ item, selected }">
      <UIcon
        :name="item.icon"
        class="w-4 h-4 flex-shrink-0 me-2"
        :class="[selected && 'text-primary-500 dark:text-primary-400']"
      />
    </template>
    <template #default="{ item, selected }">
      <span
        class="truncate"
        :class="[selected && 'text-primary-500 dark:text-primary-400']"
      >{{ item.label }}</span>
    </template>
  </UTabs>
</template>

<script setup lang="ts">
import type { TabItem } from '#ui/types'

defineComponent({ name: 'DaySelector' })

type DaySelectorEmits = {
  (event: 'change', date: Date): void
}
const emit = defineEmits<DaySelectorEmits>()

type DaySelectorProps = {
  days: Date[]
}
const props = defineProps<DaySelectorProps>()

type DaySelectorTabItem = TabItem & { value: Date }
const items = computed<DaySelectorTabItem[]>(() => {
  return props.days.map((date) => {
    return {
      label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: date,
      icon: 'i-heroicons-calendar',
    }
  })
})

const emitDate = (index: number) => {
  emit('change', items.value[index]!.value)
}

onMounted(() => {
  emit('change', items.value[0]!.value)
})
</script>
