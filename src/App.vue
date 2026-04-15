<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Config } from './types';
import { createDefaultConfig } from './types';
import PopupView from './components/PopupView.vue';
import { ensureConfig } from './utils/config';

const config = ref<Config>(createDefaultConfig());
const loading = ref(true);

async function loadConfig() {
  try {
    config.value = await ensureConfig();
  } catch (e) {
    console.error('加载配置失败:', e);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadConfig();
});
</script>

<template>
  <div class="h-screen w-screen overflow-hidden">
    <PopupView v-if="!loading" :config="config" />
    <div v-else class="flex items-center justify-center h-screen">
      <div class="i-carbon-circle-dash text-4xl text-white animate-spin"></div>
    </div>
  </div>
</template>
