import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { UserService } from '../services/users/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public isAuthenticated: boolean;
  private firstName: string = null;

  constructor(public auth: AuthService, public user: UserService) {
    this.isAuthenticated = this.auth.accessTokenExists();
    if (this.isAuthenticated) {
      this.firstName = this.user.getFirstName();
    }
  }

  logout(): void {
    this.auth.logout();
  }

  ngOnInit(): void {}
}
