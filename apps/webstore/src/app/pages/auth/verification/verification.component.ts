import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../shared/services/authentication/auth.service';
@Component({
  selector: 'webstore-verification',
  templateUrl: './verification.component.html',
  styleUrls: [
    './verification.component.css',
    '../../../../assets/styles/tc-input-field.scss',
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
      (response) => {
        this.isVerificationSuccessful = true;
        this.isLoading = false;
      },
      (err) => {
        console.error(err);
        this.isLoading = false;
        this.isVerificationSuccessful = false;
      }
    );
  }
}
