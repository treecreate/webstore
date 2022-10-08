import { ComponentRef } from '@angular/core';
import { BoxDesignEnum } from '@assets';

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
