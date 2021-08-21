import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { ContractService } from 'src/app/services/contract.service';
import { ContractClause } from 'src/app/models/contract';

@Component({
  selector: 'app-create-clause',
  templateUrl: './create-clause.component.html',
  styleUrls: ['./create-clause.component.css']
})
export class CreateContractClauseComponent implements OnInit {

  error: '';
  clauseDetailsInvalid: false;
  clauseDetailsForm: FormGroup;
  currentContract: any;


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private contractService: ContractService
  ) {
    this.currentContract = this.router.getCurrentNavigation().extras.state;
    console.log('currentContract...' + JSON.stringify(this.currentContract));
  }

  ngOnInit(): void {
    this.clauseDetailsForm = this.formBuilder.group({
      clause_part_id: ['', Validators.required],
      clause_detail: [''],
      clause_sub_detail: [''],
      has_table: [false]
    });
  }

  public clauseForm = new FormGroup({
    clause_title: new FormControl("", Validators.required),
    clause_body: new FormControl("", Validators.required)
  });

  // convenience getter for easy access to form fields
  get f() { return this.clauseForm.controls; }


  redirectToContractClauseCreate(): void {}

  createContractClause(): void {
    let contract_clause_data = new ContractClause();
    contract_clause_data.contract_id = this.currentContract.id;
    contract_clause_data.clause_title = this.f.clause_title.value;
    contract_clause_data.clause_body = this.f.clause_body.value;

    console.log('createContractClause: ' + JSON.stringify(this.f.clause_body.value));

    this.contractService.addContractClauses(contract_clause_data)
      .pipe(first())
      .subscribe(
          res => {
              console.log('create clause res: ' + JSON.stringify(res));
              this.router.navigateByUrl('/contracts');
          },
          error => {
              this.error = error;
          });
  }

}
