import { ComponentRef } from '@angular/core';
import { BoxDesignEnum, TreeDesignEnum } from '@assets';
import { DesignTypeEnum, IBase, IUser } from '..';

export interface IDesign extends IBase {
  designId: string;
  designProperties: IFamilyTree;
  designType: DesignTypeEnum;
  user: IUser;
  mutable: boolean;
}
export interface IFamilyTree {
  title: string;
  font: FamilyTreeFontEnum;
  backgroundTreeDesign: TreeDesignEnum;
  boxSize: number;
  banner: IFamilyTreeBanner;
  largeFont: boolean;
  boxes: IDraggableBox[];
}

export interface IDraggableBox {
  x: number;
  y: number;
  previousX: number;
  previousY: number;
  dragging: boolean;
  boxDesign: BoxDesignEnum;
  // can't declare the actual component so the ref is any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inputRef?: ComponentRef<any>;
  text: string;
}

export enum FamilyTreeFontEnum {
  timesNewRoam = 'Times new roman',
  roboto = 'Roboto',
  georgia = 'Georgia',
  shareTech = 'Share Tech',
  spectral = 'Spectral',
  sansita = 'Sansita',
}

export interface IFamilyTreeBanner {
  text: string;
  style: 'first';
}
