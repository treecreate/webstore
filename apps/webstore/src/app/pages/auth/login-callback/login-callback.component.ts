import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OktaAuthService } from '@okta/okta-angular';

interface Feedback {
  success: boolean | undefined;
  heading: string;
  summary: string;
}

@Component({
  templateUrl: './login-callback.component.html',
  styleUrls: ['./login-callback.component.less'],
})
export class LoginCallbackComponent implements OnInit {
  feedback: Feedback = {
    success: undefined,
    heading: 'Loading...',
    summary: 'We are processing your request.',
  };

  constructor(private oktaAuth: OktaAuthService, private router: Router) {}

  // === Lifecycle methods ===
  async ngOnInit(): Promise<void> {
    if (this.oktaAuth.isLoginRedirect()) {
      // login redirect flow
      try {
        this.feedback = {
          success: true,
          heading: 'Great success!',
          summary: 'We are redirecting you to the dashboard...',
        };

        await this.oktaAuth.handleLoginRedirect();
      } catch (error) {
        // handle the error
        this.feedback = {
          success: false,
          heading: 'Access Denied',
          summary: error.errorSummary,
        };
        throw new Error(error);
      }
    } else {
      // normal app flow
      this.router.navigate(['/login'], { replaceUrl: true });
    }
  }
}
