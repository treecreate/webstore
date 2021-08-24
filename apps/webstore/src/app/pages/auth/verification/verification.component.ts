import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../shared/services/authentication/auth.service';
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
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.verifyUser(this.route.snapshot.params.token);
  }

  async verifyUser(token: string) {
    this.authService.verifyUser({ token: token }).subscribe(
      () => {
        this.isVerificationSuccessful = true;
        this.isLoading = false;
        this.authService.setIsVerified(true);
      },
      (err: HttpErrorResponse) => {
        console.error(err);
        if (err.status === 400) {
          this.errorMessage = 'The verification token is invalid';
        } else {
          this.errorMessage = err.error.message;
        }
        this.isLoading = false;
        this.isVerificationSuccessful = false;
      }
    );
  }
}
