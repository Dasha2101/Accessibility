export type CheckStatus = 'ok' | 'warning' | 'error';
export type WcagLevel = 'A' | 'AA' | 'AAA';

export interface ModuleCheckResult {
  moduleName: string;
  item: string;
  issue: string;
  status: CheckStatus;
  wcagLvl?: WcagLevel;
}