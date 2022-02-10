import { UserRoles } from '@models';
import { IBase } from '..';

export interface IRole extends IBase {
  roleId: string;
  name: UserRoles;
}
