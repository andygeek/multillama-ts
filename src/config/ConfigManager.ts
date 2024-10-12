import { Options as OraOptions } from 'ora';  // Importa el tipo de opciones desde ora

export interface ModelConfig {
  name: string;
  defaultRole: { role: string; content: string };
  stream?: boolean;
}

export interface SpinnerConfig {
  loadingMessage: string;
  successMessage: string;
  errorMessage: string;
  spinnerType?: OraOptions;
}

export interface Config {
  models: Record<string, ModelConfig>;
  spinnerConfig?: SpinnerConfig;
}

class ConfigManager {
  private static instance: ConfigManager;
  private config: Config | null = null;

  private constructor() {}

  public static initialize(config: Config): void {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    ConfigManager.instance.config = config;
  }

  public static getConfig(): Config {
    if (!ConfigManager.instance || !ConfigManager.instance.config) {
      throw new Error('ConfigManager has not been initialized.');
    }
    return ConfigManager.instance.config;
  }

  public static getModelConfig(modelName: string): ModelConfig {
    const config = ConfigManager.getConfig();
    const modelConfig = config.models[modelName];
    if (!modelConfig) {
      throw new Error(`Model ${modelName} is not configured.`);
    }
    return modelConfig;
  }

  public static getSpinnerConfig(): SpinnerConfig | undefined {
    const config = ConfigManager.getConfig();
    return config.spinnerConfig;
  }
}

export default ConfigManager;
