# QuickRead Chrome Extension

QuickRead is a Chrome extension that uses TensorFlow.js and the Universal Sentence Encoder to summarize web page content directly in your browser.

## Features

- Extracts and summarizes text content from any web page
- Adjustable summary length (short, medium, long)
- Choose between bullet points or paragraph format
- No server-side processing - all summarization happens locally in your browser

## Installation

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" by toggling the switch in the top right corner
4. Click "Load unpacked" and select the directory containing the extension files
5. The QuickRead extension icon should now appear in your browser toolbar

## Usage

1. Navigate to any web page you want to summarize
2. Click the QuickRead extension icon in your toolbar
3. Select your preferred summary length and format
4. Click "Summarize" to generate a summary of the page content
5. The summary will appear in the popup window

## How It Works

QuickRead uses TensorFlow.js and the Universal Sentence Encoder to:

1. Extract text content from the current web page
2. Split the text into sentences
3. Generate embeddings for each sentence using the Universal Sentence Encoder
4. Score sentences based on their semantic importance
5. Select the most important sentences to create a concise summary
6. Present the summary in your preferred format

## Technical Details

- Built with vanilla JavaScript
- Uses TensorFlow.js for in-browser machine learning
- Implements the Universal Sentence Encoder for natural language processing
- Chrome Extension Manifest V3 compliant

## License

This project is licensed under the MIT License - see the LICENSE file for details.
