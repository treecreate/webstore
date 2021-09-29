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

@Component({
  selector: 'webstore-draggable-box',
  templateUrl: './draggable-box.component.html',
  styleUrls: ['./draggable-box.component.css'],
})
export class DraggableBoxComponent implements AfterViewInit {
  // NOTE: The purpose of this component is to provide a way to easily track user inputs.
  // The text written in the input here is not actually displayed on the page
  // The input box size still has to scale well so the mouse is caught properly

  @ViewChild('draggableBoxInput')
  input: ElementRef;

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

  constructor() {}

  ngAfterViewInit(): void {
    console.log('box created', this);
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
