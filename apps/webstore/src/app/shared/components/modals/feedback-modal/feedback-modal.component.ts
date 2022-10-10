import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'webstore-feedback-modal',
  templateUrl: './feedback-modal.component.html',
  styleUrls: [
    './feedback-modal.component.css',
    '../../../../../assets/styles/modals.css',
    '../../../../../assets/styles/tc-input-field.scss',
  ],
})
export class FeedbackModalComponent implements OnInit {
  title = 'FeedbackModal';
  feedbackForm: UntypedFormGroup;
  isLoading = false;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    this.initForm();
    return;
  }

  initForm() {
    this.feedbackForm = new UntypedFormGroup({
      customerEmail: new UntypedFormControl('', [Validators.required, Validators.email]),
      description: new UntypedFormControl('', [
        Validators.maxLength(1000),
        Validators.minLength(1),
        Validators.required,
      ]),
    });
  }

  submitFeedback(): void {
    // TODO - implement feedback submission
    // TODO - add event log
    console.warn(`TODO - not implemented`);
    this.feedbackForm.reset();
    this.activeModal.close();
  }

  isDisabled(): boolean {
    return this.feedbackForm.dirty && this.feedbackForm.valid;
  }
}
