// background.js

// Log when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  console.log('QuickRead extension installed');
  
  // Initialize default settings if not already set
  chrome.storage.local.get('quickReadConfig', (result) => {
    if (!result.quickReadConfig) {
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
      
      chrome.storage.local.set({ quickReadConfig: defaultConfig }, () => {
        console.log('Default settings initialized');
      });
    }
  });
});

// Handle messages from popup to content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background script received message:', request);
  
  // Handle relay messages
  if (request.action === 'relay_to_content') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) {
        console.error('No active tab found');
        sendResponse({ error: 'No active tab found' });
        return;
      }
      
      const tabId = tabs[0].id;
      
      // Send the message to the content script
      chrome.tabs.sendMessage(
        tabId, 
        { ...request.data }, 
        (response) => {
          if (chrome.runtime.lastError) {
            console.error('Error sending message to content script:', chrome.runtime.lastError);
            sendResponse({ error: chrome.runtime.lastError.message });
          } else {
            sendResponse(response);
          }
        }
      );
    });
    
    // Return true to indicate async response
    return true;
  }
  
  // Handle model check request
  if (request.action === 'check_model_availability') {
    chrome.storage.local.get('quickReadConfig', (result) => {
      const config = result.quickReadConfig || { modelType: 'local' };
      
      // Check if the selected model is available
      if (config.modelType === 'local') {
        // Check if Ollama is running
        fetch('http://localhost:11434/api/tags')
          .then(response => {
            if (response.ok) {
              sendResponse({ available: true, modelType: 'local' });
            } else {
              sendResponse({ available: false, modelType: 'local', error: 'Ollama not running' });
            }
          })
          .catch(error => {
            sendResponse({ available: false, modelType: 'local', error: 'Ollama not running' });
          });
      } else if (config.modelType === 'lmstudio') {
        // Check if LM Studio is running
        fetch(config.lmStudioEndpoint || 'http://localhost:1234/v1/models')
          .then(response => {
            if (response.ok) {
              sendResponse({ available: true, modelType: 'lmstudio' });
            } else {
              sendResponse({ available: false, modelType: 'lmstudio', error: 'LM Studio not running' });
            }
          })
          .catch(error => {
            sendResponse({ available: false, modelType: 'lmstudio', error: 'LM Studio not running' });
          });
      } else {
        // For cloud models, just check if API key exists
        const apiKey = config.apiKeys?.[config.modelType] || '';
        sendResponse({ 
          available: apiKey.length > 0, 
          modelType: config.modelType,
          error: apiKey.length > 0 ? null : 'API key not set'
        });
      }
    });
    
    // Return true to indicate async response
    return true;
  }
});
