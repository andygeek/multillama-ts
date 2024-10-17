import { Orchestrator } from './orchestrator/Orchestrator.js';
import ConfigManager, { Config } from './config/ConfigManager.js';
import { ChatCompletionMessage } from './adapters/BaseAdapter.js';

export class MultiLlama {
  private orchestrator: Orchestrator;

  constructor() {
    this.orchestrator = new Orchestrator();
  }

  public static initialize(config: Config): void {
    ConfigManager.initialize(config);
  }

  public static initializeFromFile(filePath: string): void {
    ConfigManager.initializeFromFile(filePath);
  }

  public static saveConfigToFile(filePath: string): void {
    ConfigManager.saveConfigToFile(filePath);
  }

  public async useModel(
    modelName: string,
    messages: Array<ChatCompletionMessage>,
  ): Promise<string> {
    return await this.orchestrator.useModel(modelName, messages);
  }
}
