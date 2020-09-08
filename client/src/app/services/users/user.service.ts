import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, retry } from 'rxjs/operators';
import { of } from 'rxjs';
import { Location } from '@angular/common';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiUrl = 'http://localhost:8080';

  constructor(
    private http: HttpClient,
    private location: Location,
    private auth: AuthService
  ) {}

  public getFirstName(): string {
    return this.auth.getUserData().firstname;
  }

  public getLastName(): string {
    return this.auth.getUserData().lastname;
  }

  public getEmail(): string {
    return this.auth.getUserData().email;
  }

  public getUserId(): number {
    return this.auth.getUserData().id;
  }

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
            this.auth.saveTokens(body.access_token, body.refresh_token);
            this.auth.saveUser(body.access_token);
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
}
