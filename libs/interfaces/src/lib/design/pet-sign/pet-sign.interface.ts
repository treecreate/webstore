import { DesignFontEnum } from '..';

export interface IPetSign {
  font: DesignFontEnum;
  fontSize: number;
  designSrc: string;
  title?: string;
  showTitle?: boolean;
  text?: string;
  showText?: boolean;
  verticalPlacement?: number;
}

export interface IPetSignTemplate {
  name: string;
  designProps: IPetSign;
}
