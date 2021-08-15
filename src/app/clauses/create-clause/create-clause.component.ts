import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Clause } from 'src/app/models/clause';
import { ContractType } from 'src/app/models/contract';
import { ContractService } from 'src/app/services/contract.service';
import { ClauseService } from 'src/app/services/clause.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-clause',
  templateUrl: './create-clause.component.html',
  styleUrls: ['./create-clause.component.css']
})
export class CreateClauseComponent implements OnInit {

  loading = false;
  submitted = false;
  error = '';
  contract_types: ContractType[];
  clauseForm: FormGroup;
  clauseInvalid: boolean;

  clausePartNos: string[] = ['I', 'II', 'III', 'IV', 'V','VI', 'VII', 'VIII', 'IX', 'X'];
  
  constructor(
    private contractService: ContractService,
    private clauseService: ClauseService,
    private formBuilder: FormBuilder,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.contractService.getContractTypes().pipe(first()).subscribe(res => {
    this.loading = false;
    this.contract_types = res;
    //console.log('contract_types::' + JSON.stringify(res))
    });

    this.clauseForm = this.formBuilder.group({
      contract_type_id: ['', Validators.required],
      clause_title: ['', Validators.required],
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.clauseForm.controls; }

  onSubmit(): void {
    this.submitted = true;

    // stop here if form is invalid
    if (this.clauseForm.invalid) {
        return;
    }

    this.loading = true;

    const clause_data = new Clause();
    clause_data.contract_type_id = this.f.contract_type_id.value;
    clause_data.clause_title = this.f.clause_title.value;

    this.clauseService.addClause(clause_data)
      .pipe(first())
        .subscribe(
          res => {
            this.router.navigateByUrl('/clauses');
          },
          error => {
              console.error('clause create: ' + JSON.stringify(error));
              this.error = error;
              this.loading = false;
          }
        );
  }

}
