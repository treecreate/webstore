import { IUser } from '../user';
import { DesignTypeEnum } from './design-type.enum';
import { ComponentRef } from '@angular/core';
import { Tree1BoxDesignEnum, TreeDesignEnum } from '@assets';

export interface IDesign {
  designId: string;
  designProperties: IFamilyTree;
  designType: DesignTypeEnum;
  user: IUser;
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
  boxDesign: Tree1BoxDesignEnum;
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
