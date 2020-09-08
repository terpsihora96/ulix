import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, retry } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { Location } from '@angular/common';
import * as moment from 'moment';
import { Tokens, TokenData } from './types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient, private location: Location) {}

  public login(email: string, password: string): Promise<boolean> {
    const credentialsPayload = { email, password: btoa(password) };
    const observable = this.http
      .post(`${this.apiUrl}/login`, credentialsPayload, {
        observe: 'response',
      })
      .pipe(
        map((response: any) => {
          if (response.ok) {
            const body = response.body as any;
            this.saveTokens(body.access_token, body.refresh_token);
            this.saveUser(body.access_token);
            location.reload();
          } else {
            return false;
          }
        }),
        retry(3),
        catchError(() => {
          return of(false);
        })
      );
    this.location.go('/');

    return observable.toPromise();
  }

  public logout(): void {
    localStorage.clear();
    this.location.go('/login');
    location.reload();
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
        email: this.getEmail(),
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

  public getFirstName(): string {
    return this.getUserData().firstname;
  }

  public getLastName(): string {
    return this.getUserData().lastname;
  }

  public getEmail(): string {
    return this.getUserData().email;
  }

  public getUserId(): number {
    return this.getUserData().id;
  }

  private isTokenExpired(): boolean {
    return moment().isBefore(this.getExpiration(), 'second');
  }

  private getExpiration(): number {
    return this.getUserData().exp;
  }

  private getUserData(): TokenData | null {
    return JSON.parse(localStorage.getItem('user-data'));
  }

  private saveTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('access-token', accessToken);
    localStorage.setItem('refresh-token', refreshToken);
  }

  private saveUser(token: string): void {
    const user = this.decodeToken(token);
    localStorage.setItem('user-data', user);
  }

  private decodeToken(token: string): string {
    return atob(token.split('.')[1]);
  }

  public getCurrentAccessToken(): string {
    return localStorage.getItem('access-token');
  }

  private getRefreshToken(): string {
    return localStorage.getItem('refresh-token');
  }
}
