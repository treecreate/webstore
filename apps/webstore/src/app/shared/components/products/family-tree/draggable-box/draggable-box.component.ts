import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { BoxOptionsDesignEnum } from '@assets';
import { LocalStorageService } from '@local-storage';
import { LocaleType, LocalStorageVars } from '@models';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'webstore-draggable-box',
  templateUrl: './draggable-box.component.html',
  styleUrls: ['./draggable-box.component.css'],
})
export class DraggableBoxComponent {
  @ViewChild('draggableBoxInput')
  input: ElementRef;

  @Input()
  backgroundImageUri: string;

  @Input()
  boxOptionDimensions: {
    width: number;
    height: number;
  };

  textWidthCalculationCanvas;

  @Input()
  optionButtonOffset: { dragX: number; dragY: number; closeX: number; closeY: number };

  @Input()
  x: number;

  @Input()
  y: number;

  @Input()
  zIndex: number;

  @Input()
  width: number;

  @Input()
  height: number;

  @Input()
  font: string;

  @Input()
  text: string;

  @Input()
  maxCharsPerLine = 12;

  @Input()
  maxLines = 2;

  private _boxSize;

  @Output()
  mousedownEvent = new EventEmitter();
  @Output()
  mouseupEvent = new EventEmitter();
  @Output()
  touchmoveEvent = new EventEmitter();
  @Output()
  touchstartEvent = new EventEmitter();
  @Output()
  touchendEvent = new EventEmitter();
  @Output()
  newTextValue = new EventEmitter<string>();

  fontSize = 1;

  boxOptionsDesignEnum = BoxOptionsDesignEnum;

  // get locale to determine what language to display the toast in
  public locale$: BehaviorSubject<LocaleType>;
  public localeCode: LocaleType;
  constructor(private localStorageService: LocalStorageService) {
    this.locale$ = this.localStorageService.getItem<LocaleType>(LocalStorageVars.locale);
    this.localeCode = this.locale$.getValue();
  }

  isEnglish() {
    return this.localeCode === LocaleType.en;
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown($event) {
    this.mousedownEvent.emit($event);
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp($event) {
    this.mouseupEvent.emit($event);
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove($event) {
    this.touchmoveEvent.emit($event);
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart($event) {
    this.touchstartEvent.emit($event);
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd($event) {
    this.touchendEvent.emit($event);
  }

  onInputChange($event) {
    this.text = $event;
    this.newTextValue.emit($event);
  }

  public get boxSize() {
    return this._boxSize;
  }
  public set boxSize(boxSize: number) {
    this._boxSize = boxSize;
    // fancy math to make the value scale well with box size. Source of values: https://www.dcode.fr/function-equation-finder
    this.fontSize = 0.05 * this.boxSize + 0.05;
  }

  /**
   * Get screen width of the text input element, in pixels.
   * @returns screen width of the text input element, in pixels.
   */
  public calculateInputWidth(): number {
    return this.width * 0.7;
  }

  /**
   * Get screen height of the text input element, in pixels. Depends on amount of text in the input.
   * @returns screen height of the text input element, in pixels
   */
  public calculateInputHeight(): number {
    if (this.getTextWidth(this.text, this.getCanvasFontSize()) > 120) {
      return this.height * 0.5;
    } else {
      return this.height * 0.3;
    }
  }

  /**
   * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
   *
   * @param {String} text The text to be rendered.
   * @param {String} font The css font descriptor that text is to be rendered with (e.g. "bold 14px verdana").
   *
   * @see https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
   */
  private getTextWidth(text: string, font: string): number {
    // re-use canvas object for better performance
    if (this.textWidthCalculationCanvas === undefined) {
      this.textWidthCalculationCanvas = document.createElement('canvas');
    }
    const context = this.textWidthCalculationCanvas.getContext('2d');
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width;
  }

  /**
   * Get css properties of the given html element.
   * @param element html element, for example canvas.
   * @param prop name of a css property to get values from.
   * @returns
   */
  private getCssStyle(element: HTMLElement, prop: string): string {
    return window.getComputedStyle(element, null).getPropertyValue(prop);
  }

  /**
   * Get font information of the given html element.
   * @param el html element, optional. Defaults to document.body.
   * @returns font information formatted as a css font string `${fontWeight} ${fontSize} ${fontFamily}`
   */
  private getCanvasFontSize(el = document.body): string {
    const fontWeight = this.getCssStyle(el, 'font-weight') || 'normal';
    const fontSize = this.getCssStyle(el, 'font-size') || '16px';
    const fontFamily = this.getCssStyle(el, 'font-family') || 'Times New Roman';

    return `${fontWeight} ${fontSize} ${fontFamily}`;
  }
}
