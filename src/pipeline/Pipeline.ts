import ora, { Ora } from 'ora';
import { ConfigManager, SpinnerConfig } from '../config/ConfigManager.js';
import { PipelineContext } from './PipelineContext.js';
import { PipelineStep } from './PipelineStep.js';
import { ConditionFunction } from './ConditionFunction.js';
import { PipelineNode } from './PipelineNode.js';

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
      throw new Error('The pipeline has no defined steps.');
    }

    this.startSpinner(this.spinnerConfig?.loadingMessage || 'Running pipeline...');

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

      this.successSpinner(this.spinnerConfig?.successMessage || 'Pipeline completed successfully.');

      return result;
    } catch (error) {
      this.failSpinner(this.spinnerConfig?.errorMessage || 'Error in the pipeline.');

      throw error;
    }
  }

  private async executeNode(
    node: PipelineNode<T, K>,
    input: T,
    context: PipelineContext<T>,
  ): Promise<T> {
    if (this.enableLogging) {
      console.log(`Execute step with input: ${input}`);
    }

    this.updateSpinner(this.spinnerConfig?.loadingMessage || 'Execute step...');

    const result = await node.step(input, context);

    if (node.condition && node.branches) {
      const conditionResult = await node.condition(result, context);
      const nextNode = node.branches.get(conditionResult);
      if (nextNode) {
        return await this.executeNode(nextNode, result, context);
      } else {
        throw new Error(
          `No branch was found for the condition result: ${conditionResult}`,
        );
      }
    } else if (node.nextNode) {
      return await this.executeNode(node.nextNode, result, context);
    } else {
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
