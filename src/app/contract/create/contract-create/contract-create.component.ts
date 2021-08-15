import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {COMMA, ENTER, S} from '@angular/cdk/keycodes';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import { ContractService } from 'src/app/services/contract.service';
import { ProductService } from 'src/app/services/product.service';
import { EntityService } from 'src/app/services/entity.service';
import { TenderService } from 'src/app/services/tender.service';
import { Contract, ContractEntity, ContractType } from 'src/app/models/contract';
import { Product } from 'src/app/models/product';
import { Tender } from 'src/app/models/tender';

@Component({
  selector: 'app-contract-create',
  templateUrl: './contract-create.component.html',
  styleUrls: ['./contract-create.component.css']
})
export class ContractCreateComponent implements OnInit {

  loading = false;
  contract_types: ContractType[];
  contract_entities: ContractEntity[];
  products: Product[];
  tenders: Tender[];
  public contractInvalid = false;
  contractForm: FormGroup;
  submitted = false;
  returnUrl: string;
  error = '';
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  productCtrl = new FormControl();
  _products: string[] = ['test'];
  filteredProducts: Observable<string[]>;
  allProducts: string[];
  contract_no: string;

  @ViewChild('productInput') productInput: ElementRef<HTMLInputElement>;

  constructor(
    private contractService: ContractService,
    private productService: ProductService,
    private tenderService: TenderService,
    private entityService: EntityService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.loading = true;
    this.entityService.getAllEntities().pipe(first()).subscribe(entities => {
        //this.loading = false;
        this.contract_entities = entities;
        //console.log('contract_entities::' + JSON.stringify(entities))
    }); 

    this.contractService.getContractTypes().pipe(first()).subscribe(res => {
      this.loading = false;
      this.contract_types = res;
      console.log('contract_types::' + JSON.stringify(res))
    });

    this.productService.getAllProducts().pipe(first()).subscribe(products => {
      this.products = products;
      this.allProducts = products.map((p) => p.name);
      //console.log('products::' + JSON.stringify(this.allProducts))
    }); 

    this.tenderService.getAllTenders().pipe(first()).subscribe(tenders => {
      this.loading = false;
      this.tenders = tenders;
    }); 
    
    let currYear = new Date().getFullYear();
    let randomNo = Math.floor(1000 + Math.random() * 9000);
    this.contract_no = `KEMSA/RT${randomNo}/${currYear} - ${currYear+1}`

    this.contractForm = this.formBuilder.group({
      contract_no: [{value: this.contract_no, disabled: true},  Validators.required],
      title: ['', Validators.required],
      contract_entity_purchaser_id: ['', Validators.required],
      contract_entity_supplier_id: ['', Validators.required],
      products: [''],
      contract_type_id: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this._products.push(value);
    }

    // Clear the input value
    //event.chipInput!.clear();

    this.productCtrl.setValue(null);
  }

  remove(fruit: string): void {
    const index = this._products.indexOf(fruit);

    if (index >= 0) {
      this._products.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this._products.push(event.option.viewValue);
    this.productInput.nativeElement.value = '';
    this.productCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allProducts.filter(p => p.toLowerCase().includes(filterValue));
  }

    // convenience getter for easy access to form fields
    get f() { return this.contractForm.controls; }

    onSubmit() {
      this.submitted = true;

      console.log('submitting...');
      // stop here if form is invalid
      if (this.contractForm.invalid) {
        console.log('form invalid...');
          return;
      }

      this.loading = true;

      const contract_data = new Contract();
      contract_data.contract_no = this.f.contract_no.value;
      contract_data.title = this.f.title.value;
      contract_data.contract_entity_purchaser_id = this.f.contract_entity_purchaser_id.value;
      contract_data.contract_entity_supplier_id = this.f.contract_entity_supplier_id.value;
      contract_data.contract_type_id = this.f.contract_type_id.value;

      this.contractService.addContract(contract_data)
      .pipe(first())
        .subscribe(
          data => {
            this.router.navigateByUrl('/dashboard');
          },
          error => {
              console.log('contract create: ' + JSON.stringify(error));
              this.error = error;
              this.loading = false;
          }
        );
    }
}
