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
import { unwrapOk, isErr } from 'option-t/plain_result'
import { cityRepository } from '~/entities/city/repository'

defineComponent({ name: 'CitySelector' })

const loading = ref(false)

const toast = useToast()

const cityRepo = cityRepository()
const search = async (q: string) => {
  if (!q.length) return []

  loading.value = true

  const cities = await cityRepo.query({ name: q })

  loading.value = false

  if (isErr(cities)) {
    toast.add({
      title: cities.err.message,
      color: 'red',
      timeout: 3000,
      icon: 'i-mdi-alert-outline',
    })
    return []
  }

  return unwrapOk(cities)
}

const { setCurrentCity, currentCity } = useCityStore()
</script>
