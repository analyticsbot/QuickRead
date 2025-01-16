document.getElementById("summarize").addEventListener("click", () => {
    const brevity = document.getElementById("brevity").value;
    const format = document.getElementById("format").value;
  
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "summarize", brevity }, (response) => {
        const output = document.getElementById("output");
        if (response && response.summary) {
          output.innerHTML =
            format === "bullets"
              ? `<ul>${response.summary
                  .split('. ')
                  .map((sentence) => `<li>${sentence.trim()}</li>`)
                  .join('')}</ul>`
              : `<p>${response.summary}</p>`;
        } else {
          output.innerHTML = "<p>No summary available.</p>";
        }
      });
    });
  });
  