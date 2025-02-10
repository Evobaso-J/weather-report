<template>
  <div class="h-screen">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <UNotifications />
  </div>
</template>

<script setup lang='ts'>
const { t } = useI18n()
useHead({
  titleTemplate: t('app.titleTemplate'),
})
</script>
