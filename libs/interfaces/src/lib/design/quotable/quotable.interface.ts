import { DesignFontEnum, QuotableTypeEnum } from '..';

export interface IQoutable {
  font: DesignFontEnum;
  fontSize: number;
  designSrc: string;
  title?: string;
  showTitle?: boolean;
  text?: string;
  showText?: boolean;
  verticalPlacement?: number;
}

export interface IQuotableTemplate {
  name: string;
  type: QuotableTypeEnum;
  designProps: IQoutable;
}
