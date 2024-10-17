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
- ⏳ **Gemini** *(coming soon)*
- ⏳ **Claude** *(coming soon)*

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Usage Examples](#usage-examples)
  - [Basic Usage](#basic-usage)
  - [Creating a Pipeline](#creating-a-pipeline)
  - [Handling Commands and Questions](#handling-commands-and-questions)

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
import { MultiLlama, OpenAIAdapter, OllamaAdapter } from 'multillama';

// Define service configurations
const openaiService = {
  adapter: new OpenAIAdapter(),
  apiKey: 'your-openai-api-key',
};

const ollamaService = {
  adapter: new OllamaAdapter(),
};

// Define model configurations
const models = {
  gpt4: {
    service: openaiService,
    name: 'gpt-4',
    role: 'user',
    response_format: 'text',
  },
  llama: {
    service: ollamaService,
    name: 'llama-2',
    role: 'user',
    response_format: 'text',
  },
};

// Initialize MultiLlama
MultiLlama.initialize({
  services: {
    openai: openaiService,
    ollama: ollamaService,
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
  const response = await multillama.useModel('gpt4', prompt);
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
    const response = await multillama.useModel('gpt4', analysisPrompt);
    if (response.includes('weather')) {
      return 'weather_question';
    } else {
      return 'general_question';
    }
  });

  // Branch for weather-related questions
  const weatherStep = pipeline.addStep(async (input, context) => {
    const weatherPrompt = `Provide a weather report for "${context.initialInput}"`;
    return await multillama.useModel('gpt4', weatherPrompt);
  });

  // Branch for general questions
  const generalStep = pipeline.addStep(async (input, context) => {
    return await multillama.useModel('llama', context.initialInput);
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

### Handling Commands and Questions

Implement a command handler that processes different types of user inputs.

```typescript
import {
  handleCommandOrQuestion,
} from './src/questionHandler.js';

// User input from command-line arguments or other sources
const userInput = 'Create a new feature branch named "feature/login"';

// Process the input using predefined models
handleCommandOrQuestion('gpt4', 'llama', userInput);
```

---

*Happy Coding!* 🦙🎉