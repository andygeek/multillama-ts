import { GoogleGenerativeAI } from '@google/generative-ai';
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

    const genAi = new GoogleGenerativeAI(serviceConfig.apiKey);

    try {
      const model = genAi.getGenerativeModel({ model: modelName });
      const prompt = "Does this look store-bought or homemade?";

      
      const result = await model.generateContent([prompt]);

      return {
        data: result.response.text() || '',
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
