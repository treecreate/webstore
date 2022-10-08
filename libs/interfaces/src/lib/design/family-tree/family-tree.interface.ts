import { IDraggableBox, IFamilyTreeBanner } from '.';
import { DesignFontEnum } from '..';

// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { TreeDesignEnum } from '@assets';

export interface IFamilyTree {
  font: DesignFontEnum;
  backgroundTreeDesign: TreeDesignEnum;
  boxSize: number;
  banner: IFamilyTreeBanner;
  boxes: IDraggableBox[];
}
export interface ITemplateFamilyTree {
  name: string;
  title: string;
  designProperties: IFamilyTree;
}
