export type CheckStatus = 'success' | 'warning' | 'error';
export type WcagLevel = 'A' | 'AA' | 'AAA';

export interface ModuleCheckResult {
  moduleName: string;
  item: string;
  issue: string;
  status: CheckStatus;
  wcagLvl?: WcagLevel;
}

export type Limits = {
  contrast: number;
  keyboard: number;
  structure: number;
  scalability: number;
  media: number;
  alt?: number;
  aria?: number;
};

export type CheckOptions = {
  maxElements?: number;
  limits?: Limits;
};
