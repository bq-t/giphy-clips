<template>
  <component :is="computedLogotype" />
</template>

<script lang="ts">
interface Props {
  collapsed?: boolean,
}
</script>

<script lang="ts" setup>
import { computed, defineAsyncComponent } from 'vue'

const props = withDefaults(defineProps<Props>(), {
  collapsed: false,
})

const Logotype = defineAsyncComponent(() => import('@/assets/img/Logotype.svg'))
const LogotypeCollapsed = defineAsyncComponent(() => import('@/assets/img/LogotypeCollapsed.svg'))

const computedLogotype = computed(() => props.collapsed ? LogotypeCollapsed : Logotype)
</script>