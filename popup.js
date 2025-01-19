document.getElementById('summarize').addEventListener('click', () => {
    console.log('Summarize button clicked'); // Debugging log
    const brevity = document.getElementById('brevity').value;
    const format = document.getElementById('format').value;
  
    console.log(`Selected brevity: ${brevity}, format: ${format}`); // Debugging log
  
    // Send a message to the content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) {
        console.error('No active tab found');
        return;
      }
  
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: 'summarize', brevity, format },
        (response) => {
          console.log('Response from content script:', response); // Debugging log
          const output = document.getElementById('output');
          if (response && response.summary) {
            output.innerHTML =
              format === 'bullets'
                ? `<ul>${response.summary
                    .split('\n')
                    .map((item) => `<li>${item}</li>`)
                    .join('')}</ul>`
                : `<p>${response.summary}</p>`;
          } else {
            output.innerHTML = '<p>No summary available.</p>';
          }
        }
      );
    });
  });
  