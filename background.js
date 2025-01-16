// background.js

// Relay messages between popup and content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "summarize") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const tabId = tabs[0].id;
            // Send the message to the content script
            chrome.tabs.sendMessage(tabId, { action: "summarize" }, (response) => {
                // Relay the content script's response back to the popup
                sendResponse(response);
            });
        });
        return true; // Required to use `sendResponse` asynchronously
    }
});
