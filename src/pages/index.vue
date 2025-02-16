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
      <ForecastSection
        v-if="activeTab.key === 'forecast'"
        :weather-forecast="weatherForecast ?? []"
        :fetching-status="fetchingStatus"
      />
      <HistorySection
        v-if="activeTab.key === 'history'"
        :weather-history="weatherHistory ?? []"
        :fetching-status="fetchingStatus"
        :time-span="currentTimeSpan"
        @change-timespan="(val) => { currentTimeSpan = val }"
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
import type { TimeSpan } from '~/entities/weatherHistory/utils'

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
const currentTimeSpan = ref<TimeSpan>('weekly')
const { data: weatherHistory, status: weatherHistoryCallStatus } = useAsyncData(() => weatherHistoryRepo.query({
  latitude: currentCity.value?.latitude ?? 45.448154,
  longitude: currentCity.value?.longitude ?? 9.169279,
  timeSpan: currentTimeSpan.value,
}), {
  transform: unwrapResult,
  watch: [currentCity, currentTimeSpan],
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

const activeTab = ref<(typeof tabs)[number]>(tabs[1])

const changeTab = (index: number) => {
  const newTab = tabs[index]
  if (!newTab) return
  activeTab.value = newTab
}

export type FetchingStatus = 'loading' | 'error' | 'empty' | 'success'
const fetchingStatus = computed<FetchingStatus>(() => {
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
