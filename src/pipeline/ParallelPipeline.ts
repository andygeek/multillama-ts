// Tipo que define un paso en el pipeline paralelo: toma un input y devuelve una Promesa con un output.
type ParallelPipelineStep<T> = (input: T) => Promise<T>;

// Clase que permite la ejecución de varios pasos en paralelo.
export class ParallelPipeline<T = string> {
  private parallelSteps: ParallelPipelineStep<T>[] = [];

  // Añadir un paso paralelo al pipeline
  public addParallelStep(step: ParallelPipelineStep<T>): this {
    this.parallelSteps.push(step);
    return this; // Para permitir encadenamiento
  }

  // Ejecutar todos los pasos en paralelo y combinar las respuestas
  public async execute(initialInput: T): Promise<T[]> {
    const results = await Promise.all(this.parallelSteps.map(step => step(initialInput)));
    return results;
  }
}
