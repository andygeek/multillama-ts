import ConfigManager, { Config } from './config/ConfigManager.js';
import { Orchestrator } from './orchestrator/Orchestrator.js';

export { Orchestrator } from './orchestrator/Orchestrator.js';
export { OllamaAdapter } from './adapters/OllamaAdapter.js';
export { Pipeline } from './pipeline/Pipeline.js';

export class MultiLlama {
  private orchestrator: Orchestrator;

  constructor() {
    this.orchestrator = new Orchestrator();
  }

  // Inicializar MultiLlama con una configuración
  public static initialize(config: Config): void {
    ConfigManager.initialize(config);
  }

  // Inicializar MultiLlama desde un archivo de configuración JSON
  public static initializeFromFile(filePath: string): void {
    ConfigManager.initializeFromFile(filePath);
  }

  // Guardar la configuración actual en un archivo JSON
  public static saveConfigToFile(filePath: string): void {
    ConfigManager.saveConfigToFile(filePath);
  }

  // Registrar un adaptador para un servicio
  public registerAdapter(modelName: string, adapter: any): void {
    this.orchestrator.registerAdapter(modelName, adapter);
  }

  // Método para usar un modelo directamente
  public async useModel(modelName: string, prompt: string): Promise<string> {
    return await this.orchestrator.useModel(modelName, prompt);
  }

  // Método para ejecutar un pipeline secuencial
  public async runSequentialPipeline(pipeline: any, initialInput: string): Promise<string> {
    return await this.orchestrator.runSequentialPipeline(pipeline, initialInput);
  }

  // Método para ejecutar un pipeline paralelo
  public async runParallelPipeline(pipeline: any, initialInput: string): Promise<string[]> {
    return await this.orchestrator.runParallelPipeline(pipeline, initialInput);
  }

  // Método para ejecutar un pipeline condicional
  public async runConditionalPipeline(pipeline: any, initialInput: string): Promise<string> {
    return await this.orchestrator.runConditionalPipeline(pipeline, initialInput);
  }
}
