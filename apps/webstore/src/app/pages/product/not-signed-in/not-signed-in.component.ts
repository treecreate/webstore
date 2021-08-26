import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'webstore-not-signed-in',
  templateUrl: './not-signed-in.component.html',
  styleUrls: ['./not-signed-in.component.css'],
})
export class NotSignedInComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    console.log('');
  }
}
