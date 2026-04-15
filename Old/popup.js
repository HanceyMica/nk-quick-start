document.addEventListener('DOMContentLoaded', function() {
  // 默认配置
  const defaultConfig = {
    urls: [
      { label: '百度', url: 'https://www.baidu.com' },
      { label: '谷歌', url: 'https://www.google.com' },
      { label: 'GitHub', url: 'https://www.github.com' },
      { label: '知乎', url: 'https://www.zhihu.com' },
      { label: 'B站', url: 'https://www.bilibili.com' },
      { label: '微博', url: 'https://www.weibo.com' },
      { label: '淘宝', url: 'https://www.taobao.com' },
      { label: '京东', url: 'https://www.jd.com' },
      { label: '网易', url: 'https://www.163.com' }
    ]
  };

  // 加载配置
  async function loadConfig() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(['config'], function(result) {
        if (result.config) {
          resolve(result.config);
        } else {
          // 如果没有配置，使用默认配置
          chrome.storage.sync.set({ config: defaultConfig });
          resolve(defaultConfig);
        }
      });
    });
  }

  // 获取网站favicon
  function getFaviconUrl(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.origin + '/favicon.ico';
    } catch (e) {
      return '';
    }
  }

  // 初始化九宫格
  async function initGrid() {
    const config = await loadConfig();
    const gridItems = document.querySelectorAll('.grid-item');
    
    gridItems.forEach((item, index) => {
      if (config.urls[index]) {
        const label = item.querySelector('.grid-label');
        label.textContent = config.urls[index].label;
        
        // 设置网址跳转链接
        item.setAttribute('data-url', config.urls[index].url);
        
        // 尝试加载favicon
        if (config.urls[index].url) {
          const faviconUrl = getFaviconUrl(config.urls[index].url);
          const faviconImg = item.querySelector('.favicon');
          if (faviconUrl) {
            faviconImg.src = faviconUrl;
            // 当favicon加载失败时，显示默认数字图标
            faviconImg.onerror = function() {
              this.style.display = 'none';
              this.nextElementSibling.style.display = 'flex';
            };
            // 当favicon加载成功时，隐藏默认数字图标
            faviconImg.onload = function() {
              this.style.display = 'block';
              this.nextElementSibling.style.display = 'none';
            };
          }
        }
      }
    });
  }

  // 点击九宫格跳转
  function setupGridClicks() {
    const gridItems = document.querySelectorAll('.grid-item');
    
    gridItems.forEach((item, index) => {
      item.addEventListener('click', async function() {
        const url = item.getAttribute('data-url');
        if (url) {
          // 在新标签页中打开网址
          chrome.tabs.create({ url: url });
          // 关闭扩展弹窗
          window.close();
        }
      });
    });
  }

  // 设置按钮点击事件
  document.getElementById('settings-btn').addEventListener('click', function() {
    chrome.tabs.create({ url: chrome.runtime.getURL('options.html') });
    window.close();
  });

  // 关于按钮点击事件
  document.getElementById('about-btn').addEventListener('click', function() {
    chrome.tabs.create({ url: chrome.runtime.getURL('about.html') });
    window.close();
  });

  // 初始化
  initGrid();
  setupGridClicks();
});