import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import { LoginDto } from './dto/login.dto';
import {
  SignupDto,
  SignupRequestDto,
  SignupResponse,
  SignupTokenDto,
} from './dto/signup.dto';
import { environment as env } from '../../../../environments/environment';
import {
  PasswordResetDto,
  PasswordResetRequestDto,
  PasswordResetResponse,
} from './dto/password-reset.dto';
import { SendEmailResponse } from './dto/email.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private oktaAuth: OktaAuthService, private http: HttpClient) {}

  // === SIGNUP ===
  async signupRequest(
    signupRequestDto: SignupRequestDto
  ): Promise<SendEmailResponse> {
    return await this.http
      .post<SendEmailResponse>(`${env.apiUrl}/auth/signup`, signupRequestDto)
      .toPromise();
  }

  async signupTokenVerify(token: string) {
    return await this.http
      .get<SignupTokenDto>(`${env.apiUrl}/auth/signup/${token}`)
      .toPromise();
  }

  async signup(signupDto: SignupDto): Promise<SignupResponse> {
    return await this.http
      .post<SignupResponse>(
        `${env.apiUrl}/auth/signup/${signupDto.token}`,
        signupDto
      )
      .toPromise();
  }

  // === PASSWORD RESET ===
  async passwordResetRequest(
    data: PasswordResetRequestDto
  ): Promise<SendEmailResponse> {
    return await this.http
      .post<SendEmailResponse>(`${env.apiUrl}/auth/password-reset`, data)
      .toPromise();
  }

  async passwordResetTokenVerify(token: string) {
    return await this.http
      .get<SignupTokenDto>(`${env.apiUrl}/auth/password-reset/${token}`)
      .toPromise();
  }

  async passwordReset(data: PasswordResetDto): Promise<PasswordResetResponse> {
    return await this.http
      .post<PasswordResetResponse>(
        `${env.apiUrl}/auth/password-reset/${data.token}`,
        data
      )
      .toPromise();
  }

  // === LOGIN ===
  async login(loginDto: LoginDto): Promise<void> {
    try {
      const transaction = await this.oktaAuth.signInWithCredentials({
        username: loginDto.email,
        password: loginDto.password,
      });

      if (transaction.status === 'SUCCESS') {
        this.oktaAuth.token.getWithRedirect({
          sessionToken: transaction.sessionToken,
          responseType: 'code',
        });
      }
    } catch (error) {
      // eslint-disable-next-line no-throw-literal
      throw 'Incorrect email or password.';
    }
  }

  // === SIGN OUT ===
  async signOut(): Promise<void> {
    // Terminates the session with Okta and removes current tokens.
    await this.oktaAuth.signOut();
  }
}
