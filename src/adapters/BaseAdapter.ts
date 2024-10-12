export interface RunOptions {
  model?: string;
  roles?: Array<{ role: string; content: string }>;
  stream?: boolean;
}

export interface AdapterResponse<T = string> {
  data: T;
  metadata?: Record<string, any>;
}

export interface BaseAdapter<T = string> {
  run(prompt: string, options?: RunOptions): Promise<AdapterResponse<T>>;
}
