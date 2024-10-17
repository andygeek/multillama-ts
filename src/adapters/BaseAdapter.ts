type Role = 'user' | 'assistant' | 'system';

export interface AdapterResponse<T = string> {
  data: T;
  metadata?: Record<string, any>;
}

export interface BaseAdapter<T = string> {
  run(
    messages: Array<ChatCompletionMessage>,
    modelName: string,
  ): Promise<AdapterResponse<T>>;
}

export interface ChatCompletionMessage {
  content: string;
  role: Role;
}
