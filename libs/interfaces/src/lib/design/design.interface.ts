import { DesignTypeEnum, IBase, IUser } from '..';
import { IFamilyTree } from './family-tree';

export interface IDesign extends IBase {
  designId: string;
  designProperties: IFamilyTree;
  designType: DesignTypeEnum;
  user: IUser;
  mutable: boolean;
}
