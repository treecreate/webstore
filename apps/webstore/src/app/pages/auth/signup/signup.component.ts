import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  signupForm: FormGroup;
  termsAndConditions = false;

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
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

    // Only for testing
    // this.signupForm.valueChanges.subscribe(console.log);
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
      this.signupForm.get('confirmPassword').invalid ||
      !this.termsAndConditions ||
      !this.matchingPasswords()
    ) {
      return true;
    } else {
      return false;
    }
  }

  showTermsOfUse() {
    this.modalService.open(TermsOfUseModalComponent, { size: 'lg' });
  }
}
