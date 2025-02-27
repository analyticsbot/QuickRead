// Test script for QuickRead extension
console.log('Running QuickRead test script');

// Mock document body for testing
const mockText = `
This is a test paragraph for the QuickRead extension. It contains multiple sentences that should be processed by the extension.
The QuickRead extension uses TensorFlow.js to summarize web page content. It extracts the most important sentences from a page.
Users can choose between short, medium, and long summaries. They can also select between bullet points and paragraph format.
The extension processes all content locally in the browser, without sending any data to external servers.
This ensures privacy and allows the extension to work offline. The Universal Sentence Encoder model is used for natural language processing.
`;

// Function to test text preprocessing
function testPreprocessing() {
  console.log('Testing text preprocessing...');
  
  // Import functions from content.js
  if (typeof cleanText !== 'function' || typeof preprocessText !== 'function') {
    console.error('Error: cleanText or preprocessText functions not found');
    return false;
  }
  
  const cleaned = cleanText(mockText);
  console.log('Cleaned text:', cleaned.substring(0, 100) + '...');
  
  const sentences = preprocessText(mockText);
  console.log('Extracted sentences:', sentences.length);
  sentences.forEach((s, i) => {
    if (i < 3) console.log(`- ${s.substring(0, 50)}...`);
  });
  
  return sentences.length > 0;
}

// Function to test TensorFlow.js loading
async function testTensorFlow() {
  console.log('Testing TensorFlow.js loading...');
  
  if (typeof tf === 'undefined') {
    console.error('Error: TensorFlow.js not loaded');
    return false;
  }
  
  console.log('TensorFlow.js version:', tf.version.tfjs);
  
  try {
    // Test if USE is available
    if (typeof use === 'undefined') {
      console.error('Error: Universal Sentence Encoder not loaded');
      return false;
    }
    
    console.log('Universal Sentence Encoder available');
    return true;
  } catch (error) {
    console.error('Error testing TensorFlow:', error);
    return false;
  }
}

// Run tests when the page loads
window.addEventListener('load', async () => {
  console.log('Running QuickRead extension tests...');
  
  const preprocessingResult = testPreprocessing();
  console.log('Preprocessing test:', preprocessingResult ? 'PASSED' : 'FAILED');
  
  const tensorflowResult = await testTensorFlow();
  console.log('TensorFlow test:', tensorflowResult ? 'PASSED' : 'FAILED');
  
  console.log('All tests completed');
});
