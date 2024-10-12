import ConfigManager, { Config } from './config/ConfigManager.js';
import { OllamaAdapter } from './adapters/OllamaAdapter.js';

export { Orchestrator } from './orchestrator/Orchestrator.js';
export { OllamaAdapter } from './adapters/OllamaAdapter.js';  // Asegúrate de exportar OllamaAdapter
export { Pipeline } from './pipeline/Pipeline.js';


export class MultiLlama {
  private ollamaAdapter: OllamaAdapter;

  constructor() {
    this.ollamaAdapter = new OllamaAdapter();
    // Puedes inicializar más adaptadores aquí si es necesario
  }

  // Método para inicializar la configuración global del framework
  public static initialize(config: Config): void {
    ConfigManager.initialize(config);
  }

  // Método para usar Ollama
  public async useOllama(prompt: string): Promise<void> {
    const response = await this.ollamaAdapter.run(prompt);
    console.log(response.data);        // Muestra la respuesta principal
    console.log(response.metadata);    // Muestra información adicional
  }

  // Método para usar Ollama con streaming
  public async useOllamaWithStreaming(prompt: string): Promise<void> {
    await this.ollamaAdapter.runWithStreaming(prompt, (chunk) => {
      process.stdout.write(chunk);  // Muestra el chunk recibido
    });
  }
}
