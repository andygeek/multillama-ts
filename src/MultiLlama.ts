import { Orchestrator } from './orchestrator/Orchestrator.js';
import ConfigManager, { Config } from './config/ConfigManager.js';

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

  public async useModel(modelName: string, prompt: string): Promise<String> {
    return await this.orchestrator.useModel(modelName, prompt);
  }

  public async runSequentialPipeline(pipeline: any, initialInput: string): Promise<string> {
    return await this.orchestrator.runSequentialPipeline(pipeline, initialInput);
  }
}
