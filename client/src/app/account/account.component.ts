import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { UserService } from '../services/users/user.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  email: string;
  firstName: string;
  lastName: string;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;

  constructor(private location: Location, private user: UserService) {
    this.email = this.user.getEmail();
    this.firstName = this.user.getFirstName();
    this.lastName = this.user.getLastName();
  }

  firstNameFormControl = new FormControl('', [Validators.required]);
  lastNameFormControl = new FormControl('', [Validators.required]);
  passwordFormControl = new FormControl('', [Validators.required]);

  ngOnInit(): void {}

  goBack(): void {
    this.location.back();
  }

  updateUserData(): void {
    if (this.firstName !== '' || this.lastName !== '') {
      this.user.updateUserData(this.firstName.trim(), this.lastName.trim());
    }
  }

  updatePassword(): void {
    if (
      this.newPassword === this.confirmNewPassword &&
      (this.currentPassword !== '' ||
        this.newPassword !== '' ||
        this.confirmNewPassword !== '')
    ) {
      this.user.updatePassword(
        this.email,
        this.currentPassword,
        this.newPassword
      );
    }
  }
}
