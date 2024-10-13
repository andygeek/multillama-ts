import ollama from 'ollama';
import { BaseAdapter, AdapterResponse } from './BaseAdapter.js';
import { ConfigManager } from '../config/ConfigManager.js';

export class OllamaAdapter implements BaseAdapter<string> {

  async run(prompt: string, modelName: string): Promise<AdapterResponse<string>> {
    const modelConfig = ConfigManager.getModelConfig(modelName);
    try {
      const response = await ollama.chat({
        model: modelConfig.name,
        messages: [{ role: modelConfig.role, content: prompt }],
        format: modelConfig.response_format,
      });
      return {
        data: response.message.content,
        metadata: {
          modelUsed: modelConfig.name,
          promptLength: prompt.length,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error using Ollama: ${error.message}`);
      } else {
        throw new Error('An unknown error occurred');
      }
    }
  }
}
