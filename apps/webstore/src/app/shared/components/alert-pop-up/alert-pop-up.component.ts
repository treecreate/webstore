import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'webstore-alert-pop-up',
  templateUrl: './alert-pop-up.component.html',
  styleUrls: ['./alert-pop-up.component.css'],
})
export class AlertPopUpComponent implements OnInit {
  @Input() message: string;
  @Input() type: string;
  @Input() time: number; //in milliseconds
  @ViewChild('alertElement') alertElement: ElementRef;

  constructor() {}

  ngOnInit(): void {
    console.log('start');
    setTimeout(() => {
      this.alertElement.nativeElement.classList.add('alert-hide');
      console.log('end');
    }, this.time);
  }
}
