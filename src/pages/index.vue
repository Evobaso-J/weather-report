<template>
  <section class="flex flex-col items-start">
    <UTabs
      :items="tabs"
      @change="changeTab"
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
        >{{ item.label }}</span>
      </template>
    </UTabs>
    <UCard class="w-full">
      <DataAlternateStatus
        v-if="dataStatus !== 'success'"
        :status="dataStatus"
      />
      <ForecastSection
        v-else-if="activeTab.key === 'forecast'"
        :weather-forecast="weatherForecast ?? []"
      />
    </UCard>
  </section>
</template>

<script setup lang="ts">
import { FORECAST_DAYS } from '~/entities/weather/constants'
import { weatherRepository } from '~/entities/weather/repository'
import type { TabItem } from '#ui/types'

const { t } = useI18n()

useHead({
  title: t('home'),
})

const { currentCity } = useCityStore()

const { unwrapResult } = useUnwrapResult()

const tabs = [{
  label: t('weatherForecast'),
  icon: 'i-mdi-weather-partly-rainy',
  key: 'forecast',
},
{
  label: t('weatherHistory'),
  icon: 'i-mdi-weather-cloudy-clock',
  key: 'history',
}] as const satisfies (TabItem & { key: string })[]

const activeTab = ref<(typeof tabs)[number]>(tabs[0])

const changeTab = (index: number) => {
  const newTab = tabs[index]
  if (!newTab) return
  activeTab.value = newTab
}

const weatherRepo = weatherRepository()
const { data: weatherForecast, status } = useAsyncData(() => weatherRepo.query({
  latitude: currentCity.value?.latitude ?? 0,
  longitude: currentCity.value?.longitude ?? 0,
  forecast_days: FORECAST_DAYS,
}), {
  transform: unwrapResult,
  watch: [currentCity],
})

export type DataStatus = 'loading' | 'error' | 'empty' | 'success'

const dataStatus = computed<DataStatus>(() => {
  if (status.value === 'pending') return 'loading'
  if (status.value === 'error') return 'error'
  if (status.value === 'success' && !weatherForecast.value?.length) return 'empty'
  return 'success'
})
</script>
