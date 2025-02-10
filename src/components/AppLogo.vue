<template>
  <div class="flex gap-3 items-center">
    <NuxtImg
      src="/images/logo.svg"
      alt="Logo"
      :width="size"
    />
    <span class="text-2xl">
      {{ $t('app.name') }}
    </span>
  </div>
</template>

<script setup lang='ts'>
defineComponent({ name: 'AppLogo' })

type AppLogoProps = {
  /**
   * The pixel size of the logo.
   */
  size?: string
}

withDefaults(defineProps<AppLogoProps>(), {
  size: '40',
})
</script>
