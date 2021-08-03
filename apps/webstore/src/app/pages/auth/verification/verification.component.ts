import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'webstore-verification',
  templateUrl: './verification.component.html',
  styleUrls: [
    './verification.component.css',
    '../../../../assets/styles/tc-input-field.scss',
  ],
})
export class VerificationComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    console.log('verification innit');
  }
}
