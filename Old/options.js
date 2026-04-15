document.addEventListener('DOMContentLoaded', function() {
  // 加载配置
  async function loadConfig() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(['config'], function(result) {
        resolve(result.config || null);
      });
    });
  }

  // 保存配置
  async function saveConfig(config) {
    return new Promise((resolve) => {
      chrome.storage.sync.set({ config: config }, function() {
        resolve();
      });
    });
  }

  // 显示消息
  function showMessage(message, isSuccess = true) {
    const messageEl = document.getElementById('message');
    messageEl.textContent = message;
    messageEl.className = 'message ' + (isSuccess ? 'success' : 'error');
    messageEl.style.display = 'block';
    
    setTimeout(() => {
      messageEl.style.display = 'none';
    }, 3000);
  }

  // 加载配置到表单
  async function loadForm() {
    const config = await loadConfig();
    if (config && config.urls) {
      for (let i = 0; i < 9; i++) {
        const urlInput = document.getElementById(`url${i}`);
        const labelInput = document.getElementById(`label${i}`);
        
        if (config.urls[i]) {
          urlInput.value = config.urls[i].url || '';
          labelInput.value = config.urls[i].label || '';
        } else {
          urlInput.value = '';
          labelInput.value = '';
        }
      }
    }
  }

  // 保存表单
  async function saveForm() {
    const urls = [];
    
    for (let i = 0; i < 9; i++) {
      const urlInput = document.getElementById(`url${i}`);
      const labelInput = document.getElementById(`label${i}`);
      
      urls.push({
        url: urlInput.value.trim(),
        label: labelInput.value.trim()
      });
    }
    
    const config = { urls: urls };
    
    try {
      await saveConfig(config);
      showMessage('配置已保存！');
    } catch (error) {
      showMessage('保存失败: ' + error.message, false);
    }
  }

  // 导入配置
  function importConfig() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = async function(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = async function(e) {
        try {
          const config = JSON.parse(e.target.result);
          
          // 验证配置格式
          if (!config.urls || !Array.isArray(config.urls) || config.urls.length !== 9) {
            throw new Error('配置文件格式不正确');
          }
          
          await saveConfig(config);
          loadForm();
          showMessage('配置导入成功！');
        } catch (error) {
          showMessage('导入失败: ' + error.message, false);
        }
      };
      reader.readAsText(file);
    };
    
    input.click();
  }

  // 导出配置
  async function exportConfig() {
    const config = await loadConfig();
    if (!config) {
      showMessage('没有可导出的配置', false);
      return;
    }
    
    const dataStr = JSON.stringify(config, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = '9key-config.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showMessage('配置已导出！');
  }

  // 重置为默认配置
  async function resetToDefault() {
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
    
    try {
      await saveConfig(defaultConfig);
      loadForm();
      showMessage('已重置为默认配置！');
    } catch (error) {
      showMessage('重置失败: ' + error.message, false);
    }
  }

  // 绑定事件
  document.getElementById('save-btn').addEventListener('click', saveForm);
  document.getElementById('import-btn').addEventListener('click', importConfig);
  document.getElementById('export-btn').addEventListener('click', exportConfig);
  document.getElementById('reset-btn').addEventListener('click', resetToDefault);

  // 初始化表单
  loadForm();
});