import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'webstore-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor() {
  }

  backetItemOptions(amount:Number) : string {
    if(amount===0){
      return "Basket empty";
    } else {
      return '(' + amount + ') products ';
    }
  };
  

  ngOnInit(): void {
  }

}
