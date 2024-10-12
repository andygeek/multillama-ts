// Tipo que define un paso en el pipeline: toma un input y devuelve una Promesa con un output.
export type PipelineStep<T> = (input: T) => Promise<T>;

// Clase que permite encadenar una serie de pasos secuenciales.
export class Pipeline<T = string> {
  private steps: PipelineStep<T>[] = [];

  // Añadir un paso al pipeline
  public addStep(step: PipelineStep<T>): this {
    this.steps.push(step);
    return this; // Para permitir encadenamiento
  }

  // Ejecuta el pipeline de manera secuencial pasando el input inicial al primer paso
  public async execute(initialInput: T): Promise<T> {
    let result = initialInput;
    for (const step of this.steps) {
      result = await step(result); // Cada paso toma el resultado del anterior
    }
    return result;
  }
}
