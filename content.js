// Load TensorFlow.js and Universal Sentence Encoder (legacy method)
let use;
(async function loadModel() {
  try {
    use = await window.use;
    console.log("TensorFlow.js and Universal Sentence Encoder loaded successfully");
  } catch (error) {
    console.error("Error loading TensorFlow.js or Universal Sentence Encoder:", error);
  }
})();

// Clean text and remove non-English characters
function cleanText(text) {
  return text.replace(/[^a-zA-Z0-9.,!? ]/g, ""); // Keeps alphanumeric, punctuation, and spaces
}

// Preprocess text for summarization
function preprocessText(text) {
  const cleanedText = cleanText(text);
  const sentences = cleanedText.split(/(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?)\s/g); // Split into sentences
  return sentences.filter((sentence) => sentence.trim().length > 0); // Remove empty sentences
}

// Listener for summarization requests
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "summarize") {
    console.log("Received summarize request:", request);
    
    // Extract text from the page
    const rawText = document.body.innerText || "";
    
    // Check if we should use AI models or legacy TensorFlow method
    if (typeof window.QuickReadModels !== 'undefined') {
      // Use AI models for summarization
      console.log("Using AI models for summarization");
      
      // Process with AI models
      window.QuickReadModels.generateSummaryWithAI(rawText, {
        brevity: request.brevity,
        format: request.format
      })
        .then(summary => {
          console.log("AI summary generated:", summary);
          sendResponse({ summary });
        })
        .catch(error => {
          console.error("Error generating AI summary:", error);
          // Fall back to TensorFlow method if AI fails
          generateLegacySummary(rawText, request.brevity)
            .then(summary => {
              console.log("Fallback summary generated:", summary);
              sendResponse({ summary });
            })
            .catch(fallbackError => {
              console.error("Fallback summarization failed:", fallbackError);
              sendResponse({ error: "Failed to generate summary" });
            });
        });
    } else {
      // Use legacy TensorFlow method
      console.log("Using legacy TensorFlow method for summarization");
      const sentences = preprocessText(rawText);
      
      generateLegacySummary(rawText, request.brevity)
        .then(summary => {
          console.log("Legacy summary generated:", summary);
          sendResponse({ summary });
        })
        .catch(error => {
          console.error("Error generating legacy summary:", error);
          sendResponse({ error: "Failed to generate summary" });
        });
    }
    
    // Return true to indicate async response
    return true;
  }
});

// Legacy summary generation using TensorFlow.js
async function generateLegacySummary(text, brevity) {
  console.log("Generating summary using TensorFlow.js");
  
  if (!use) {
    throw new Error("Universal Sentence Encoder not loaded");
  }
  
  const sentences = preprocessText(text);
  
  if (sentences.length === 0) {
    return "No content found to summarize.";
  }
  
  try {
    // Load the Universal Sentence Encoder
    const model = await use.load();
    
    // Generate embeddings for all sentences
    const embeddings = await model.embed(sentences);
    
    // Compute sentence importance using dot-product (sentence similarity with itself)
    const scores = await embeddings.array().then((embeddingsArray) =>
      embeddingsArray.map((embedding) =>
        embedding.reduce((sum, value) => sum + value * value, 0)
      )
    );
    
    // Sort sentences by score
    const scoredSentences = sentences
      .map((sentence, idx) => ({ sentence, score: scores[idx] }))
      .sort((a, b) => b.score - a.score);
    
    // Select top N sentences based on brevity
    const limit = brevity === "short" ? 3 : brevity === "medium" ? 5 : 10;
    
    // Sort the selected sentences by their original order to maintain context
    const topSentences = scoredSentences.slice(0, limit);
    const originalOrderSentences = topSentences
      .map(item => {
        return {
          ...item,
          originalIndex: sentences.indexOf(item.sentence)
        };
      })
      .sort((a, b) => a.originalIndex - b.originalIndex);
    
    const summary = originalOrderSentences.map(item => item.sentence).join(" ");
    
    return summary || "No summary available.";
  } catch (error) {
    console.error("Error in generateLegacySummary:", error);
    return "Error generating summary. Please try again.";
  }
}