export class SignupDto {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    token: string;
  }
  
  export class SignupResponse {
    email: string;
    firstName: string;
    lastName: string;
  }
  
  export class SignupRequestDto {
    email: string;
  }
  
  export class SignupTokenDto {
    email: string;
    iat: number;
  }
  