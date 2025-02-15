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
      <pre v-else-if="activeTab.key === 'history'">
        {{ weatherHistory }}
      </pre>
      <ForecastSection
        v-else-if="activeTab.key === 'forecast'"
        :weather-forecast="weatherForecast ?? []"
      />
    </UCard>
  </section>
</template>

<script setup lang="ts">
import type { TabItem } from '#ui/types'
import type { AsyncDataRequestStatus } from '#app'
import { FORECAST_DAYS } from '~/entities/weatherForecast/constants'
import { weatherForecastRepository } from '~/entities/weatherForecast/repository'
import { weatherHistoryRepository } from '~/entities/weatherHistory/repository'

const { t } = useI18n()

useHead({
  title: t('home'),
})

const { currentCity } = useCityStore()

const { unwrapResult } = useUnwrapResult()

const weatherForecastRepo = weatherForecastRepository()
const { data: weatherForecast, status: weatherForecastCallStatus } = useAsyncData(() => weatherForecastRepo.query({
  latitude: currentCity.value?.latitude ?? 0,
  longitude: currentCity.value?.longitude ?? 0,
  forecast_days: FORECAST_DAYS,
}), {
  transform: unwrapResult,
  watch: [currentCity],
})

const weatherHistoryRepo = weatherHistoryRepository()
const { data: weatherHistory, status: weatherHistoryCallStatus } = useAsyncData(() => weatherHistoryRepo.query({
  latitude: currentCity.value?.latitude ?? 90,
  longitude: currentCity.value?.longitude ?? 90,
  timeSpan: 'yearly',
}), {
  transform: unwrapResult,
  watch: [currentCity],
})

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

export type DataStatus = 'loading' | 'error' | 'empty' | 'success'
const dataStatus = computed<DataStatus>(() => {
  const callStatusMap = {
    forecast: weatherForecastCallStatus.value,
    history: weatherHistoryCallStatus.value,
  } as const satisfies Record<(typeof tabs)[number]['key'], AsyncDataRequestStatus>

  const callStatus = callStatusMap[activeTab.value.key]
  if (callStatus === 'pending') return 'loading'
  if (callStatus === 'error') return 'error'
  if (callStatus === 'success' && !weatherForecast.value?.length) return 'empty'
  return 'success'
})
</script>
