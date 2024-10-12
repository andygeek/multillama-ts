import ollama from 'ollama';
import { BaseAdapter, AdapterResponse } from './BaseAdapter.js';
import ConfigManager from '../config/ConfigManager.js';

export class OllamaAdapter implements BaseAdapter<string> {
  private modelName = 'ollama';

  async run(prompt: string): Promise<AdapterResponse<string>> {
    const modelConfig = ConfigManager.getModelConfig(this.modelName);
    try {
      const response = await ollama.chat({
        model: modelConfig.name,
        messages: [{ role: modelConfig.role, content: prompt }],
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
