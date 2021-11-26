import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'webstore-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  isLoading = false;

  constructor() {}

  ngOnInit(): void {
    // TODO: Initiate form
  }

  submitLogin() {
    this.isLoading = true;
    // TODO: add login functionality
  }
}
