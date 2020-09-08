export interface Tokens {
  access_token: string;
  refresh_token: string;
}

export interface TokenData {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  exp: number;
  iat: string;
  iss: string;
}
