import { DesignTypeEnum } from './design-type.enum';
import { IFamilyTree } from './family-tree';

export interface UpdateDesignRequest {
  designId: string;
  designProperties: IFamilyTree;
  designType: DesignTypeEnum;
}

export interface CreateDesignRequest {
  designProperties: IFamilyTree;
  designType: DesignTypeEnum;
  mutable: boolean;
}
