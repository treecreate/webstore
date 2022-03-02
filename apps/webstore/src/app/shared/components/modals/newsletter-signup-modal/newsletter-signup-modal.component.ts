import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NewsletterService } from '../../../services/order/newsletter/newsletter.service';

@Component({
  selector: 'webstore-newsletter-signup-modal',
  templateUrl: './newsletter-signup-modal.component.html',
  styleUrls: ['./newsletter-signup-modal.component.scss'],
})
export class NewsletterSignupModalComponent implements OnInit {
  newsletterSignupModalForm: FormGroup;
  isLoading = false; 

  constructor(
    public activeModal: NgbActiveModal,
    private newsletterService: NewsletterService
  ) {
    this.newsletterSignupModalForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    })
  }

  ngOnInit(): void {

  }

  submit() {
    const email: string = this.newsletterSignupModalForm.get('email').value;
    if (email) {
      this.newsletterService.registerNewsletterEmail(email);
    }
  }
}
