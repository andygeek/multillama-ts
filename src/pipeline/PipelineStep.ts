import { PipelineContext } from './PipelineContext.js';

export type PipelineStep<T, K extends string | number = any> = (
  input: T,
  context: PipelineContext<T>,
) => Promise<T>;
