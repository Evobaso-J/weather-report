<template>
  <section
    class="h-[40vh] rounded-md"
    :class="{
      'bg-red-100': status === 'error',
      'bg-gray-100': status === 'empty',
      'bg-primary-50': status === 'loading',
    }"
  >
    <div
      v-if="status === 'loading'"
      class="flex items-center justify-center h-full"
    >
      <div class="flex flex-col gap-3 items-center">
        <span class="animate-pulse text-primary-500 text-2xl pl-4">
          <span>{{ $t('loading') }}</span>
        </span>
        <UIcon
          size="60"
          name="i-mdi-loading"
          class="text-primary-500 animate-spin"
        />
      </div>
    </div>

    <div
      v-if="status === 'error'"
      class="flex items-center justify-center h-full"
    >
      <span class="text-red-500 text-xl">
        {{ $t('error.dataFetchingError') }}
      </span>
    </div>

    <div
      v-if="status === 'empty'"
      class="flex items-center justify-center h-full"
    >
      <span class="text-gray-500 text-xl">
        {{ $t('error.noElementFound') }}
      </span>
    </div>
  </section>
</template>

<script setup lang='ts'>
import type { DataStatus } from '~/pages/index.vue'

defineComponent({ name: 'DataTableAltStatus' })

   type DataTableAltStatusProps = {
     status: Exclude<DataStatus, 'success'>
   }

defineProps<DataTableAltStatusProps>()
</script>
