import OpenAI from 'openai';
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

export class OpenAiAdapter implements BaseAdapter<string> {
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

    const openai = new OpenAI({ apiKey: serviceConfig.apiKey });

    try {
      const response = await openai.chat.completions.create({
        model: modelConfig.name,
        messages: messages,
        temperature: modelConfig.options?.temperature ?? 1,
        max_tokens: modelConfig.max_tokens ?? 300,
        frequency_penalty: modelConfig.options?.frequency_penalty ?? 0,
        presence_penalty: modelConfig.options?.presence_penalty ?? 0,
        response_format:
          modelConfig.response_format == 'json'
            ? { type: 'json_object' }
            : { type: 'text' },
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
        throw new Error(`Error using OpenAI: ${error.message}`);
      } else {
        throw new Error('An unknown error occurred');
      }
    }
  }
}
