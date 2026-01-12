export interface ModuleCheckResult {
  moduleName: string;
  item: string;
  issue: string;
  status: 'ok' | 'warning' | 'error';
}