// background.js

// Log when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  console.log('QuickRead extension installed');
});

// Handle messages from popup to content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background script received message:', request);
  
  // Only handle messages that need to be relayed
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
});
