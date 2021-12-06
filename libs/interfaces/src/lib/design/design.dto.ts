import { DesignTypeEnum } from './design-type.enum';
import { IFamilyTree } from './design.interface';

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
