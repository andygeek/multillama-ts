import { BaseAdapter, ChatCompletionMessage } from '../adapters/BaseAdapter.js';
import ConfigManager from '../config/ConfigManager.js';

export class Orchestrator {
  private getAdapter(modelName: string): BaseAdapter<any> {
    const modelConfig = ConfigManager.getModelConfig(modelName);
    const serviceConfig = modelConfig.service;

    if (!serviceConfig.adapter) {
      throw new Error(
        `No adapter configured for service in model: ${modelName}`,
      );
    }

    return serviceConfig.adapter;
  }

  public async useModel(
    modelName: string,
    messages: Array<ChatCompletionMessage>,
  ): Promise<string> {
    const adapter = this.getAdapter(modelName);
    const response = await adapter.run(messages, modelName);

    return response.data;
  }
}
