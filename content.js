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
  chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.action === "summarize") {
      const rawText = document.body.innerText || "";
      const sentences = preprocessText(rawText);
      const summary = await generateSummary(sentences, request.brevity);
      sendResponse({ summary });
    }
  });
  

  async function generateSummary(sentences, brevity) {
    console.log("Generating summary using TensorFlow.js");
  
    // Load the Universal Sentence Encoder
    const model = await use.load();
  
    // Generate embeddings for all sentences
    const embeddings = await model.embed(sentences);
  
    // Compute sentence importance using dot-product (sentence similarity with itself)
    const scores = await embeddings.array().then((embeddingsArray) =>
      embeddingsArray.map((embedding, index) =>
        embedding.reduce((sum, value) => sum + value * value, 0)
      )
    );
  
    // Sort sentences by score
    const scoredSentences = sentences
      .map((sentence, idx) => ({ sentence, score: scores[idx] }))
      .sort((a, b) => b.score - a.score);
  
    // Select top N sentences based on brevity
    const limit = brevity === "short" ? 3 : brevity === "medium" ? 5 : 10;
    const summary = scoredSentences.slice(0, limit).map((s) => s.sentence).join(" ");
  
    return summary || "No summary available.";
  }
  