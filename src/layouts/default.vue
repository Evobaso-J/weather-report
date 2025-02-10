<template>
  <div class="flex flex-col h-screen">
    <UContainer class="my-6 w-full">
      <div class="flex items-center gap-6">
        <AppLogo />
        <CitySelector
          class="w-1/2"
        />
      </div>
    </UContainer>
    <UContainer class="flex-1 overflow-auto w-full border-t">
      <div class="mb-12 pt-6">
        <slot />
      </div>
    </UContainer>
  </div>
</template>

<script setup lang='ts'>
</script>
