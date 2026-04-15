function openExpertModePage() {
  chrome.tabs.create({ url: chrome.runtime.getURL('expert.html') });
}

// 后台脚本处理快捷键，直接打开专家模式页面。
chrome.commands.onCommand.addListener((command: string) => {
  if (command === 'toggle-expert-mode') {
    openExpertModePage();
  }
});

// 兼容其他页面主动请求打开专家模式。
chrome.runtime.onMessage.addListener((message: { action: string }) => {
  if (message.action === 'openExpertMode') {
    openExpertModePage();
  }
});
