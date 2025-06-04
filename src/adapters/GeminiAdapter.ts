import { GoogleGenAI } from '@google/genai';

import {
  BaseAdapter,
  AdapterResponse,
  GeminiChatCompletionMessage,
} from './BaseAdapter.js';
import {
  ConfigManager,
  ModelConfig,
  ServiceConfig,
} from '../config/ConfigManager.js';

export class GeminiAdapter implements BaseAdapter<string> {
  async run(
    messages: Array<GeminiChatCompletionMessage>,
    modelName: string,
  ): Promise<AdapterResponse<string>> {
    const modelConfig: ModelConfig = ConfigManager.getModelConfig(modelName);
    const serviceConfig: ServiceConfig = modelConfig.service;

    if (!serviceConfig.apiKey) {
      throw new Error(
        `No API key configured for service in model: ${modelName}`,
      );
    }

    const genAi = new GoogleGenAI({ apiKey: serviceConfig.apiKey });

    try {
      const result = await genAi.models.generateContent({
        model: modelName,
        contents: messages,
        config: {
          maxOutputTokens: modelConfig.max_tokens ?? 300,
        },
      });

      return {
        data: result.text || '',
        metadata: {
          modelUsed: modelConfig.name,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error using Gemini: ${error.message}`);
      } else {
        throw new Error('An unknown error occurred');
      }
    }
  }
}
