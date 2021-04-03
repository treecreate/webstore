import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'webstore-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css', './home.component.mobile.css'],
})
export class HomeComponent implements OnInit {
  title="homeComponent"
  
  constructor() {}

  ngOnInit(): void {}
}
