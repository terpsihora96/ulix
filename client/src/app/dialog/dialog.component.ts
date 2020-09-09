import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

export interface Data {
  type: string;
  func: any;
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {
  name: string;

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Data,
    private http: HttpClient
  ) {}

  onCloseClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {}
}
