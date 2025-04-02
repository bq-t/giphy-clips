import { onBeforeUnmount, onMounted, reactive, ref, type Ref } from 'vue'

export type TouchRef = Ref<HTMLElement | undefined>
export type TouchOptions = {
  swipe?: SwipeOptions,
  hold?: HoldOptions,
}

export type SwipeDirection = 'left' | 'right' | 'up' | 'down'
export type SwipeHandler = (direction: SwipeDirection) => void
export type SwipeOptions = {
  threshold?: number,
}

export type HoldDelta = { x: number, y: number }
export type HoldHandler = (delta: HoldDelta) => void
export type HoldOptions = {
  preventDefault?: boolean,
  limit?: number,
  threshold?: number,
}

const DEFAULT_SWIPE_OPTIONS: SwipeOptions = {
  threshold: 10,
}

const DEFAULT_HOLD_OPTIONS: HoldOptions = {
  preventDefault: true,
  threshold: 10,
}

export const useTouch = (
  elementRef: TouchRef,
  opts: TouchOptions = {},
) => {
  const options: TouchOptions = {
    swipe: {
      ...DEFAULT_SWIPE_OPTIONS,
      ...(opts.swipe || {})
    },
    hold: {
      ...DEFAULT_HOLD_OPTIONS,
      ...(opts.hold || {}),
    },
  } as TouchOptions

  const handlers = reactive({
    swipe: [] as SwipeHandler[],
    hold: [] as HoldHandler[],
  })

  const touchStartX = ref(0)
  const touchStartY = ref(0)

  const touchDirection = ref<'horizontal' | 'vertical' | null>(null)

  const onTouchStart = (e: TouchEvent) => {
    if (!e.touches.length) {
      return
    }
    touchDirection.value = null
    touchStartX.value = e.touches[0].clientX
    touchStartY.value = e.touches[0].clientY
  }

  const onTouchMove = (e: TouchEvent) => {
    if (options.hold?.preventDefault) {
      e.preventDefault()
    }

    if (!e.touches.length) {
      return
    }

    const touchMoveX = e.changedTouches[0].clientX
    const touchMoveY = e.changedTouches[0].clientY

    const touchMoveDeltaX = touchMoveX - touchStartX.value
    const touchMoveDeltaY = touchMoveY - touchStartY.value

    const touchMoveDeltaXAbs = Math.abs(touchMoveDeltaX)
    const touchMoveDeltaYAbs = Math.abs(touchMoveDeltaY)

    if (
      !touchDirection.value
      && (touchMoveDeltaXAbs > (options.hold?.threshold ?? 0) || touchMoveDeltaYAbs > (options.hold?.threshold ?? 0))
    ) {
      touchDirection.value = touchMoveDeltaXAbs > touchMoveDeltaYAbs
        ? 'horizontal'
        : 'vertical'
    }

    if (
      options.hold?.limit
      && (touchDirection.value === 'horizontal' && touchMoveDeltaXAbs > options.hold.limit
      || touchDirection.value === 'vertical' && touchMoveDeltaYAbs > options.hold.limit)
    ) {
      return
    }

    handlers.hold.forEach(handler => handler({
      x: touchDirection.value === 'vertical' ? 0 : touchMoveDeltaX,
      y: touchDirection.value === 'horizontal' ? 0 :touchMoveDeltaY,
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
    if (touchEndDeltaYAbs > touchEndDeltaXAbs && touchDirection.value === 'vertical') {
      if (touchEndDeltaYAbs <= (options.swipe?.threshold ?? 0)) {
        return
      }
      direction = touchEndDeltaY > 0 ? 'down' : 'up'
    } else {
      if (touchEndDeltaXAbs <= (options.swipe?.threshold ?? 0)) {
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