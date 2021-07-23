import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'webstore-forgot-password-modal',
  templateUrl: './forgot-password-modal.component.html',
  styleUrls: [
    './forgot-password-modal.component.css',
    '../../../../../assets/styles/modals.css',
    '../../../../../assets/styles/tc-input-field.scss',
  ],
})
export class ForgotPasswordModalComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  @ViewChild('messageSent') messageSent: ElementRef;

  constructor(public activeModal: NgbActiveModal, private router: Router) {}

  ngOnInit(): void {
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl('', [Validators.email, Validators.required]),
    });
  }

  resetPassword() {
    this.router.navigate(['/resetPassword']);
    // console.log(this.forgotPasswordForm.get('email').value);
    // this.showMessageSent();
    // setTimeout(() => {
    //   this.activeModal.close();
    // }, 3000);
  }

  showMessageSent() {
    console.log('gets here');
    this.messageSent.nativeElement.classList.remove('alert-hide');
    setTimeout(() => {
      this.messageSent.nativeElement.classList.add('alert-hide');
    }, 3000);
  }

  isDisabled(): boolean {
    if (this.forgotPasswordForm.get('email').invalid) {
      return true;
    } else {
      return false;
    }
  }
}
