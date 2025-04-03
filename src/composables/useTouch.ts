import { onBeforeUnmount, onMounted, reactive, ref, type Ref } from 'vue'

export type TouchRef = Ref<HTMLElement | undefined>
export type TouchOptions = {
  swipe?: SwipeOptions,
  move?: MoveOptions,
}

export type SwipeDirection = 'left' | 'right' | 'up' | 'down'
export type SwipeHandler = (direction: SwipeDirection) => void
export type SwipeOptions = {
  threshold?: number,
}

export type MoveDelta = { x: number, y: number }
export type MoveHandler = (delta: MoveDelta) => void
export type MoveOptions = {
  preventDefault?: { x?: boolean, y?: boolean },
  limit?: number,
  threshold?: number,
}

export type DropHandler = () => void

const DEFAULT_SWIPE_OPTIONS: SwipeOptions = {
  threshold: 50,
}

const DEFAULT_MOVE_OPTIONS: MoveOptions = {
  preventDefault: {
    x: true,
    y: true,
  },
  threshold: 15,
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
    move: {
      ...DEFAULT_MOVE_OPTIONS,
      ...(opts.move || {}),
    },
  } as TouchOptions

  const handlers = reactive({
    swipe: [] as SwipeHandler[],
    move: [] as MoveHandler[],
    drop: [] as DropHandler[],
  })

  const touchStartX = ref(0)
  const touchStartY = ref(0)

  const touchAxis = ref<'x' | 'y' | null>(null)

  const onTouchStart = (e: TouchEvent) => {
    if (!e.touches.length) {
      return
    }
    touchAxis.value = null
    touchStartX.value = e.touches[0].clientX
    touchStartY.value = e.touches[0].clientY
  }

  const onTouchMove = (e: TouchEvent) => {
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
      !touchAxis.value
      && (touchMoveDeltaXAbs > (options.move?.threshold ?? 0) || touchMoveDeltaYAbs > (options.move?.threshold ?? 0))
    ) {
      touchAxis.value = touchMoveDeltaXAbs > touchMoveDeltaYAbs
        ? 'x' : 'y'
    }

    if (touchAxis.value && options.move?.preventDefault?.[touchAxis.value]) {
      e.preventDefault()
    }

    if (
      options.move?.limit
      && (touchAxis.value === 'x' && touchMoveDeltaXAbs > options.move.limit
      || touchAxis.value === 'y' && touchMoveDeltaYAbs > options.move.limit)
    ) {
      return
    }

    handlers.move.forEach(handler => handler({
      x: touchAxis.value === 'y' ? 0 : touchMoveDeltaX,
      y: touchAxis.value === 'x' ? 0 :touchMoveDeltaY,
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
    if (touchEndDeltaYAbs > touchEndDeltaXAbs && touchAxis.value === 'y') {
      if (touchEndDeltaYAbs <= (options.swipe?.threshold ?? 0)) {
        handlers.drop.forEach(handler => handler())
        return
      }
      direction = touchEndDeltaY > 0 ? 'down' : 'up'
    } else {
      if (touchEndDeltaXAbs <= (options.swipe?.threshold ?? 0)) {
        handlers.drop.forEach(handler => handler())
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

  const onMove = (handler: MoveHandler) => {
    handlers.move.push(handler)
    return () => {
      handlers.move = handlers.move.filter(h => h !== handler)
    }
  }

  const onDrop = (handler: DropHandler) => {
    handlers.drop.push(handler)
    return () => {
      handlers.drop = handlers.drop.filter(h => h !== handler)
    }
  }

  return {
    onSwipe,
    onMove,
    onDrop,
  }
}