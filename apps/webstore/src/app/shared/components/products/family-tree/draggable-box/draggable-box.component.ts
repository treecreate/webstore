import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { BoxOptionsDesignEnum } from '@assets';
import { LocalStorageService } from '@local-storage';
import { LocaleType, LocalStorageVars } from '@models';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'webstore-draggable-box',
  templateUrl: './draggable-box.component.html',
  styleUrls: ['./draggable-box.component.css'],
})
export class DraggableBoxComponent implements AfterViewInit {
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
  isMutable = false;

  @Input()
  showOptionButtons = false;

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
  fontSize: number;

  @Input()
  text: string;

  @Input()
  maxCharsPerLine = 12;

  @Input()
  maxLines = 2;

  // NOTE - magic number. Represents how "wide" given text is based on the font. Used to figure out when text becomes more than one line
  maxWidthOfText = 160;
  singleLineInputHeight = 0.3;
  multiLineInputHeight = 0.5;

  textareaHeight = 0;

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
  @Output()
  boxInitComplete = new EventEmitter();

  boxOptionsDesignEnum = BoxOptionsDesignEnum;

  // get locale to determine what language to display the toast in
  public locale$: BehaviorSubject<LocaleType>;
  public localeCode: LocaleType;
  constructor(private localStorageService: LocalStorageService) {
    this.locale$ = this.localStorageService.getItem<LocaleType>(LocalStorageVars.locale);
    this.localeCode = this.locale$.getValue();
  }

  /**
   * Adjust input height to match its contents.
   */
  ngAfterViewInit() {
    setTimeout(() => (this.textareaHeight = this.input.nativeElement.scrollHeight), 100);
    this.boxInitComplete.emit();
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

  /**
   * Adjusts input height and propagates the text change to any listener (family tree design listener)
   * @param $event
   */
  onInputChange($event): void {
    this.adjustInputHeight();
    this.text = $event;
    this.newTextValue.emit($event);
  }

  /**
   * Adjust height of the input element to match its contents and amount fo rows. Based on the scroll height.
   */
  adjustInputHeight(): void {
    if (this.input !== undefined && this.input.nativeElement !== undefined) {
      this.input.nativeElement.style.height = '0px';
      this.textareaHeight = this.input.nativeElement.scrollHeight;
      this.input.nativeElement.style.height = this.textareaHeight + 'px';
    }
  }

  public get boxSize() {
    return this._boxSize;
  }

  /**
   * Update the box size property and reclaulcate the font size and input height.
   */
  public set boxSize(boxSize: number) {
    this._boxSize = boxSize;
    this.adjustInputHeight();
  }

  /**
   * Get screen width of the text input element, in pixels.
   * @returns screen width of the text input element, in pixels.
   */
  public calculateInputWidth(): number {
    return this.width * 0.7;
  }
}
