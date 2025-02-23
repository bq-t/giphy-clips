import { computed, onMounted, onUnmounted, ref } from 'vue'

const DEVICE_BREAKPOINTS = {
  mobile: 640,
  tablet: 1024,
}

export const useDevice = () => {
  const windowWidth = ref(window.innerWidth)

  const widthWatcher = () => windowWidth.value = window.innerWidth
  onMounted(() => window.addEventListener('resize', widthWatcher))
  onUnmounted(() => window.removeEventListener('resize', widthWatcher))

  const isMobile = computed(() => windowWidth.value <= DEVICE_BREAKPOINTS.mobile)

  const isTablet = computed(() => windowWidth.value <= DEVICE_BREAKPOINTS.tablet)

  return {
    isMobile,
    isTablet,
  }
}