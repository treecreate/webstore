import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VerifyService } from '../../../shared/services/verify/verify.service';

@Component({
  selector: 'webstore-verification',
  templateUrl: './verification.component.html',
  styleUrls: [
    './verification.component.css',
    '../../../../assets/styles/tc-buttons.css',
  ],
})
export class VerificationComponent implements OnInit {
  isLoading: boolean;
  isVerificationSuccessful = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private verifyService: VerifyService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.verifyUser(this.route.snapshot.params.token);
  }

  async verifyUser(token: string) {
    this.verifyService.verifyUser({ token: token }).subscribe(
      () => {
        this.isVerificationSuccessful = true;
        this.isLoading = false;
        this.verifyService.setIsVerified(true);
      },
      (error: HttpErrorResponse) => {
        console.error(error);
        if (error.error.status === 400) {
          this.errorMessage = 'The provided data is invalid';
        } else if (error.error.status === 404) {
          this.errorMessage = 'Provided user was not found';
        } else if (error.error.message === undefined) {
          this.errorMessage = 'Failed to connect to the backend service';
        } else {
          this.errorMessage = error.error.message;
        }
        this.isLoading = false;
        this.isVerificationSuccessful = false;
      }
    );
  }
}
