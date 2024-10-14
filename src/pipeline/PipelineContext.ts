export interface PipelineContext<T> {
  initialInput: T;
  data: Record<string, any>;
  pauseSpinner: () => void;
  resumeSpinner: () => void;
  successSpinner: (message: string) => void;
  failSpinner: (message: string) => void;
}