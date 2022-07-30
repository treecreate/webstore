import { IBase } from '../util';

export interface IErrorlog extends IBase {
  errorLogId: string;
  name: string;
  userId: string;
  browser: string;
  produciton: boolean;
  url: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
}
