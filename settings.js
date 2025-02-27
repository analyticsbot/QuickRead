// settings.js - Handles the settings page functionality

document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('settingsForm');
  const modelTypeSelect = document.getElementById('modelType');
  const localSettings = document.getElementById('localSettings');
  const lmStudioSettings = document.getElementById('lmStudioSettings');
  const apiSettings = document.getElementById('apiSettings');
  const temperatureSlider = document.getElementById('temperature');
  const temperatureValue = document.getElementById('temperatureValue');
  const saveButton = document.getElementById('saveSettings');
  const resetButton = document.getElementById('resetSettings');
  const statusDiv = document.getElementById('status');
  
  // Load current settings
  await loadSettings();
  
  // Update visible settings based on model type
  updateVisibleSettings();
  
  // Event listeners
  modelTypeSelect.addEventListener('change', updateVisibleSettings);
  
  temperatureSlider.addEventListener('input', () => {
    temperatureValue.textContent = temperatureSlider.value;
  });
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await saveSettings();
  });
  
  resetButton.addEventListener('click', async () => {
    if (confirm('Are you sure you want to reset all settings to default values?')) {
      await resetSettings();
    }
  });
  
  // Function to update which settings are visible based on model type
  function updateVisibleSettings() {
    const modelType = modelTypeSelect.value;
    
    // Show/hide appropriate settings sections
    localSettings.style.display = modelType === 'local' ? 'block' : 'none';
    lmStudioSettings.style.display = modelType === 'lmstudio' ? 'block' : 'none';
    apiSettings.style.display = ['openai', 'grok', 'claude'].includes(modelType) ? 'block' : 'none';
  }
  
  // Function to load settings from storage
  async function loadSettings() {
    try {
      // Get config from chrome.storage
      chrome.storage.local.get('quickReadConfig', (result) => {
        const config = result.quickReadConfig || {
          modelType: 'local',
          localModelName: 'llama3',
          lmStudioEndpoint: 'http://localhost:1234/v1',
          apiKeys: {
            openai: '',
            grok: '',
            claude: ''
          },
          temperature: 0.7,
          maxTokens: 500
        };
        
        // Populate form with values
        modelTypeSelect.value = config.modelType;
        document.getElementById('localModelName').value = config.localModelName || 'llama3';
        document.getElementById('lmStudioEndpoint').value = config.lmStudioEndpoint || 'http://localhost:1234/v1';
        document.getElementById('openaiKey').value = config.apiKeys?.openai || '';
        document.getElementById('grokKey').value = config.apiKeys?.grok || '';
        document.getElementById('claudeKey').value = config.apiKeys?.claude || '';
        document.getElementById('temperature').value = config.temperature || 0.7;
        document.getElementById('temperatureValue').textContent = config.temperature || 0.7;
        document.getElementById('maxTokens').value = config.maxTokens || 500;
        
        // Update visible sections
        updateVisibleSettings();
      });
    } catch (error) {
      console.error('Error loading settings:', error);
      updateStatus('Error loading settings', true);
    }
  }
  
  // Function to save settings to storage
  async function saveSettings() {
    try {
      const config = {
        modelType: modelTypeSelect.value,
        localModelName: document.getElementById('localModelName').value,
        lmStudioEndpoint: document.getElementById('lmStudioEndpoint').value,
        apiKeys: {
          openai: document.getElementById('openaiKey').value,
          grok: document.getElementById('grokKey').value,
          claude: document.getElementById('claudeKey').value
        },
        temperature: parseFloat(document.getElementById('temperature').value),
        maxTokens: parseInt(document.getElementById('maxTokens').value)
      };
      
      // Save to chrome.storage
      chrome.storage.local.set({ quickReadConfig: config }, () => {
        updateStatus('Settings saved successfully!');
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      updateStatus('Error saving settings', true);
    }
  }
  
  // Function to reset settings to defaults
  async function resetSettings() {
    try {
      const defaultConfig = {
        modelType: 'local',
        localModelName: 'llama3',
        lmStudioEndpoint: 'http://localhost:1234/v1',
        apiKeys: {
          openai: '',
          grok: '',
          claude: ''
        },
        temperature: 0.7,
        maxTokens: 500
      };
      
      // Save defaults to chrome.storage
      chrome.storage.local.set({ quickReadConfig: defaultConfig }, () => {
        // Reload form with default values
        loadSettings();
        updateStatus('Settings reset to defaults');
      });
    } catch (error) {
      console.error('Error resetting settings:', error);
      updateStatus('Error resetting settings', true);
    }
  }
  
  // Function to update status message
  function updateStatus(message, isError = false) {
    statusDiv.textContent = message;
    statusDiv.className = isError ? 'status error' : 'status success';
    
    // Clear status after 3 seconds
    setTimeout(() => {
      statusDiv.textContent = '';
      statusDiv.className = 'status';
    }, 3000);
  }
});
