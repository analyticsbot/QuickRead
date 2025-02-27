# QuickRead Chrome Extension

QuickRead is a Chrome extension that summarizes web page content directly in your browser. It supports multiple AI models, including local options for privacy and cloud-based services for enhanced capabilities.

## Features

- Extracts and summarizes text content from any web page
- Supports multiple AI models:
  - **Local Ollama models** (default for privacy)
  - **LM Studio** for local inference
  - **OpenAI** (GPT-4o)
  - **Grok** 
  - **Claude** (Claude 3 Opus)
- Adjustable summary length (short, medium, long)
- Choose between bullet points or paragraph format
- All processing happens locally by default - your data never leaves your computer

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

## AI Model Configuration

QuickRead supports multiple AI models for summarization:

### Local Models (Default)

By default, QuickRead uses Ollama for local summarization, which keeps all your data on your machine.

- **Requirements**: [Ollama](https://ollama.ai/) must be installed and running on your computer
- **Default Model**: llama3 (can be changed in settings)

### LM Studio

For more powerful local inference:

- **Requirements**: [LM Studio](https://lmstudio.ai/) must be installed and running with the API server enabled
- **Configuration**: Set the endpoint in settings (default: http://localhost:1234/v1)

### Cloud Models

For enhanced summarization capabilities, you can use cloud-based models:

- **OpenAI**: Requires an API key from [OpenAI](https://platform.openai.com/)
- **Grok**: Requires an API key from [Grok](https://grok.x.ai/)
- **Claude**: Requires an API key from [Anthropic](https://www.anthropic.com/)

To use these models, go to the Settings page and enter your API keys.

## Privacy

QuickRead takes your privacy seriously:

- By default, all processing happens locally on your machine
- Your API keys are stored only in your browser's local storage
- No data is sent to our servers
- When using cloud models, data is sent directly to the respective API providers

## How It Works

QuickRead uses different approaches to summarize content:

1. **AI-based summarization**: Uses various AI models to generate concise summaries
2. **Legacy TensorFlow.js method**: Falls back to a local embedding-based approach using TensorFlow.js if AI models are unavailable

## Technical Details

- Built with vanilla JavaScript
- Uses Chrome Extension Manifest V3
- Supports multiple AI models through a unified interface
- Stores settings in Chrome's local storage for persistence

## License

This project is licensed under the MIT License - see the LICENSE file for details.
