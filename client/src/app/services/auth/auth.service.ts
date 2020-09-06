import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private location: Location) {}

  private accessToken: string;
  private refreshToken: string;

  public login(email: string, password: string): Promise<boolean> {
    const credentialsPayload = { email, password: btoa(password) };
    const observable = this.http
      .post('http://localhost:8080/login', credentialsPayload, {
        observe: 'response',
      })
      .pipe(
        map((response: any) => {
          if (response.status === 200) {
            const body = response.body;
            this.saveToken(body.access_token, body.refresh_token);
            location.reload();
          } else {
            return false;
          }
        }),
        catchError(() => {
          return of(false);
        })
      );
    this.location.go('/');

    return observable.toPromise();
  }

  public logout(): void {
    this.accessToken = undefined;
    this.refreshToken = undefined;
    localStorage.clear();
    this.location.go('/login');
    location.reload();
  }

  private saveToken(accessToken: string, refreshToken: string): void {
    localStorage.setItem('access-token', accessToken);
    localStorage.setItem('refresh-token', refreshToken);
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  public getAccessToken(): string {
    return localStorage.getItem('access-token');
  }
}
