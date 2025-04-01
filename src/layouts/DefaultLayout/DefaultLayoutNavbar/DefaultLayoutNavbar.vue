<template>
  <gc-list
    :items="navbarItems"
    :type="type"
  />
</template>

<script lang="ts">
import type { ListType, ListItemProps } from '@bq-t/giphy-clips-ui'

interface NavbarProps {
  type?: ListType,
}
</script>

<script lang="ts" setup>
const props = withDefaults(defineProps<NavbarProps>(), {
  type: 'column',
})

const navbarItems = <ListItemProps[]>[
  {
    title: 'Recommendations',
    icon: 'local-fire-department-outline',
    to: { name: 'index' },
  },
  {
    title: 'Browser',
    icon: 'explore-outline',
    to: { name: 'browser' },
  },
  {
    title: 'Favorites',
    icon: 'favorite-outline',
    to: { name: 'favorites' },
  },
]
</script>