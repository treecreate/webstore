import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ErrorlogPriorityEnum } from '@interfaces';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorlogsService } from '../../../services/errorlog/errorlog.service';
import { EventsService } from '../../../services/events/events.service';
import { FeedbackService } from '../../../services/feedback/feedback.service';
import { ToastService } from '../../toast/toast-service';

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

  constructor(
    private feedbackService: FeedbackService,
    public activeModal: NgbActiveModal,
    private toastService: ToastService,
    private eventsService: EventsService,
    private errorlogsService: ErrorlogsService
  ) {}

  ngOnInit(): void {
    this.initForm();
    return;
  }

  initForm() {
    this.feedbackForm = new UntypedFormGroup({
      customerEmail: new UntypedFormControl('', [Validators.email]),
      description: new UntypedFormControl('', [
        Validators.maxLength(1000),
        Validators.minLength(1),
        Validators.required,
      ]),
    });
  }

  submitFeedback(): void {
    this.feedbackService
      .registerFeedback({
        email: this.feedbackForm.get('customerEmail').value ? this.feedbackForm.get('customerEmail').value : undefined,
        description: this.feedbackForm.get('description').value,
      })
      .subscribe({
        next: () => {
          this.isLoading = false;
          // TODO - add danish feedback response
          this.toastService.showAlert('Thank you for your feedback', '', 'success', 10000);
          this.eventsService.create(`webstore.feedback-modal.feedback-registered`);
          this.feedbackForm.reset();
          this.activeModal.close();
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading = false;
          console.error('Failed to submit custom order request', error);
          this.errorlogsService.create(
            'webstore.feedback-modal.register-feedback-failed',
            ErrorlogPriorityEnum.critical,
            error
          );
          // TODO - add danish version of feedback error
          this.toastService.showAlert('Failed to submit your feedback, please try again', '.', 'danger', 20000);
        },
      });
  }

  isDisabled(): boolean {
    return this.feedbackForm.dirty && this.feedbackForm.valid;
  }
}
