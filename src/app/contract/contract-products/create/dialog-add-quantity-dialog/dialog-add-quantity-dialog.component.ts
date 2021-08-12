import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-dialog-add-quantity-dialog',
  templateUrl: './dialog-add-quantity-dialog.component.html',
  styleUrls: ['./dialog-add-quantity-dialog.component.css']
})
export class DialogAddQuantityDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogAddQuantityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

}
