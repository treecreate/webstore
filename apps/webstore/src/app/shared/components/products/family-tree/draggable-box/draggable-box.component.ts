import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
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
  width: number;

  @Input()
  height: number;

  @Input()
  font: string;

  @Input()
  text: string;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    console.log('box created', this);
    // this.cdr.detectChanges();
  }
}
