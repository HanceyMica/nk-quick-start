<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { Config } from '../types';
import { createDefaultConfig, createEmptyGrid } from '../types';

const props = defineProps<{
  config: Config;
}>();

const emit = defineEmits<{
  (e: 'save', config: Config): void;
}>();

const localConfig = ref<Config>(JSON.parse(JSON.stringify(props.config)));

watch(() => props.config, (newConfig) => {
  localConfig.value = JSON.parse(JSON.stringify(newConfig));
}, { deep: true });

const gridItemsWithIndex = computed(() =>
  localConfig.value.items
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => item.type === 'grid')
);

function updateItem(index: number, field: 'label' | 'url', value: string) {
  (localConfig.value.items[index] as any)[field] = value;
}

function toggleType(index: number) {
  const item = localConfig.value.items[index];
  if (item.type === 'url') {
    // 转换为套娃格子
    item.type = 'grid';
    item.grid = createEmptyGrid();
    item.url = '';
  } else {
    // 转换为网址
    item.type = 'url';
    item.grid = undefined;
    item.url = '';
    item.label = `网站${index + 1}`;
  }
}

function updateSubItem(parentIndex: number, subIndex: number, field: 'label' | 'url', value: string) {
  const item = localConfig.value.items[parentIndex];
  if (item.type === 'grid' && item.grid) {
    (item.grid[subIndex] as any)[field] = value;
  }
}

function save() {
  emit('save', localConfig.value);
}

function reset() {
  const defaultConfig = createDefaultConfig();
  localConfig.value = defaultConfig;
  emit('save', defaultConfig);
}

function exportConfig() {
  const data = JSON.stringify(localConfig.value, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = '9key-config.json';
  a.click();
  URL.revokeObjectURL(url);
}

function importConfig() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const text = await file.text();
    try {
      const config = JSON.parse(text) as Config;
      localConfig.value = config;
      emit('save', config);
    } catch {
      alert('导入失败，文件格式不正确');
    }
  };
  input.click();
}
</script>

<template>
  <div class="space-y-6">
    <!-- 主网格配置 -->
    <div class="bg-white rounded-xl shadow-lg p-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">主网格配置</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="(item, index) in localConfig.items"
          :key="item.id"
          class="border border-gray-200 rounded-lg p-4 hover:border-purple-400 transition-colors"
        >
          <div class="flex items-center justify-between mb-3">
            <span class="font-medium text-gray-700">格子 {{ index + 1 }}</span>
            <button
              @click="toggleType(index)"
              class="text-sm px-2 py-1 rounded transition-colors"
              :class="item.type === 'grid' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'"
            >
              {{ item.type === 'grid' ? '套娃格子' : '网址' }}
            </button>
          </div>

          <!-- 网址类型 -->
          <div v-if="item.type === 'url'" class="space-y-2">
            <input
              type="text"
              :value="item.label"
              @input="updateItem(index, 'label', ($event.target as HTMLInputElement).value)"
              placeholder="网站名称"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            />
            <input
              type="url"
              :value="item.url"
              @input="updateItem(index, 'url', ($event.target as HTMLInputElement).value)"
              placeholder="https://example.com"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            />
          </div>

          <!-- 套娃格子类型 -->
          <div v-else-if="item.type === 'grid'" class="space-y-2">
            <input
              type="text"
              :value="item.label"
              @input="updateItem(index, 'label', ($event.target as HTMLInputElement).value)"
              placeholder="子网格名称"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            />
            <div class="text-xs text-gray-500">子网格包含9个格子，不可再嵌套</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 套娃格子子网格配置 -->
    <div
      v-for="({ item, index: parentIndex }) in gridItemsWithIndex"
      :key="item.id"
      class="bg-white rounded-xl shadow-lg p-6"
    >
      <h3 class="text-lg font-semibold text-purple-600 mb-4">子网格: {{ item.label || `格子${parentIndex + 1}` }}</h3>
      <div class="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-2">
        <div
          v-for="(subItem, subIndex) in item.grid"
          :key="subItem.id"
          class="border border-gray-200 rounded p-2"
        >
          <input
            type="text"
            :value="subItem.label"
            @input="updateSubItem(parentIndex, subIndex, 'label', ($event.target as HTMLInputElement).value)"
            placeholder="名称"
            class="w-full text-xs px-2 py-1 border border-gray-300 rounded mb-1"
          />
          <input
            type="url"
            :value="subItem.url"
            @input="updateSubItem(parentIndex, subIndex, 'url', ($event.target as HTMLInputElement).value)"
            placeholder="网址"
            class="w-full text-xs px-2 py-1 border border-gray-300 rounded"
          />
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="flex flex-wrap gap-4 justify-center">
      <button
        @click="save"
        class="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 hover:scale-105 shadow-md"
      >
        保存配置
      </button>
      <button
        @click="reset"
        class="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-medium rounded-lg hover:from-red-600 hover:to-orange-600 transition-all duration-200 hover:scale-105 shadow-md"
      >
        重置默认
      </button>
      <button
        @click="exportConfig"
        class="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 hover:scale-105 shadow-md"
      >
        导出配置
      </button>
      <button
        @click="importConfig"
        class="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 hover:scale-105 shadow-md"
      >
        导入配置
      </button>
    </div>
  </div>
</template>
