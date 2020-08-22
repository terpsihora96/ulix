import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  public email: string;
  public firstName: string;
  public lastName: string;

  constructor(private location: Location) {}

  firstNameFormControl = new FormControl('', [Validators.required]);
  lastNameFormControl = new FormControl('', [Validators.required]);
  passwordFormControl = new FormControl('', [Validators.required]);

  ngOnInit(): void {}

  goBack(): void {
    this.location.back();
  }
}
