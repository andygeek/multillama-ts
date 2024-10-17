import { PipelineStep } from './PipelineStep.js';

export interface PipelineNode<T, K extends string | number = any> {
  step: PipelineStep<T>;
  branches?: Map<T, PipelineNode<T, K>>;
  nextNode?: PipelineNode<T, K>;
}
