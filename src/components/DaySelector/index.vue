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

<script setup lang='ts'>
defineComponent({ name: 'DaySelector' })

const today = new Date()

const items = Array.from({ length: 15 }, (_, i) => {
  const date = new Date(today)
  date.setDate(today.getDate() + i)

  return {
    label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: date.toISOString(),
    icon: 'i-heroicons-calendar',
  }
})
</script>
