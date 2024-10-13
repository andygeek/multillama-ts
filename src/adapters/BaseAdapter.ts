export interface AdapterResponse<T = string> {
  data: T;
  metadata?: Record<string, any>;
}

export interface BaseAdapter<T = string> {
  run(prompt: string, modelName: string): Promise<AdapterResponse<T>>;
}
