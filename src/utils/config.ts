import type { Config } from '../types';
import { createDefaultConfig } from '../types';

interface StorageResult {
  config?: Config;
}

export async function ensureConfig(): Promise<Config> {
  const result = await chrome.storage.sync.get(['config']) as StorageResult;
  if (result.config) {
    return result.config;
  }

  // 首次安装时补一份默认配置，保证所有入口行为一致。
  const defaultConfig = createDefaultConfig();
  await chrome.storage.sync.set({ config: defaultConfig });
  return defaultConfig;
}

export async function saveConfig(config: Config): Promise<void> {
  await chrome.storage.sync.set({ config });
}
