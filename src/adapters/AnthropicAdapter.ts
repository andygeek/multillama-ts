import { Anthropic } from '@anthropic-ai/sdk';
import {
  BaseAdapter,
  AdapterResponse,
  AnthropicChatCompletionMessage,
} from './BaseAdapter.js';
import {
  ConfigManager,
  ModelConfig,
  ServiceConfig,
} from '../config/ConfigManager.js';

export class AnthropicAdapter implements BaseAdapter<string> {
  async run(
    messages: Array<AnthropicChatCompletionMessage>,
    modelName: string,
  ): Promise<AdapterResponse<string>> {
    const modelConfig: ModelConfig = ConfigManager.getModelConfig(modelName);
    const serviceConfig: ServiceConfig = modelConfig.service;

    if (!serviceConfig.apiKey) {
      throw new Error(
        `No API key configured for service in model: ${modelName}`,
      );
    }

    const anthropic = new Anthropic({ apiKey: serviceConfig.apiKey });

    try {
      const response = await anthropic.messages.create({
        model: modelConfig.name,
        max_tokens: modelConfig.max_tokens ?? 300,
        messages: messages,
        temperature: modelConfig.options?.temperature ?? 1,
        tools:
          modelConfig.response_format == 'json'
            ? [
                {
                  name: 'json_output',
                  description: 'json_output',
                  input_schema: {
                    type: 'object',
                    properties: {
                      data: {
                        type: 'string',
                      },
                    },
                  },
                },
              ]
            : undefined,
        tool_choice:
          modelConfig.response_format == 'json'
            ? {
                type: 'tool',
                name: 'json_output',
              }
            : undefined,
      });
      return {
        data:
          modelConfig.response_format == 'json'
            ? ((response.content[0] as Anthropic.ToolUseBlock).input as any)
                .data
            : (response.content[0] as Anthropic.TextBlock).text,
        metadata: {
          modelUsed: modelConfig.name,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error using Anthropic: ${error.message}`);
      } else {
        throw new Error('An unknown error occurred');
      }
    }
  }
}
