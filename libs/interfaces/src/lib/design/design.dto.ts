import { DesignTypeEnum } from './design-type.enum';
import { IFamilyTree } from './design.interface';

export class UpdateDesignRequest {
  designId: string;
  designProperties: IFamilyTree;
  designType: DesignTypeEnum;
}

export class CreateDesignRequest {
  designProperties: IFamilyTree;
  designType: DesignTypeEnum;
}
