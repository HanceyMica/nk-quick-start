<script setup lang="ts">
import { ref, computed } from 'vue';
import type { GridItem } from '../types';

const props = defineProps<{
  item: GridItem;
  index: number;
}>();

const faviconError = ref(false);

const faviconUrl = computed(() => {
  if (props.item.type !== 'url' || !props.item.url) return '';
  try {
    const urlObj = new URL(props.item.url);
    return urlObj.origin + '/favicon.ico';
  } catch {
    return '';
  }
});

const isGridType = computed(() => props.item.type === 'grid');

function handleError() {
  faviconError.value = true;
}
</script>

<template>
  <div
    class="flex flex-col items-center justify-center h-20 bg-white/90 hover:bg-white rounded-xl shadow-md hover:shadow-xl cursor-pointer transition-all duration-200 hover:-translate-y-1"
    :class="{ 'ring-2 ring-purple-400': isGridType }"
  >
    <!-- 套娃图标 -->
    <div v-if="isGridType" class="i-carbon-data-blob text-3xl text-purple-500 mb-1"></div>

    <!-- Favicon -->
    <img
      v-else-if="faviconUrl && !faviconError"
      :src="faviconUrl"
      class="w-6 h-6 object-contain mb-1"
      @error="handleError"
    />

    <!-- 默认数字图标 -->
    <div
      v-else
      class="w-6 h-6 flex items-center justify-center text-lg font-bold text-gray-600 mb-1"
    >
      {{ index + 1 }}
    </div>

    <!-- 标签 -->
    <span class="text-xs text-gray-700 text-center max-w-full truncate px-1">
      {{ item.label || `网站${index + 1}` }}
    </span>
  </div>
</template>