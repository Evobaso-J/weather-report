<template>
  <div class="flex gap-10">
    <DaySelector @change="setDate" />
    <div>
      CURRENT DATE{{ currentDate }}
      <pre>
        {{ data }}
      </pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { cityRepository } from '~/entities/city/repository'

const { t } = useI18n()

useHead({
  title: t('home'),
})

const cityRepo = cityRepository()
const { data } = await useAsyncData(() => cityRepo.query({ name: 'milano' }))

const currentDate = ref<string>()
const setDate = (ISODate: string) => {
  currentDate.value = ISODate
}
</script>
