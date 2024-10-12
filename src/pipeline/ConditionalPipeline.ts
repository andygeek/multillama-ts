import { Pipeline, PipelineStep } from './Pipeline.js'; // Reutilizamos la clase Pipeline y el tipo PipelineStep

// Definimos un tipo para la condición: toma un input y devuelve true o false.
type Condition<T> = (input: T) => boolean;

// Extiende la clase Pipeline para permitir pasos condicionales.
export class ConditionalPipeline<T = string> extends Pipeline<T> {
  
  // Añade un paso que solo se ejecutará si la condición se cumple.
  public addConditionalStep(condition: Condition<T>, step: PipelineStep<T>): this {
    this.addStep(async (input) => {
      if (condition(input)) {
        return await step(input); // Si la condición se cumple, ejecuta el paso
      }
      return input;  // Si no se cumple, pasa el input sin modificarlo
    });
    return this;
  }
}
