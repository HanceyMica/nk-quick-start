<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Config } from './types';
import { createDefaultConfig } from './types';
import SettingsForm from './components/SettingsForm.vue';
import { ensureConfig, saveConfig } from './utils/config';

const config = ref<Config>(createDefaultConfig());
const loading = ref(true);
const showToast = ref(false);
const toastMessage = ref('');

async function loadConfig() {
  try {
    config.value = await ensureConfig();
  } catch (e) {
    console.error('加载配置失败:', e);
  } finally {
    loading.value = false;
  }
}

async function handleSave(newConfig: Config) {
  try {
    await saveConfig(newConfig);
    config.value = newConfig;
    showToastMessage('保存成功');
  } catch (e) {
    console.error('保存失败:', e);
    showToastMessage('保存失败', false);
  }
}

function showToastMessage(message: string, _success = true) {
  toastMessage.value = message;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 3000);
}

onMounted(() => {
  loadConfig();
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 py-8 px-4">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-3xl font-bold text-white text-center mb-8">九宫格网址配置</h1>

      <SettingsForm
        v-if="!loading"
        :config="config"
        @save="handleSave"
      />

      <!-- Toast提示 -->
      <div
        v-if="showToast"
        class="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white px-6 py-3 rounded-lg shadow-lg z-50 fade-in"
        :class="toastMessage.includes('失败') ? 'text-red-500' : 'text-green-500'"
      >
        {{ toastMessage }}
      </div>
    </div>
  </div>
</template>
