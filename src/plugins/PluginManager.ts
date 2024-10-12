import { Plugin } from './Plugin.js';

export class PluginManager {
  private static plugins: Plugin[] = [];

  // Registrar un plugin
  public static registerPlugin(plugin: Plugin): void {
    this.plugins.push(plugin);
  }

  // Ejecutar beforeModelCall en todos los plugins
  public static async runBeforeModelCall(modelName: string, prompt: string): Promise<string> {
    let modifiedPrompt = prompt;
    for (const plugin of this.plugins) {
      if (plugin.beforeModelCall) {
        modifiedPrompt = await plugin.beforeModelCall(modelName, modifiedPrompt);
      }
    }
    return modifiedPrompt;
  }

  // Ejecutar afterModelCall en todos los plugins
  public static async runAfterModelCall(modelName: string, response: string): Promise<string> {
    let modifiedResponse = response;
    for (const plugin of this.plugins) {
      if (plugin.afterModelCall) {
        modifiedResponse = await plugin.afterModelCall(modelName, modifiedResponse);
      }
    }
    return modifiedResponse;
  }

  // Ejecutar beforePipelineStart en todos los plugins
  public static async runBeforePipelineStart(pipelineType: string, initialInput: string): Promise<void> {
    for (const plugin of this.plugins) {
      if (plugin.beforePipelineStart) {
        await plugin.beforePipelineStart(pipelineType, initialInput);
      }
    }
  }

  // Ejecutar afterPipelineEnd en todos los plugins
  public static async runAfterPipelineEnd(pipelineType: string, finalOutput: string): Promise<void> {
    for (const plugin of this.plugins) {
      if (plugin.afterPipelineEnd) {
        await plugin.afterPipelineEnd(pipelineType, finalOutput);
      }
    }
  }
}
