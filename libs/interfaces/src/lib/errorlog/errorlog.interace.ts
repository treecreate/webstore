import { IBase } from '../util';
import { ErrorlogPriorityEnum } from './errorlog-priority.enum';

export interface IErrorlog extends IBase {
  errorLogId: string;
  name: string;
  userId: string;
  browser: string;
  produciton: boolean;
  url: string;
  priority: ErrorlogPriorityEnum;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
}
