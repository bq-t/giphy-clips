import { onUnmounted, ref, unref, type Ref } from 'vue'

export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number | Ref<number>,
) => {
  let isThrottled = false
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  const clear = () => {
    if (!timeoutId) {
      return
    }
    clearTimeout(timeoutId)
    timeoutId = null
    isThrottled = false
  }

  const throttle = (...args: Parameters<T>) => {
    if (isThrottled) {
      return
    }
    callback(...args)
    isThrottled = true

    timeoutId = setTimeout(() => {
      isThrottled = false
    }, unref(delay))
  }

  onUnmounted(clear)

  return throttle
}