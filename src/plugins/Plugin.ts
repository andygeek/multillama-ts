export interface Plugin {
  // Método para ejecutar alguna acción antes de que se ejecute el modelo
  beforeModelCall?(modelName: string, prompt: string): Promise<string> | string;

  // Método para ejecutar alguna acción después de que el modelo ha respondido
  afterModelCall?(modelName: string, response: string): Promise<string> | string;

  // Método para ejecutar al inicio de un pipeline
  beforePipelineStart?(pipelineType: string, initialInput: string): Promise<void> | void;

  // Método para ejecutar al final de un pipeline
  afterPipelineEnd?(pipelineType: string, finalOutput: string): Promise<void> | void;
}
