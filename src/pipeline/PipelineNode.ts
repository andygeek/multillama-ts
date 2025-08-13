import { PipelineStep } from './PipelineStep.js';

export interface PipelineNode<T> {
  step: PipelineStep<T>;
  branches?: Map<T, PipelineNode<T>>;
  nextNode?: PipelineNode<T>;
}
