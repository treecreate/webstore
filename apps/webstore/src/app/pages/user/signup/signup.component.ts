import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TermsOfUseModalComponent } from '../../../shared/components/modals/terms-of-use-modal/terms-of-use-modal.component';
@Component({
  selector: 'webstore-signup',
  templateUrl: './signup.component.html',
  styleUrls: [
    './signup.component.css',
    '../../../../assets/styles/tc-input-field.scss',
  ],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup | any;
  termsAndConditions: boolean;

  constructor(private router: Router, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });

    this.signupForm.valueChanges.subscribe(console.log);
  }

  onSignup() {
    console.log(this.matchingPasswords());
    console.log(this.signupForm.get('email').value);
  }

  matchingPasswords(): boolean {
    if (
      this.signupForm.get('password').value ===
      this.signupForm.get('confirmPassword').value
    ) {
      return true;
    } else {
      return false;
    }
  }

  isDisabled(): boolean {
    if (
      this.signupForm.get('email').invalid ||
      this.signupForm.get('password').invalid ||
      this.signupForm.get('confirmPassword').invalid
    ) {
      return true;
    } else {
      return false;
    }
  }

  loginLink() {
    this.router.navigate(['/login']);
  }

  showTermsOfUse() {
    this.modalService.open(TermsOfUseModalComponent, { size: 'lg' });
  }
}
