import { defineConfig, Plugin } from 'vite';
import vue from '@vitejs/plugin-vue';
import unocss from 'unocss/vite';
import { crx } from '@crxjs/vite-plugin';
import manifest from './public/manifest.json';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

// 自定义插件：构建后清理和重命名文件
function cleanupPlugin(): Plugin {
  return {
    name: 'cleanup-plugin',
    apply: 'build',
    closeBundle() {
      const distDir = resolve(__dirname, 'dist');
      const assetsDir = resolve(distDir, 'assets');

      // 移动 src 目录下的文件到 dist 根目录
      const srcDir = resolve(distDir, 'src');
      if (fs.existsSync(srcDir)) {
        const files = fs.readdirSync(srcDir);
        for (const file of files) {
          const srcPath = resolve(srcDir, file);
          const destPath = resolve(distDir, file);
          fs.renameSync(srcPath, destPath);
        }
        fs.rmSync(srcDir, { recursive: true, force: true });
      }

      // 重命名多余的js文件
      if (fs.existsSync(assetsDir)) {
        // main2.js -> popup.js
        const main2Path = resolve(assetsDir, 'main2.js');
        if (fs.existsSync(main2Path)) {
          fs.renameSync(main2Path, resolve(assetsDir, 'popup.js'));
        }

        // options2.js -> options.js
        const options2Path = resolve(assetsDir, 'options2.js');
        if (fs.existsSync(options2Path)) {
          const optionsJsPath = resolve(assetsDir, 'options.js');
          if (fs.existsSync(optionsJsPath)) {
            fs.unlinkSync(options2Path);
          } else {
            fs.renameSync(options2Path, optionsJsPath);
          }
        }

        // 删除 index.html.js 和 options.html.js
        const filesToRemove = ['index.html.js', 'options.html.js'];
        for (const file of filesToRemove) {
          const filePath = resolve(assetsDir, file);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
      }
    }
  };
}

export default defineConfig({
  plugins: [
    vue(),
    unocss(),
    crx({
      manifest,
      browser: 'chrome'
    }),
    cleanupPlugin()
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: 'index.html',
        options: 'options.html',
        expert: 'src/expert.html',
        about: 'src/about.html'
      },
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  }
});
