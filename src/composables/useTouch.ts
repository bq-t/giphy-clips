import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

export type SwipeDirection = 'left' | 'right' | 'up' | 'down'
export type SwipeHandler = (direction: SwipeDirection) => void

export const useTouch = (elementRef: Ref<HTMLElement | undefined>) => {
  const touchStartX = ref(0)
  const touchStartY = ref(0)
  const handlers = ref<SwipeHandler[]>([])

  const onTouchStart = (e: TouchEvent) => {
    if (!e.touches.length) {
      return
    }
    touchStartX.value = e.touches[0].clientX
    touchStartY.value = e.touches[0].clientY
  }

  const onTouchMove = (e: TouchEvent) => {
    e.preventDefault()
  }

  const onTouchEnd = (e: TouchEvent) => {
    if (!e.changedTouches.length || !handlers.value.length) {
      return
    }
    const touchEndX = e.changedTouches[0].clientX
    const touchEndY = e.changedTouches[0].clientY

    const touchEndDeltaX = touchEndX - touchStartX.value
    const touchEndDeltaY = touchEndY - touchStartY.value

    const touchEndDeltaXAbs = Math.abs(touchEndDeltaX)
    const touchEndDeltaYAbs = Math.abs(touchEndDeltaY)

    let direction: SwipeDirection
    if (touchEndDeltaYAbs > touchEndDeltaXAbs) {
      if (touchEndDeltaYAbs <= 30) {
        return
      }
      direction = touchEndDeltaY > 0 ? 'down' : 'up'
    } else {
      if (touchEndDeltaXAbs <= 30) {
        return
      }
      direction = touchEndDeltaX > 0 ? 'right' : 'left'
    }

    handlers.value.forEach(handler => handler(direction))
  }

  onMounted(() => {
    const element = elementRef?.value
    if (!element) {
      return
    }
    element.addEventListener('touchstart', onTouchStart, { passive: true })
    element.addEventListener('touchmove', onTouchMove)
    element.addEventListener('touchend', onTouchEnd, { passive: true })
  })

  onBeforeUnmount(() => {
    const element = elementRef?.value
    if (!element) {
      return
    }
    element.removeEventListener('touchstart', onTouchStart)
    element.removeEventListener('touchmove', onTouchMove)
    element.removeEventListener('touchend', onTouchEnd)
  })

  // Exported methods
  const onSwipe = (handler: SwipeHandler) => {
    handlers.value.push(handler)
    return () => {
      handlers.value = handlers.value.filter(h => h !== handler)
    }
  }

  return {
    onSwipe,
  }
}