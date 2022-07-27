import { IBase } from '../util';

export interface IEvent extends IBase {
  eventId: string;
  name: string;
  userId: string;
}
