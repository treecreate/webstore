export class PasswordResetDto {
    token: string;
    password: string;
  }
  
  export class PasswordResetResponse {
    success: boolean;
  }
  
  export class PasswordResetRequestDto {
    email: string;
  }
  