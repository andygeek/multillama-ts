import OpenAI from 'openai';
import { BaseAdapter, AdapterResponse, RunOptions } from './BaseAdapter.js';
import ConfigManager from '../config/ConfigManager.js';


export class OpenAIAdapter implements BaseAdapter<string> {
  async run(prompt: string, options?: RunOptions): Promise<AdapterResponse<string>> {
    const modelName = options?.model || 'openai';
    const modelConfig = ConfigManager.getModelConfig(modelName);
    const serviceConfig = modelConfig.service;

    if (!serviceConfig.apiKey) {
      throw new Error(`No API key configured for service in model: ${modelName}`);
    }

    const openai = new OpenAI({ apiKey: serviceConfig.apiKey });

    try {
      const response = await openai.chat.completions.create({
        model: modelConfig.name,
        messages: [{ role: 'user', content: prompt }],
        temperature: options?.temperature ?? 1,
        max_tokens: options?.max_tokens ?? 100,
        top_p: options?.top_p ?? 1,
        frequency_penalty: options?.frequency_penalty ?? 0,
        presence_penalty: options?.presence_penalty ?? 0,
        stream: false,
      });

      return {
        data: response.choices?.[0]?.message?.content?.trim() || '',
        metadata: {
          modelUsed: modelConfig.name,
          promptLength: prompt.length,
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
