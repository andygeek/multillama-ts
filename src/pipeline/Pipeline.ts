import { BaseAdapter } from '../adapters/BaseAdapter.js';

export type PipelineStep<I, O> = (input: I, adapter: BaseAdapter<any>, initialMessage: string) => Promise<O>;

export class Pipeline<I = string, O = string> {
  private steps: { step: PipelineStep<any, any>, adapter: BaseAdapter<any> }[] = [];
  private initialMessage: string | null = null;
  private loggingEnabled: boolean = false;

  public enableLogging(): this {
    this.loggingEnabled = true;
    return this;
  }

  public addStep<I, O>(step: PipelineStep<I, O>, adapter: BaseAdapter<any>): this {
    this.steps.push({ step, adapter });
    return this;
  }

  public async execute(initialInput: I): Promise<O> {
    this.initialMessage = typeof initialInput === 'string' ? initialInput : null;
    let result: any = initialInput;

    for (const { step, adapter } of this.steps) {
      try {
        result = await step(result, adapter, this.initialMessage as string);

        if (this.loggingEnabled) {
          console.log(`Step Result:`, result);
        }

      } catch (error) {
        console.error('Error in pipeline step:', error);
        throw error;
      }
    }

    return result;
  }

  public getInitialMessage(): string | null {
    return this.initialMessage;
  }
}
