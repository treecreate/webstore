import { TreeDesignEnum } from '@assets';
import { IDraggableBox, IFamilyTreeBanner } from '.';
import { DesignFontEnum } from '..';

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