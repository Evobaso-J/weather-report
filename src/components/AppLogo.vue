<template>
  <div class="flex gap-3 items-center">
    <NuxtImg
      src="/images/logo.svg"
      alt="Logo"
      :width="40"
    />
    <span class="text-2xl">
      {{ $t('app.name') }}
    </span>
  </div>
</template>

<script setup lang='ts'>
defineComponent({ name: 'AppLogo' })
</script>
