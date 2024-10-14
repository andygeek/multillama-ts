import { PipelineContext } from './PipelineContext.js';

export type ConditionFunction<T, K extends string | number = any> = (
  input: T,
  context: PipelineContext<T>,
) => Promise<K> | K;