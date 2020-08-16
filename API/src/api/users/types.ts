export interface User {
  id: number;
  firstname: string | null;
  lastname: string | null;
  email: string;
  password?: string;
  created_at?: string;
  last_login?: string | null;
  last_update?: string | null;
  light_mode?: boolean;
  password_forgotten?: boolean;
  refresh_token?: string;
}

export interface UpdatePassword {
  email: string;
  password: string;
  new_password: string;
}

export interface Auth {
  email: string;
  password: string;
}

export interface NewToken {
  email: string;
  refresh_token: string;
}

export interface Token {
  access_token: string;
  refresh_token: string;
}

export interface TokenPayload {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
}

export interface DecodedRefreshToken {
  payload: string;
  iat: number;
  exp: number;
  iss: string;
}
