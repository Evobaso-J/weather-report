<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtWelcome />
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

useHead({
  title: t('home'),
})
</script>
