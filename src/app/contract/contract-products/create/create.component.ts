import { Component, OnInit, Inject } from '@angular/core';
import { first } from 'rxjs/operators';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';
import { DialogAddQuantityDialogComponent } from './dialog-add-quantity-dialog/dialog-add-quantity-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  products: Product[];
  loading: Boolean = false;
  submitted: Boolean = false;
  displayedColumns: string[] = ['id','name', 'price', 'action'];
  clickedRows = new Set<Product>();
  error = '';
  contract_id: number;

  constructor(
    private prodService: ProductService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      console.log(params['contract_id']);
      this.contract_id = params['contract_id'];
    });

    this.prodService.getAllProducts().pipe(first()).subscribe(products => {
      this.loading = false;
      console.log('products::' + JSON.stringify(products))
      this.products = products.map((p) => {
        return {
          id: p?.id,
          name: p?.name,
          price: p?.price
        }
      });
    });
  }

  openDialog(productRow): void {
    console.log('open dialog..' + JSON.stringify(productRow));
    const dialogRef = this.dialog.open(DialogAddQuantityDialogComponent, {
      width: '250px',
      data: productRow
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed ' + JSON.stringify(result));
      this.clickedRows.add(result);
    });
  }

  redirectToProductCreate() : void {}

  submitContractProducts(): void {
    this.submitted = true;

    // stop here if form is invalid
    if (this.clickedRows.size <= 0) {
        return;
    }

    this.loading = true;
    this.clickedRows.forEach(row => {
      this.prodService.addContractProduct(row.id, this.contract_id, row.quantity)
      .pipe(first())
      .subscribe(
          data => {
              
          },
          error => {
              this.error = error;
              this.loading = false;
          });
    });
    this.router.navigate(['/dashboard']);
  }

}


