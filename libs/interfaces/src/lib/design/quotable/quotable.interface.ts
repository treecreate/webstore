import { QuotableDesignEnum } from '@assets';
import { DesignFontEnum } from '..';

export interface IQoutable {
  font: DesignFontEnum;
  fontSize: number;
  designSrc: string;
  text?: string;
}
