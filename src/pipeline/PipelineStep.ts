import { PipelineContext } from './PipelineContext.js';

export type PipelineStep<T> = (
  input: T,
  context: PipelineContext<T>,
) => Promise<T>;
