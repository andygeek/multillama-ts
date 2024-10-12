import { BaseAdapter } from '../adapters/BaseAdapter.js';
import { Pipeline } from '../pipeline/Pipeline.js';
import ConfigManager from '../config/ConfigManager.js';
import ora, { Ora } from 'ora';
import { PluginManager } from '../plugins/PluginManager.js';

export class Orchestrator {

  private getAdapter(modelName: string): BaseAdapter<any> {
    const modelConfig = ConfigManager.getModelConfig(modelName);
    const serviceConfig = modelConfig.service;

    if (!serviceConfig.adapter) {
      throw new Error(`No adapter configured for service in model: ${modelName}`);
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

  public async runSequentialPipeline(pipeline: Pipeline<string>, initialInput: string, enableLogging: boolean = false): Promise<string> {
    const spinner = this.startSpinner();

    await PluginManager.runBeforePipelineStart('sequential', initialInput);

    try {
      if (enableLogging) {
        pipeline.enableLogging();
      }

      const result = await pipeline.execute(initialInput);

      await PluginManager.runAfterPipelineEnd('sequential', result);

      spinner.succeed(ConfigManager.getSpinnerConfig()?.successMessage || 'Process completed successfully!');
      return result;
    } catch (error) {
      spinner.fail(ConfigManager.getSpinnerConfig()?.errorMessage || 'An error occurred during the process');
      throw error;
    }
  }

  public async useModel(modelName: string, prompt: string): Promise<string> {
    const adapter = this.getAdapter(modelName);

    const modifiedPrompt = await PluginManager.runBeforeModelCall(modelName, prompt);

    const response = await adapter.run(modifiedPrompt);

    const modifiedResponse = await PluginManager.runAfterModelCall(modelName, response.data);

    return modifiedResponse;
  }

  public async useModelWithStreaming(modelName: string, prompt: string, onData: (chunk: string) => void): Promise<void> {
    const adapter = this.getAdapter(modelName);

    const modifiedPrompt = await PluginManager.runBeforeModelCall(modelName, prompt);

    if (adapter.runWithStreaming) {
      await adapter.runWithStreaming(modifiedPrompt, onData);
    } else {
      throw new Error(`Model ${modelName} does not support streaming`);
    }
  }
}
