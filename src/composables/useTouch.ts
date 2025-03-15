import { onBeforeUnmount, onMounted, reactive, ref, type Ref } from 'vue'

export type SwipeDirection = 'left' | 'right' | 'up' | 'down'
export type SwipeHandler = (direction: SwipeDirection) => void

export type HoldDelta = { x: number, y: number }
export type HoldHandler = (delta: HoldDelta) => void

export const useTouch = (elementRef: Ref<HTMLElement | undefined>) => {
  const handlers = reactive({
    swipe: [] as SwipeHandler[],
    hold: [] as HoldHandler[],
  })

  const touchStartX = ref(0)
  const touchStartY = ref(0)

  const onTouchStart = (e: TouchEvent) => {
    if (!e.touches.length) {
      return
    }
    touchStartX.value = e.touches[0].clientX
    touchStartY.value = e.touches[0].clientY
  }

  const onTouchMove = (e: TouchEvent) => {
    e.preventDefault()

    if (!e.touches.length) {
      return
    }
    const touchMoveX = e.changedTouches[0].clientX
    const touchMoveY = e.changedTouches[0].clientY

    const touchMoveDeltaX = touchMoveX - touchStartX.value
    const touchMoveDeltaY = touchMoveY - touchStartY.value

    handlers.hold.forEach(handler => handler({
      x: touchMoveDeltaX,
      y: touchMoveDeltaY,
    }))
  }

  const onTouchEnd = (e: TouchEvent) => {
    if (!e.changedTouches.length || !handlers.swipe.length) {
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

    handlers.swipe.forEach(handler => handler(direction))
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
    handlers.swipe.push(handler)
    return () => {
      handlers.swipe = handlers.swipe.filter(h => h !== handler)
    }
  }

  const onHold = (handler: HoldHandler) => {
    handlers.hold.push(handler)
    return () => {
      handlers.hold = handlers.hold.filter(h => h !== handler)
    }
  }

  return {
    onSwipe,
    onHold,
  }
}