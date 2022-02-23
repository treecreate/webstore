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
  // NOTE: The purpose of this component is to provide a way to easily track user inputs.
  // The text written in the input here is not actually displayed on the page
  // The input box size still has to scale well so the mouse is caught properly

  @ViewChild('draggableBoxInput')
  input: ElementRef;

  @Input()
  backgroundImageUri: string;

  @Input()
  boxOptionDimensions: {
    width: number;
    height: number;
  };

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
    this.fontSize = 0.0545 * this.boxSize + 0.05;
  }
}
