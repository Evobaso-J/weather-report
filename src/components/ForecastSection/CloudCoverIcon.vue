<template>
  <UIcon
    :name="weatherIcon.icon"
    :class="weatherIcon.colorClass"
    class="size-8
    mdi-weather-cloudy
    mdi-weather-rainy
    mdi-weather-pouring
    mdi-weather-
    text-bl
    "
  />
</template>

<script setup lang='ts'>
defineComponent({ name: 'ForecastSectionCloudCoverIcon' })
type Props = {
  cloudCoverPercentage: number
  temperature: number
  rain: number
}
const props = defineProps<Props>()

type WeatherIcon = {
  icon: string
  colorClass: string
}
const weatherIcon = computed<WeatherIcon>(() => {
  if (props.rain >= 5) {
    return {
      icon: 'mdi-weather-pouring',
      colorClass: 'text-blue-500',
    }
  }
  if (props.rain >= 2) {
    return {
      icon: 'mdi-weather-rainy',
      colorClass: 'text-blue-300',
    }
  }
  if (props.cloudCoverPercentage > 75) {
    return {
      icon: 'mdi-weather-cloudy',
      colorClass: 'text-gray-500',
    }
  }
  if (props.rain > 0) {
    return {
      icon: 'mdi-weather-partly-rainy',
      colorClass: 'text-blue-100',
    }
  }
  if (props.cloudCoverPercentage >= 50) {
    return {
      icon: 'mdi-weather-partly-cloudy',
      colorClass: 'text-orange-500',
    }
  }
  if (props.temperature >= 28) {
    return {
      icon: 'mdi-weather-sunny-alert',
      colorClass: 'text-red-500',
    }
  }
  return {
    icon: 'mdi-weather-sunny',
    colorClass: 'text-orange-500',
  }
})
</script>
