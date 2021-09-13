
export interface Config {
  type?: string;
  pkg?: string;
  host?: string;
  port?: number;
  database?: number;
  namespace?: string | string[];
  looping?: boolean;
  options?: any;
  scanCount?: number;
}