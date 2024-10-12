export type PipelineStep<T> = (stepResult: T) => Promise<T>;

export class Pipeline<T = string> {
  private steps: PipelineStep<T>[] = [];

  public addStep(step: PipelineStep<T>): this {
    this.steps.push(step);
    return this;
  }

  public async execute(initialInput: T): Promise<T> {
    let result = initialInput;
    for (const step of this.steps) {
      result = await step(result);
    }
    return result;
  }
}
