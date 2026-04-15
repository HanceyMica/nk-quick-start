<script setup lang="ts">
// 关于页面
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
    <div class="bg-white/90 backdrop-blur rounded-2xl shadow-2xl p-8 max-w-md w-full">
      <h1 class="text-3xl font-bold text-center text-gray-800 mb-6">九宫格网址跳转</h1>

      <div class="space-y-4 text-gray-600">
        <p>这是一个便捷的Chrome扩展，提供九宫格形式的网址快速跳转功能。</p>

        <div class="bg-purple-50 rounded-lg p-4">
          <h2 class="font-semibold text-purple-700 mb-2">功能特点：</h2>
          <ul class="list-disc list-inside space-y-1 text-sm">
            <li>简洁直观的九宫格界面</li>
            <li>支持网格套娃（子网格）功能</li>
            <li>专家模式：快捷键快速跳转</li>
            <li>可自定义九个网址快捷方式</li>
            <li>支持导入导出配置</li>
          </ul>
        </div>

        <div class="bg-blue-50 rounded-lg p-4">
          <h2 class="font-semibold text-blue-700 mb-2">使用方法：</h2>
          <ul class="list-disc list-inside space-y-1 text-sm">
            <li>点击九宫格中的图标访问对应网址</li>
            <li>点击"设置"按钮自定义网址</li>
            <li>按 Alt+9 打开专家模式</li>
            <li>输入编号或名称快速跳转</li>
          </ul>
        </div>
      </div>

      <div class="mt-6 text-center text-gray-500 text-sm">
        <p>版本: 2.0.0</p>
        <p class="mt-2">Copyright Mica 2025</p>
      </div>
    </div>
  </div>
</template>