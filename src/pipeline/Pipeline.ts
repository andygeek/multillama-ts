// src/pipeline/Pipeline.ts

import ora, { Ora } from 'ora';
import { ConfigManager, SpinnerConfig } from '../config/ConfigManager.js';

export interface PipelineContext<T> {
  initialInput: T;
  data: Record<string, any>;
  pauseSpinner: () => void;
  resumeSpinner: () => void;
  successSpinner: (message: string) => void;
  failSpinner: (message: string) => void;
}

export type PipelineStep<T, K extends string | number = any> = (
  input: T,
  context: PipelineContext<T>,
) => Promise<T>;

export type ConditionFunction<T, K extends string | number = any> = (
  input: T,
  context: PipelineContext<T>,
) => Promise<K> | K;

interface PipelineNode<T, K extends string | number = any> {
  step: PipelineStep<T, K>;
  condition?: ConditionFunction<T, K>;
  branches?: Map<K, PipelineNode<T, K>>;
  nextNode?: PipelineNode<T, K>; // Para pasos secuenciales sin condición
}

export class Pipeline<T, K extends string | number = any> {
  private initialNode?: PipelineNode<T, K>;
  private enableLogging: boolean = false;
  private spinnerConfig?: SpinnerConfig;
  private spinner?: Ora;

  constructor() {
    this.spinnerConfig = ConfigManager.getSpinnerConfig();
  }

  public setEnableLogging(enable: boolean): void {
    this.enableLogging = enable;
  }

  public addStep(
    step: PipelineStep<T, K>,
    condition?: ConditionFunction<T, K>,
  ): PipelineNode<T, K> {
    const node: PipelineNode<T, K> = { step, condition, branches: new Map() };
    if (!this.initialNode) {
      this.initialNode = node;
    }
    return node;
  }

  public addBranch(
    node: PipelineNode<T, K>,
    conditionValue: K,
    nextNode: PipelineNode<T, K>,
  ): void {
    if (!node.branches) {
      node.branches = new Map();
    }
    node.branches.set(conditionValue, nextNode);
  }

  public async execute(initialInput: T): Promise<T> {
    if (!this.initialNode) {
      throw new Error('El pipeline no tiene pasos definidos.');
    }

    // Iniciar el spinner si está configurado
    this.startSpinner(this.spinnerConfig?.loadingMessage || 'Ejecutando pipeline...');

    // Crear el contexto
    const context: PipelineContext<T> = {
      initialInput,
      data: {},
      pauseSpinner: this.pauseSpinner.bind(this),
      resumeSpinner: this.resumeSpinner.bind(this),
      successSpinner: this.successSpinner.bind(this),
      failSpinner: this.failSpinner.bind(this),
    };

    try {
      const result = await this.executeNode(this.initialNode, initialInput, context);

      // Detener el spinner con mensaje de éxito
      this.successSpinner(this.spinnerConfig?.successMessage || 'Pipeline completado con éxito.');

      return result;
    } catch (error) {
      // Detener el spinner con mensaje de error
      this.failSpinner(this.spinnerConfig?.errorMessage || 'Error en el pipeline.');

      throw error;
    }
  }

  private async executeNode(
    node: PipelineNode<T, K>,
    input: T,
    context: PipelineContext<T>,
  ): Promise<T> {
    if (this.enableLogging) {
      console.log(`Ejecutando paso con entrada: ${input}`);
    }

    // Actualizar el spinner para el paso actual
    this.updateSpinner(`Ejecutando paso...`);

    const result = await node.step(input, context);

    if (node.condition && node.branches) {
      const conditionResult = await node.condition(result, context);
      const nextNode = node.branches.get(conditionResult);
      if (nextNode) {
        return await this.executeNode(nextNode, result, context);
      } else {
        throw new Error(
          `No se encontró una rama para el resultado de la condición: ${conditionResult}`,
        );
      }
    } else if (node.nextNode) {
      // Si hay un paso secuencial siguiente
      return await this.executeNode(node.nextNode, result, context);
    } else {
      // Fin del pipeline
      return result;
    }
  }

  private startSpinner(message: string): void {
    if (this.spinnerConfig) {
      this.spinner = ora({
        text: message,
        spinner: 'dots',
      }).start();
    }
  }

  private updateSpinner(message: string): void {
    if (this.spinner) {
      this.spinner.text = message;
    }
  }

  private pauseSpinner(): void {
    if (this.spinner) {
      this.spinner.stop();
    }
  }

  private resumeSpinner(): void {
    if (this.spinner) {
      this.spinner.start();
    }
  }

  private successSpinner(message: string): void {
    if (this.spinner) {
      this.spinner.succeed(message);
      this.spinner = undefined;
    }
  }

  private failSpinner(message: string): void {
    if (this.spinner) {
      this.spinner.fail(message);
      this.spinner = undefined;
    }
  }
}
