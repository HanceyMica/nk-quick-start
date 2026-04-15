<script setup lang="ts">
import { computed } from 'vue';
import type { GridItem } from '../types';
import GridItemComponent from './GridItem.vue';

const props = defineProps<{
  items: GridItem[];
}>();

const emit = defineEmits<{
  (e: 'item-click', item: GridItem, index: number): void;
}>();

const displayItems = computed(() => {
  // 确保总是显示9个格子
  const result = [...props.items];
  while (result.length < 9) {
    result.push({
      id: '',
      label: '',
      type: 'url',
      url: ''
    });
  }
  return result.slice(0, 9);
});

function handleClick(item: GridItem, index: number) {
  emit('item-click', item, index);
}
</script>

<template>
  <div class="grid grid-cols-3 gap-3 w-full max-w-xs mx-auto">
    <GridItemComponent
      v-for="(item, index) in displayItems"
      :key="item.id || index"
      :item="item"
      :index="index"
      @click="handleClick(item, index)"
    />
  </div>
</template>
