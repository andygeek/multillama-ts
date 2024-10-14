import { PipelineStep } from './PipelineStep.js';
import { ConditionFunction } from './ConditionFunction.js';

export interface PipelineNode<T, K extends string | number = any> {
  step: PipelineStep<T, K>;
  condition?: ConditionFunction<T, K>;
  branches?: Map<K, PipelineNode<T, K>>;
  nextNode?: PipelineNode<T, K>;
}
