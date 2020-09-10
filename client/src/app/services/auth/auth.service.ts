import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Location } from '@angular/common';
import * as moment from 'moment';
import { Tokens, TokenData } from './types';
import { SessionService } from '../session/session.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:8080';

  constructor(
    private http: HttpClient,
    private location: Location,
    private session: SessionService
  ) {}

  public logout(): void {
    localStorage.clear();
    this.session.clearSessionStorage();
    this.location.go('/login');
    location.reload();
  }

  public saveTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('access-token', accessToken);
    localStorage.setItem('refresh-token', refreshToken);
  }

  public saveUser(token: string): void {
    const user = this.decodeToken(token);
    localStorage.setItem('user-data', user);
  }

  public getUserData(): TokenData {
    return JSON.parse(localStorage.getItem('user-data'));
  }

  public accessTokenExists(): boolean {
    if (this.getCurrentAccessToken()) {
      return true;
    }
    return false;
  }

  public getAccessToken(): string {
    if (!this.accessTokenExists()) {
      return null;
    }
    if (this.isTokenExpired()) {
      this.getStoreNewAccessToken();
    }
    return this.getCurrentAccessToken();
  }

  private getStoreNewAccessToken(): any {
    const observable = this.http
      .post<Tokens>(`${this.apiUrl}/new-token`, {
        email: this.getUserData().email,
        refresh_token: this.getRefreshToken(),
      })
      .pipe(
        catchError(() => {
          this.logout();
          return of(null);
        })
      );
    return observable.subscribe((tokens: Tokens) => {
      this.saveTokens(tokens.access_token, tokens.refresh_token);
      return tokens.access_token;
    });
  }

  private isTokenExpired(): boolean {
    return moment().isBefore(this.getExpiration(), 'second');
  }

  private getExpiration(): number {
    return this.getUserData().exp;
  }

  private decodeToken(token: string): string {
    return atob(token.split('.')[1]);
  }

  private getCurrentAccessToken(): string {
    return localStorage.getItem('access-token');
  }

  public getRefreshToken(): string {
    return localStorage.getItem('refresh-token');
  }
}
