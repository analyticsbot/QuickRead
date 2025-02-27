document.addEventListener('DOMContentLoaded', () => {
  const summarizeButton = document.getElementById('summarize');
  const outputDiv = document.getElementById('output');
  const statusDiv = document.getElementById('status');
  const modelInfoSpan = document.getElementById('modelInfo');

  // Load and display current model information
  updateModelInfo();

  // Function to update model info display
  async function updateModelInfo() {
    try {
      if (window.QuickReadModels) {
        const config = await window.QuickReadModels.getConfig();
        let modelName = 'local';
        
        switch (config.modelType) {
          case 'local':
            modelName = `Local (${config.localModelName || 'llama3'})`;
            break;
          case 'lmstudio':
            modelName = 'LM Studio';
            break;
          case 'openai':
            modelName = 'OpenAI';
            break;
          case 'grok':
            modelName = 'Grok';
            break;
          case 'claude':
            modelName = 'Claude';
            break;
          default:
            modelName = 'Local';
        }
        
        modelInfoSpan.textContent = `Using ${modelName}`;
      } else {
        modelInfoSpan.textContent = 'Using TensorFlow.js (legacy)';
      }
    } catch (error) {
      console.error('Error updating model info:', error);
      modelInfoSpan.textContent = 'Using TensorFlow.js (legacy)';
    }
  }

  // Function to update status
  function updateStatus(message, isError = false) {
    statusDiv.textContent = message;
    statusDiv.className = isError ? 'status error' : 'status';
    setTimeout(() => {
      statusDiv.textContent = '';
      statusDiv.className = 'status';
    }, 5000);
  }

  // Function to generate summary
  function generateSummary() {
    const brevity = document.getElementById('brevity').value;
    const format = document.getElementById('format').value;
    
    console.log(`Selected brevity: ${brevity}, format: ${format}`);
    
    // Show loading state
    outputDiv.innerHTML = '<p>Generating summary...</p>';
    updateStatus('Processing page content...');
    
    // Send a message to the content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) {
        console.error('No active tab found');
        outputDiv.innerHTML = '<p>Error: No active tab found.</p>';
        updateStatus('Error: No active tab found', true);
        return;
      }
      
      const tabId = tabs[0].id;
      
      chrome.tabs.sendMessage(
        tabId,
        { action: 'summarize', brevity, format },
        (response) => {
          // Check for error
          if (chrome.runtime.lastError) {
            console.error('Error:', chrome.runtime.lastError);
            outputDiv.innerHTML = '<p>Error: Could not communicate with the page. Please refresh and try again.</p>';
            updateStatus('Communication error', true);
            return;
          }
          
          console.log('Response from content script:', response);
          
          if (response && response.summary) {
            // Format the summary based on user preference
            if (format === 'bullets') {
              const bulletPoints = response.summary
                .split('. ')
                .filter(sentence => sentence.trim().length > 0)
                .map(sentence => {
                  // Add period if it doesn't end with one
                  if (!sentence.endsWith('.') && !sentence.endsWith('!') && !sentence.endsWith('?')) {
                    sentence += '.';
                  }
                  return `<li>${sentence}</li>`;
                })
                .join('');
              
              outputDiv.innerHTML = `<ul>${bulletPoints}</ul>`;
            } else {
              outputDiv.innerHTML = `<p>${response.summary}</p>`;
            }
            
            updateStatus('Summary generated successfully!');
          } else if (response && response.error) {
            outputDiv.innerHTML = `<p>Error: ${response.error}</p>`;
            updateStatus('Error generating summary', true);
          } else {
            outputDiv.innerHTML = '<p>No summary available.</p>';
            updateStatus('No content could be summarized', true);
          }
        }
      );
    });
  }

  // Add click event listener
  summarizeButton.addEventListener('click', generateSummary);
});