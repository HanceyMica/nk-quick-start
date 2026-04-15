<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Config, GridItem } from '../types';
import GridView from './GridView.vue';

const props = defineProps<{
  config: Config;
}>();

const currentGrid = ref<GridItem[]>(props.config.items);
const currentPath = ref<number[]>([]);
const isSubGrid = ref(false);

const breadcrumbs = computed(() => {
  const paths: string[] = [];
  let current = props.config.items;
  for (const idx of currentPath.value) {
    paths.push(current[idx].label);
    if (current[idx].type === 'grid' && current[idx].grid) {
      current = current[idx].grid;
    }
  }
  return paths;
});

function handleItemClick(item: GridItem, index: number) {
  if (item.type === 'url' && item.url) {
    chrome.tabs.create({ url: item.url });
    window.close();
  } else if (item.type === 'grid' && item.grid) {
    // 进入子网格
    currentPath.value.push(index);
    currentGrid.value = item.grid;
    isSubGrid.value = true;
  }
}

function goBack() {
  if (currentPath.value.length === 0) return;

  currentPath.value.pop();

  if (currentPath.value.length === 0) {
    currentGrid.value = props.config.items;
    isSubGrid.value = false;
  } else {
    // 重新计算当前网格
    let current = props.config.items;
    for (const idx of currentPath.value) {
      if (current[idx].type === 'grid' && current[idx].grid) {
        current = current[idx].grid;
      }
    }
    currentGrid.value = current;
  }
}

function goHome() {
  currentPath.value = [];
  currentGrid.value = props.config.items;
  isSubGrid.value = false;
}

function openSettings() {
  chrome.tabs.create({ url: chrome.runtime.getURL('options.html') });
  window.close();
}

function openAbout() {
  chrome.tabs.create({ url: chrome.runtime.getURL('about.html') });
  window.close();
}
</script>

<template>
  <div class="h-screen w-screen flex flex-col bg-gradient-to-br from-indigo-500 to-purple-600 p-4">
    <!-- 面包屑导航 -->
    <div v-if="isSubGrid" class="flex items-center mb-4">
      <button
        @click="goHome"
        class="text-white hover:text-yellow-300 transition-colors text-sm flex items-center gap-1"
      >
        <span class="i-carbon-home text-lg"></span>
        <span>首页</span>
      </button>
      <template v-for="(crumb, idx) in breadcrumbs" :key="idx">
        <span class="text-white mx-2">/</span>
        <span class="text-white text-sm">{{ crumb }}</span>
      </template>
      <template v-if="currentPath.length > 0">
        <span class="text-white mx-2">/</span>
        <button @click="goBack" class="text-white hover:text-yellow-300 text-sm">
          返回
        </button>
      </template>
    </div>

    <!-- 九宫格 -->
    <div class="flex-1 flex items-center justify-center">
      <GridView
        :items="currentGrid"
        @item-click="handleItemClick"
      />
    </div>

    <!-- 底部按钮 -->
    <div class="flex justify-center gap-4 mt-4">
      <button
        @click="openSettings"
        class="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-200 hover:scale-105"
      >
        <span class="i-carbon-settings text-lg"></span>
        <span>设置</span>
      </button>
      <button
        @click="openAbout"
        class="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-200 hover:scale-105"
      >
        <span class="i-carbon-information text-lg"></span>
        <span>关于</span>
      </button>
    </div>
  </div>
</template>
