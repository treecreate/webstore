import { IUser } from '../user';
import { DesignTypeEnum } from './design-type.enum';
import { ComponentRef } from '@angular/core';

export interface IDesign {
  designId: string;
  designProperties: IDesignProperties;
  designType: DesignTypeEnum;
  user: IUser;
}

export interface IDesignProperties {
  properties: IFamilyTree;
}

export interface IFamilyTree {
  title: string;
  font: FamilyTreeFontEnum;
  design: FamilyTreeDesignEnum;
  boxSize: number;
  banner: boolean | IFamilyTreeBanner;
  largeFont: boolean;
  boxes: IDraggableBox[];
}

export interface IDraggableBox {
  x: number;
  y: number;
  previousX: number;
  previousY: number;
  width: number;
  height: number;
  dragging: boolean;
  boxDesign: HTMLImageElement;
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

export enum FamilyTreeDesignEnum {
  first,
  second,
}

export interface IFamilyTreeBanner {
  text: string;
  style: 'first';
}
