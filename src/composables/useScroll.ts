import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

export type ScrollDirection = 'left' | 'right' | 'up' | 'down'
export type ScrollHandler = (direction: ScrollDirection) => void

export const useScroll = (elementRef: Ref<HTMLElement | undefined>) => {
  const handlers = ref<ScrollHandler[]>([])

  const onWheel = (e: WheelEvent) => {
    if (!handlers.value.length) {
      return
    }
    e.preventDefault()

    const scrollDeltaX = e.deltaX
    const scrollDeltaY = e.deltaY

    let direction: ScrollDirection
    if (Math.abs(scrollDeltaY) > Math.abs(scrollDeltaX)) {
      direction = scrollDeltaY > 0 ? 'down' : 'up'
    } else {
      direction = scrollDeltaX > 0 ? 'right' : 'left'
    }

    handlers.value.forEach(handler => handler(direction))
  }

  onMounted(() => {
    const element = elementRef?.value
    if (!element) {
      return
    }
    element.addEventListener('wheel', onWheel)
  })

  onBeforeUnmount(() => {
    const element = elementRef?.value
    if (!element) {
      return
    }
    element.removeEventListener('wheel', onWheel)
  })

  // Exported methods
  const onScroll = (handler: ScrollHandler) => {
    handlers.value.push(handler)
    return () => {
      handlers.value = handlers.value.filter(h => h !== handler)
    }
  }

  return {
    onScroll,
  }
}