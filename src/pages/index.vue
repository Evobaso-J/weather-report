<template>
  <div>
    <pre>
      {{ data }}
    </pre>
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
</script>
