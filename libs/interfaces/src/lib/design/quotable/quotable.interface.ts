import { DesignFontEnum, QuotableType } from '..';

export interface IQoutable {
  font: DesignFontEnum;
  fontSize: number;
  designSrc: string;
  title?: string;
  showTitle?: boolean;
  text?: string;
  showText?: boolean;
}

export interface IQuotableTemplate {
  name: string;
  title?: string;
  showTitle?: boolean;
  text?: string;
  showText?: boolean;
  fontSize: number;
  type: QuotableType;
}
