import { IQoutable } from '.';
import { DesignTypeEnum } from './design-type.enum';
import { IFamilyTree } from './family-tree';

export interface UpdateDesignRequest {
  designId: string;
  designProperties: IFamilyTree | IQoutable;
  designType: DesignTypeEnum;
}

export interface CreateDesignRequest {
  designProperties: IFamilyTree | IQoutable;
  designType: DesignTypeEnum;
  mutable: boolean;
}
