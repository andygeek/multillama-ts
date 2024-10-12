import { BaseAdapter } from '../adapters/BaseAdapter.js';
import { Pipeline } from '../pipeline/Pipeline.js';
import { ParallelPipeline } from '../pipeline/ParallelPipeline.js';
import { ConditionalPipeline } from '../pipeline/ConditionalPipeline.js';
import ConfigManager from '../config/ConfigManager.js';
import ora, { Ora } from 'ora';
import { PluginManager } from '../plugins/PluginManager.js';  // Importamos el PluginManager

export class Orchestrator {
  private adapters: Record<string, BaseAdapter<any>> = {};

  // Método para registrar adaptadores
  public registerAdapter(modelName: string, adapter: BaseAdapter<any>): void {
    this.adapters[modelName] = adapter;
  }

  // Método para obtener el adaptador de un modelo registrado
  private getAdapter(modelName: string): BaseAdapter<any> {
    const adapter = this.adapters[modelName];
    if (!adapter) {
      throw new Error(`No adapter registered for model: ${modelName}`);
    }
    return adapter;
  }

  // Método para iniciar el spinner con configuración personalizada
  private startSpinner(): Ora {
    const spinnerConfig = ConfigManager.getSpinnerConfig();
    const spinner: Ora = ora({
      text: spinnerConfig?.loadingMessage || 'Processing request...',
    }).start();
    return spinner;
  }

  // Método para ejecutar un pipeline secuencial con soporte para plugins
  public async runSequentialPipeline(pipeline: Pipeline<string>, initialInput: string): Promise<string> {
    const spinner = this.startSpinner();

    // Ejecutar plugins antes de empezar el pipeline
    await PluginManager.runBeforePipelineStart('sequential', initialInput);

    try {
      const result = await pipeline.execute(initialInput);

      // Ejecutar plugins después de que el pipeline termine
      await PluginManager.runAfterPipelineEnd('sequential', result);

      spinner.succeed(ConfigManager.getSpinnerConfig()?.successMessage || 'Process completed successfully!');
      return result;
    } catch (error) {
      spinner.fail(ConfigManager.getSpinnerConfig()?.errorMessage || 'An error occurred during the process');
      throw error;
    }
  }

  // Método para ejecutar un pipeline paralelo con soporte para plugins
  public async runParallelPipeline(pipeline: ParallelPipeline<string>, initialInput: string): Promise<string[]> {
    const spinner = this.startSpinner();

    // Ejecutar plugins antes de empezar el pipeline
    await PluginManager.runBeforePipelineStart('parallel', initialInput);

    try {
      const results = await pipeline.execute(initialInput);

      // Ejecutar plugins después de que el pipeline termine
      await PluginManager.runAfterPipelineEnd('parallel', results.join(', '));

      spinner.succeed(ConfigManager.getSpinnerConfig()?.successMessage || 'Process completed successfully!');
      return results;
    } catch (error) {
      spinner.fail(ConfigManager.getSpinnerConfig()?.errorMessage || 'An error occurred during the process');
      throw error;
    }
  }

  // Método para ejecutar un pipeline condicional con soporte para plugins
  public async runConditionalPipeline(pipeline: ConditionalPipeline<string>, initialInput: string): Promise<string> {
    const spinner = this.startSpinner();

    // Ejecutar plugins antes de empezar el pipeline
    await PluginManager.runBeforePipelineStart('conditional', initialInput);

    try {
      const result = await pipeline.execute(initialInput);

      // Ejecutar plugins después de que el pipeline termine
      await PluginManager.runAfterPipelineEnd('conditional', result);

      spinner.succeed(ConfigManager.getSpinnerConfig()?.successMessage || 'Process completed successfully!');
      return result;
    } catch (error) {
      spinner.fail(ConfigManager.getSpinnerConfig()?.errorMessage || 'An error occurred during the process');
      throw error;
    }
  }

  // Método para usar un modelo directamente con soporte para plugins
  public async useModel(modelName: string, prompt: string): Promise<string> {
    const adapter = this.getAdapter(modelName);

    // Ejecutar plugins antes de la llamada al modelo
    const modifiedPrompt = await PluginManager.runBeforeModelCall(modelName, prompt);

    const response = await adapter.run(modifiedPrompt);

    // Ejecutar plugins después de la llamada al modelo
    const modifiedResponse = await PluginManager.runAfterModelCall(modelName, response.data);

    return modifiedResponse;
  }

  // Método para manejar streaming con plugins
  public async useModelWithStreaming(modelName: string, prompt: string, onData: (chunk: string) => void): Promise<void> {
    const adapter = this.getAdapter(modelName);

    // Ejecutar plugins antes de la llamada al modelo
    const modifiedPrompt = await PluginManager.runBeforeModelCall(modelName, prompt);

    if (adapter.runWithStreaming) {
      await adapter.runWithStreaming(modifiedPrompt, onData);
    } else {
      throw new Error(`Model ${modelName} does not support streaming`);
    }

    // Aquí no se ejecuta afterModelCall, ya que el proceso es continuo (streaming)
  }
}
