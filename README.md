# MultiLlama

MultiLlama 🦙🦙🦙 is an innovative TypeScript framework that helps developers use multiple Large Language Models (LLMs) simultaneously. Designed to unify different AI models, MultiLlama enables the creation of dynamic decision flows and manages complex processes, leveraging the strengths of each AI model together.

<div align="center">
  <img src="https://i.imgur.com/4fZ0ydN.png" alt="Descripción de la imagen" height="200px" />
</div>

---

## Supported Services

MultiLlama currently supports the following services:

- ✅ **OpenAI**
- ✅ **Ollama**
- ✅ **Anthropic**
- ✅ **Gemini**

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Usage Examples](#usage-examples)
  - [Basic Usage](#basic-usage)
  - [Creating a Pipeline](#creating-a-pipeline)

---

## Features

- **Unified Interface**: Interact with multiple language models through a single, consistent API.
- **Pipeline Processing**: Build complex processing pipelines with conditional branching and context management.
- **Extensibility**: Easily add support for new models and services via adapters.
- **Configurable**: Initialize and manage configurations from code or external files.
- **Spinner Integration**: Built-in support for CLI spinners to enhance user experience during processing.

---

## Installation

To install MultiLlama, use npm:

```bash
npm install multillama
```

---

## Getting Started

First, import the necessary classes and initialize the `MultiLlama` instance with your configuration.

```typescript
import { MultiLlama, OpenAIAdapter, OllamaAdapter, GeminiAdapter } from 'multillama';

// Define service configurations
const openaiService = {
  adapter: new OpenAIAdapter(),
  apiKey: 'your-openai-api-key',
};

const ollamaService = {
  adapter: new OllamaAdapter(),
};

const geminiService = {
  adapter: new GeminiAdapter(),
  apiKey: 'your-gemini-api-key',
};

// Define model configurations
const models = {
  gpt4: {
    service: openaiService,
    name: 'gpt-4',
    response_format: 'json',
  },
  llama: {
    service: ollamaService,
    name: 'llama-2',
    response_format: 'text',
  },
  gemini: {
    service: geminiService,
    name: 'gemini-model',
    response_format: 'text',
  },
};

// Initialize MultiLlama
MultiLlama.initialize({
  services: {
    openai: openaiService,
    ollama: ollamaService,
    gemini: geminiService,
  },
  models,
  spinnerConfig: {
    loadingMessage: 'Processing...',
    successMessage: 'Done!',
    errorMessage: 'An error occurred.',
  },
});
```

---

## Usage Examples

### Basic Usage

Use a specific model to generate a response to a prompt.

```typescript
const multillama = new MultiLlama();

async function generateResponse() {
  const prompt = 'What is the capital of France?';
  const response = await multillama.useModel('gpt4', [{role: 'user', content: prompt}]);
  console.log(response);
}

generateResponse();
```

**Output:**

```
Paris
```

### Creating a Pipeline

Create a processing pipeline with conditional steps and branching.

```typescript
import { Pipeline } from 'multillama';

async function processInput(userInput: string) {
  const multillama = new MultiLlama();
  const pipeline = new Pipeline<string>();
  pipeline.setEnableLogging(true);

  // Initial Step: Analyze the input
  const initialStep = pipeline.addStep(async (input, context) => {
    // Determine the type of question
    const analysisPrompt = `Analyze the following question and categorize it: "${input}"`;
    const response = await multillama.useModel('gpt4', [{role: 'user', content: analysisPrompt}]);
    if (response.includes('weather')) {
      return 'weather_question';
    } else {
      return 'general_question';
    }
  });

  // Branch for weather-related questions
  const weatherStep = pipeline.addStep(async (input, context) => {
    const weatherPrompt = `Provide a weather report for "${context.initialInput}"`;
    return await multillama.useModel('gpt4', [{role: 'user', content: weatherPrompt}]);
  });

  // Branch for general questions
  const generalStep = pipeline.addStep(async (input, context) => {
    return await multillama.useModel('llama', [{role: 'user', content: context.initialInput}]);
  });

  // Set up branching
  pipeline.addBranch(initialStep, 'weather_question', weatherStep);
  pipeline.addBranch(initialStep, 'general_question', generalStep);

  // Execute the pipeline
  const result = await pipeline.execute(userInput);
  console.log(result);
}

processInput('What is the weather like in New York?');
```

**Output:**

```
The current weather in New York is sunny with a temperature of 25°C.
```

---

*Happy Coding!* 🦙🎉
