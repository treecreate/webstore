import { TreeDesignEnum } from '@assets';
import { FamilyTreeFontEnum, IDraggableBox, IFamilyTreeBanner } from '.';

export interface IFamilyTree {
  font: FamilyTreeFontEnum;
  backgroundTreeDesign: TreeDesignEnum;
  boxSize: number;
  banner: IFamilyTreeBanner;
  boxes: IDraggableBox[];
}
