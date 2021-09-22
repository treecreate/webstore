import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'webstore-change-password-modal',
  templateUrl: './change-password-modal.component.html',
  styleUrls: [
    './change-password-modal.component.css',
    '../../../../../assets/styles/modals.css',
    '../../../../../assets/styles/tc-input-field.scss',
  ],
})
export class ChangePasswordModalComponent implements OnInit {
  changePasswordForm: FormGroup;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    this.changePasswordForm = new FormGroup({
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[A-Za-zd].{8,}'),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[A-Za-zd].{8,}'),
      ]),
    });
  }

  isEnabled() {
    return this.changePasswordForm.valid && this.passwordsMatch();
  }

  passwordsMatch() {
    return (
      this.changePasswordForm.get('password').value ===
      this.changePasswordForm.get('confirmPassword').value
    );
  }

  changePassword() {
    console.log('test');
  }
}
