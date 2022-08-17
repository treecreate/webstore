import { IQoutable } from '.';
import { DesignTypeEnum, IBase, IUser } from '..';
import { IFamilyTree } from './family-tree';

export interface IDesign extends IBase {
  designId: string;
  designProperties: IFamilyTree | IQoutable;
  designType: DesignTypeEnum;
  user: IUser;
  mutable: boolean;
}
