import {
  AfterViewInit,
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'webstore-draggable-box',
  templateUrl: './draggable-box.component.html',
  styleUrls: ['./draggable-box.component.css'],
})
export class DraggableBoxComponent implements AfterViewInit {
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
}
