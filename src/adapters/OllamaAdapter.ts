import ollama from 'ollama';
import {
  BaseAdapter,
  AdapterResponse,
  ChatCompletionMessage,
} from './BaseAdapter.js';
import { ConfigManager } from '../config/ConfigManager.js';

export class OllamaAdapter implements BaseAdapter<string> {
  async run(
    messages: Array<ChatCompletionMessage>,
    modelName: string,
  ): Promise<AdapterResponse<string>> {
    const modelConfig = ConfigManager.getModelConfig(modelName);
    try {
      const response = await ollama.chat({
        model: modelConfig.name,
        messages: messages,
        format: modelConfig.response_format,
        options: {
          temperature: modelConfig.options?.temperature,
          presence_penalty: modelConfig.options?.presence_penalty,
          frequency_penalty: modelConfig.options?.frequency_penalty,
        },
      });
      return {
        data: response.message.content,
        metadata: {
          modelUsed: modelConfig.name,
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
