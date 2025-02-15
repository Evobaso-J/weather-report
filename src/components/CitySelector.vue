<template>
  <UInputMenu
    :model-value="currentCity"
    :search="search"
    :loading="loading"
    :placeholder="$t('searchCity')"
    icon="i-mdi-magnify"
    option-attribute="name"
    search-lazy
    size="xl"
    by="id"
    :ui="{
      icon: { trailing: { pointer: '' } },
    }"
    :ui-menu="{
      option: { container: 'flex items-center gap-1.5 min-w-0 w-full' },
    }"
    @update:model-value="setCurrentCity"
  >
    <template #option="{ option }">
      <div
        class="flex gap-2 w-full truncate items-center cursor-pointer"
      >
        <UIcon
          :name="'i-mdi-map-marker-radius'"
          class="text-primary"
        />
        {{ `${option.name} - ${option.country}, ${option.admin1}` }}
      </div>
    </template>
  </UInputMenu>
</template>

<script setup lang='ts'>
import { cityRepository } from '~/entities/city/repository'

defineComponent({ name: 'CitySelector' })

const loading = ref(false)

const { unwrapResult } = useUnwrapResult()

const cityRepo = cityRepository()
const search = async (q: string) => {
  if (!q.length) return []

  loading.value = true
  const cities = await cityRepo.query({ name: q })

  loading.value = false

  return unwrapResult(cities)
}

const { setCurrentCity, currentCity } = useCityStore()
</script>
