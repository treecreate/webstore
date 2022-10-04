import { DesignFontEnum } from '..';

export interface IQoutable {
  font: DesignFontEnum;
  fontSize: number;
  designSrc: string;
  text?: string;
  titleText?: string;
}

export interface IQuotableTemplate {
  name: string;
  text: string;
  fontSize: number;
}
