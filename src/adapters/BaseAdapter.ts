type RoleOpenAI = 'user' | 'assistant' | 'system';
type RoleAnthropic = 'user' | 'assistant';
type RoleOllama = 'user' | 'assistant' | 'system';

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
