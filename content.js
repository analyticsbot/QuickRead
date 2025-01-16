// content.js
function extractText() {
    const bodyText = document.body.innerText;
    return bodyText.substring(0, 500); // Example: Extract first 500 characters
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "summarize") {
        const text = extractText();
        sendResponse({ summary: text }); // Simple logic for now
    }
});
