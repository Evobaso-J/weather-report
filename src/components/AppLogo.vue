<template>
  <div class="flex gap-3 items-center">
    <NuxtImg
      class="rounded-lg overflow-hidden"
      src="/images/logo.png"
      alt="Logo"
      :width="80"
    />
    <span class="text-2xl">
      {{ $t('app.name') }}
    </span>
  </div>
</template>

<script setup lang='ts'>
defineComponent({ name: 'AppLogo' })
</script>
