import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ForgotPasswordModalComponent } from '../../../shared/components/modals/forgot-password-modal/forgot-password-modal.component';

@Component({
  selector: 'webstore-login',
  templateUrl: './login.component.html',
  styleUrls: [
    './login.component.css',
    '../../../../assets/styles/tc-input-field.scss',
  ],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  @ViewChild('successfulLogin') successfulLogin: ElementRef;

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  onLogin() {
    console.log(
      this.loginForm.get('email').value,
      this.loginForm.get('password').value
    );
    this.showSuccessfulLogin();
  }

  showSuccessfulLogin() {
    this.successfulLogin.nativeElement.classList.remove('alert-hide');
    setTimeout(() => {
      this.successfulLogin.nativeElement.classList.add('alert-hide');
    }, 3000);
  }

  openForgotPasswordModal() {
    this.modalService.open(ForgotPasswordModalComponent);
  }

  isDisabled(): boolean {
    if (
      this.loginForm.get('email').invalid ||
      this.loginForm.get('password').invalid
    ) {
      return true;
    } else {
      return false;
    }
  }
}
