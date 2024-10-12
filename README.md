# MultiLlama

MultiLlama is a TypeScript library that provides a flexible and modular way to interact with multiple language models through an orchestrated pipeline. It allows developers to define and execute sequential pipelines of model interactions using configurable adapters and services.

## Features

- **Modular Design**: Easily extendable with custom adapters and services.
- **Pipeline Execution**: Create sequential pipelines for complex processing flows.
- **Configurable**: Initialize configurations from code or file.
- **Adapter Pattern**: Support for different language models through adapters.

## Installation

Install MultiLlama via npm:

```bash
npm install multillama
```

## Usage

### Initialization

Before using MultiLlama, initialize it with your configuration:

```typescript
import { MultiLlama } from 'multillama';
import { OllamaAdapter } from 'multillama';

MultiLlama.initialize({
  services: {
    ollamaService: {
      adapter: new OllamaAdapter(),
    },
  },
  models: {
    ollama: {
      service: {
        adapter: new OllamaAdapter(),
      },
      name: 'ollama-model-name',
      defaultRole: { role: 'user', content: '' },
    },
  },
  spinnerConfig: {
    loadingMessage: 'Processing request...',
    successMessage: 'Process completed successfully!',
    errorMessage: 'An error occurred during the process',
  },
});

// Or initialize from a JSON configuration file
MultiLlama.initializeFromFile('./config.json');
```

### Using a Model

To use a specific model to generate a response:

```typescript
import { MultiLlama } from 'multillama';

const multiLlama = new MultiLlama();

(async () => {
  const response = await multiLlama.useModel('ollama', 'Hello, how are you?');
  console.log(response);
})();
```

### Running a Pipeline

Create and run sequential pipelines for complex workflows:

```typescript
import { MultiLlama, Pipeline } from 'multillama';
import { BaseAdapter } from 'multillama';
import { OllamaAdapter } from 'multillama';

// Define your pipeline steps
const step1 = async (input: string, adapter: BaseAdapter<any>, initialMessage: string): Promise<string> => {
  const response = await adapter.run(input);
  return response.data;
};

const step2 = async (input: string, adapter: BaseAdapter<any>, initialMessage: string): Promise<string> => {
  const modifiedInput = input.toUpperCase();
  const response = await adapter.run(modifiedInput);
  return response.data;
};

// Create a new pipeline
const pipeline = new Pipeline<string, string>();

// Add steps to the pipeline with their respective adapters
pipeline
  .addStep(step1, new OllamaAdapter())
  .addStep(step2, new OllamaAdapter());

// Execute the pipeline
const multiLlama = new MultiLlama();

(async () => {
  const result = await multiLlama.runSequentialPipeline(pipeline, 'Hello, world!');
  console.log(result);
})();
```

## Configuration

MultiLlama uses a configuration object or file to manage services, models, and spinner messages.

### Configuration Object Structure

```typescript
interface Config {
  services: Record<string, ServiceConfig>;
  models: Record<string, ModelConfig>;
  spinnerConfig?: SpinnerConfig;
}

interface ServiceConfig {
  apiKey?: string;
  adapter: BaseAdapter;
}

interface ModelConfig {
  service: ServiceConfig;
  name: string;
  defaultRole: { role: string; content: string };
  stream?: boolean;
}

interface SpinnerConfig {
  loadingMessage: string;
  successMessage: string;
  errorMessage: string;
}
```

### Example Configuration File (`config.json`)

```json
{
  "services": {
    "ollamaService": {
      "adapter": "OllamaAdapter"
    }
  },
  "models": {
    "ollama": {
      "service": {
        "adapter": "OllamaAdapter"
      },
      "name": "ollama-model-name",
      "defaultRole": {
        "role": "user",
        "content": ""
      }
    }
  },
  "spinnerConfig": {
    "loadingMessage": "Processing request...",
    "successMessage": "Process completed successfully!",
    "errorMessage": "An error occurred during the process"
  }
}
```

**Note**: When using a configuration file, ensure that any custom classes like `OllamaAdapter` are properly imported and instantiated in your code.

## Adapters

Adapters are used to interface with different language models or services.

### Creating a Custom Adapter

Implement the `BaseAdapter` interface to create a custom adapter:

```typescript
import { BaseAdapter, AdapterResponse, RunOptions } from 'multillama';

export class CustomAdapter implements BaseAdapter<string> {
  async run(prompt: string, options?: RunOptions): Promise<AdapterResponse<string>> {
    // Implement interaction with your language model here
    return {
      data: 'Response from custom adapter',
      metadata: {
        timestamp: new Date().toISOString(),
      },
    };
  }
}
```

## Error Handling

MultiLlama uses exceptions to handle errors. Use `try-catch` blocks when calling asynchronous methods:

```typescript
try {
  const response = await multiLlama.useModel('ollama', 'Hello!');
} catch (error) {
  console.error('An error occurred:', error);
}
```

## Logging

Enable logging in pipelines to debug and monitor step results:

```typescript
pipeline.enableLogging();
```

## Dependencies

- **TypeScript**: Strongly typed language for writing scalable applications.
- **ora**: For displaying spinners and progress in the console.
- **fs** and **path**: For file system operations in configuration management.

## Support

For questions or issues, please open an issue on the project's GitHub repository.