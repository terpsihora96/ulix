import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { UserService } from '../services/users/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;

  constructor(private user: UserService) {}

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  passwordFormControl = new FormControl('', [Validators.required]);
  firstNameFormControl = new FormControl('', [Validators.required]);
  lastNameFormControl = new FormControl('', [Validators.required]);

  ngOnInit(): void {}

  public register(): void {
    this.user.register(
      this.email,
      this.firstName,
      this.lastName,
      this.password,
      this.confirmPassword
    );
  }
}
