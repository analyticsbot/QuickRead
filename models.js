// models.js - Handles different AI model integrations for QuickRead

// Default configuration
const DEFAULT_CONFIG = {
  modelType: 'local', // 'local', 'lmstudio', 'openai', 'grok', 'claude'
  localModelName: 'llama3', // Default Ollama model
  lmStudioEndpoint: 'http://localhost:1234/v1', // Default LM Studio endpoint
  apiKeys: {
    openai: '',
    grok: '',
    claude: ''
  },
  temperature: 0.7,
  maxTokens: 500
};

// Get stored configuration or use defaults
async function getConfig() {
  return new Promise((resolve) => {
    chrome.storage.local.get('quickReadConfig', (result) => {
      if (result.quickReadConfig) {
        resolve(result.quickReadConfig);
      } else {
        // If no config exists, save and use the default
        chrome.storage.local.set({ quickReadConfig: DEFAULT_CONFIG });
        resolve(DEFAULT_CONFIG);
      }
    });
  });
}

// Save configuration
async function saveConfig(config) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ quickReadConfig: config }, () => {
      resolve(true);
    });
  });
}

// Reset configuration to defaults
async function resetConfig() {
  return saveConfig(DEFAULT_CONFIG);
}

// Generate summary using Ollama (local model)
async function summarizeWithOllama(text, options) {
  try {
    const config = await getConfig();
    const modelName = config.localModelName || 'llama3';
    
    console.log(`Summarizing with Ollama model: ${modelName}`);
    
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: modelName,
        prompt: `Please summarize the following text in a concise ${options.brevity} format:\n\n${text}`,
        stream: false,
        options: {
          temperature: config.temperature,
          num_predict: config.maxTokens
        }
      })
    });
    
    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error with Ollama:', error);
    throw new Error(`Failed to generate summary with Ollama: ${error.message}`);
  }
}

// Generate summary using LM Studio
async function summarizeWithLMStudio(text, options) {
  try {
    const config = await getConfig();
    const endpoint = config.lmStudioEndpoint || 'http://localhost:1234/v1';
    
    console.log(`Summarizing with LM Studio at: ${endpoint}`);
    
    const response = await fetch(`${endpoint}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: `You are a helpful assistant that summarizes text in a ${options.brevity} format.`
          },
          {
            role: 'user',
            content: `Please summarize the following text:\n\n${text}`
          }
        ],
        temperature: config.temperature,
        max_tokens: config.maxTokens
      })
    });
    
    if (!response.ok) {
      throw new Error(`LM Studio API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error with LM Studio:', error);
    throw new Error(`Failed to generate summary with LM Studio: ${error.message}`);
  }
}

// Generate summary using OpenAI
async function summarizeWithOpenAI(text, options) {
  try {
    const config = await getConfig();
    const apiKey = config.apiKeys.openai;
    
    if (!apiKey) {
      throw new Error('OpenAI API key not found');
    }
    
    console.log('Summarizing with OpenAI');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are a helpful assistant that summarizes text in a ${options.brevity} format.`
          },
          {
            role: 'user',
            content: `Please summarize the following text:\n\n${text}`
          }
        ],
        temperature: config.temperature,
        max_tokens: config.maxTokens
      })
    });
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error with OpenAI:', error);
    throw new Error(`Failed to generate summary with OpenAI: ${error.message}`);
  }
}

// Generate summary using Grok
async function summarizeWithGrok(text, options) {
  try {
    const config = await getConfig();
    const apiKey = config.apiKeys.grok;
    
    if (!apiKey) {
      throw new Error('Grok API key not found');
    }
    
    console.log('Summarizing with Grok');
    
    const response = await fetch('https://api.grok.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'grok-1',
        messages: [
          {
            role: 'system',
            content: `You are a helpful assistant that summarizes text in a ${options.brevity} format.`
          },
          {
            role: 'user',
            content: `Please summarize the following text:\n\n${text}`
          }
        ],
        temperature: config.temperature,
        max_tokens: config.maxTokens
      })
    });
    
    if (!response.ok) {
      throw new Error(`Grok API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error with Grok:', error);
    throw new Error(`Failed to generate summary with Grok: ${error.message}`);
  }
}

// Generate summary using Claude
async function summarizeWithClaude(text, options) {
  try {
    const config = await getConfig();
    const apiKey = config.apiKeys.claude;
    
    if (!apiKey) {
      throw new Error('Claude API key not found');
    }
    
    console.log('Summarizing with Claude');
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229',
        messages: [
          {
            role: 'user',
            content: `Please summarize the following text in a ${options.brevity} format:\n\n${text}`
          }
        ],
        temperature: config.temperature,
        max_tokens: config.maxTokens
      })
    });
    
    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('Error with Claude:', error);
    throw new Error(`Failed to generate summary with Claude: ${error.message}`);
  }
}

// Main summarization function that routes to the appropriate model
async function generateSummaryWithAI(text, options) {
  try {
    // Truncate text if it's too long
    const maxChars = 15000; // Reasonable limit for most API calls
    const truncatedText = text.length > maxChars 
      ? text.substring(0, maxChars) + "..." 
      : text;
    
    const config = await getConfig();
    
    switch (config.modelType) {
      case 'lmstudio':
        return await summarizeWithLMStudio(truncatedText, options);
      case 'openai':
        return await summarizeWithOpenAI(truncatedText, options);
      case 'grok':
        return await summarizeWithGrok(truncatedText, options);
      case 'claude':
        return await summarizeWithClaude(truncatedText, options);
      case 'local':
      default:
        return await summarizeWithOllama(truncatedText, options);
    }
  } catch (error) {
    console.error('Error generating summary:', error);
    throw error;
  }
}

// Export functions
window.QuickReadModels = {
  getConfig,
  saveConfig,
  resetConfig,
  generateSummaryWithAI
};
