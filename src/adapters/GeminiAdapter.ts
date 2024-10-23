import { GenerativeAI } from '@google/generative-ai';
import {
  BaseAdapter,
  AdapterResponse,
  OpenAIChatCompletionMessage,
} from './BaseAdapter.js';
import {
  ConfigManager,
  ModelConfig,
  ServiceConfig,
} from '../config/ConfigManager.js';

export class GeminiAdapter implements BaseAdapter<string> {
  async run(
    messages: Array<OpenAIChatCompletionMessage>,
    modelName: string,
  ): Promise<AdapterResponse<string>> {
    const modelConfig: ModelConfig = ConfigManager.getModelConfig(modelName);
    const serviceConfig: ServiceConfig = modelConfig.service;

    if (!serviceConfig.apiKey) {
      throw new Error(
        `No API key configured for service in model: ${modelName}`,
      );
    }

    const generativeAI = new GenerativeAI({ apiKey: serviceConfig.apiKey });

    try {
      const response = await generativeAI.messages.create({
        model: modelConfig.name,
        max_tokens: modelConfig.max_tokens ?? 300,
        messages: messages,
        temperature: modelConfig.options?.temperature ?? 1,
        response_format: modelConfig.response_format,
      });

      return {
        data: response.choices?.[0]?.message?.content?.trim() || '',
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
