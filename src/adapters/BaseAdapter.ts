import { Content } from '@google/genai';

export type RoleOpenAI = 'user' | 'assistant' | 'system';
export type RoleAnthropic = 'user' | 'assistant';
export type RoleOllama = 'user' | 'assistant' | 'system';
export type RoleGemini = 'user' | 'model';

export interface AdapterResponse<T = string> {
  data: T;
  metadata?: Record<string, any>;
}

export interface BaseAdapter<T = string> {
  run(
    messages: Array<
      | OpenAIChatCompletionMessage
      | AnthropicChatCompletionMessage
      | OllamaChatCompletionMessage
      | GeminiChatCompletionMessage
    >,
    modelName: string,
  ): Promise<AdapterResponse<T>>;
}

export interface OpenAIChatCompletionMessage {
  content: string;
  role: RoleOpenAI;
}

export interface AnthropicChatCompletionMessage {
  content: string;
  role: RoleAnthropic;
}

export interface OllamaChatCompletionMessage {
  content: string;
  role: RoleOllama;
}

export interface GeminiChatCompletionMessage extends Content {
  role?: RoleGemini;
}
