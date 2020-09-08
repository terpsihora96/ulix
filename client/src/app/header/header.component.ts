import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(public auth: AuthService) {}

  public isAuthenticated = this.auth.accessTokenExists();

  logout(): void {
    this.auth.logout();
  }

  ngOnInit(): void {}
}
