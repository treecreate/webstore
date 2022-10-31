import { IPetSign, IQoutable } from '.';
import { DesignTypeEnum } from './design-type.enum';
import { IFamilyTree } from './family-tree';

export interface UpdateDesignRequest {
  designId: string;
  designProperties: IFamilyTree | IQoutable | IPetSign;
  designType: DesignTypeEnum;
}

export interface CreateDesignRequest {
  designProperties: IFamilyTree | IQoutable | IPetSign;
  designType: DesignTypeEnum;
  mutable: boolean;
}
