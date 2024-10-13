import { BaseAdapter } from '../adapters/BaseAdapter.js';
import { Pipeline } from '../pipeline/Pipeline.js';
import ConfigManager from '../config/ConfigManager.js';
import ora, { Ora } from 'ora';

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

  private startSpinner(): Ora {
    const spinnerConfig = ConfigManager.getSpinnerConfig();
    const spinner: Ora = ora({
      text: spinnerConfig?.loadingMessage || 'Processing request...',
    }).start();
    return spinner;
  }

  public async runSequentialPipeline(
    pipeline: Pipeline<string>,
    initialInput: string,
    enableLogging: boolean = false,
  ): Promise<string> {
    const spinner = this.startSpinner();

    try {
      if (enableLogging) {
        pipeline.enableLogging();
      }

      const result = await pipeline.execute(initialInput);

      spinner.succeed(
        ConfigManager.getSpinnerConfig()?.successMessage ||
          'Process completed successfully!',
      );
      return result;
    } catch (error) {
      spinner.fail(
        ConfigManager.getSpinnerConfig()?.errorMessage ||
          'An error occurred during the process',
      );
      throw error;
    }
  }

  public async useModel(modelName: string, prompt: string): Promise<string> {
    const adapter = this.getAdapter(modelName);
    const response = await adapter.run(prompt, modelName);

    return response.data;
  }
}
