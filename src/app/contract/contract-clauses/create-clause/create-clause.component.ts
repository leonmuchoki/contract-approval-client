import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { ContractService } from 'src/app/services/contract.service';
import { ContractClause } from 'src/app/models/contract';
import { AsyncSubject, Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-clause',
  templateUrl: './create-clause.component.html',
  styleUrls: ['./create-clause.component.css']
})
export class CreateContractClauseComponent implements OnInit {

  error: '';
  clauseDetailsInvalid: false;
  clauseForm: FormGroup;
  currentContract: any;
  contract_clauses: ContractClause;
  contract_clause_titles: ContractClause[];
  selectedClauseTitle: any;
  private editorSubject: Subject<any> = new AsyncSubject();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private contractService: ContractService,
    private toastr: ToastrService
  ) {
    this.currentContract = this.router.getCurrentNavigation().extras.state;
    //console.log('currentContract...' + JSON.stringify(this.currentContract));
  }

  ngOnInit(): void {
    this.clauseForm = new FormGroup({
      clause_title: new FormControl("", Validators.required),
      clause_body: new FormControl("", Validators.required),
      clause_title_id: new FormControl("")
    });

    //load any contracts available:
    this.getCurrentContractClauses(this.currentContract.id);
    this.contractService.getContractClauseTitles()
        .pipe(first())
        .subscribe(
          (res) => { 
            this.contract_clause_titles = res;
            console.log("contract_clause_titles" + JSON.stringify(res));
           },
          (err) => { console.error(err); }
        );
  }

  

  // convenience getter for easy access to form fields
  get f() { return this.clauseForm.controls; }

  handleEditorInit(e): void {
    this.editorSubject.next(e.editor);
    this.editorSubject.complete();
  }

  fetchContractClause(e): void {
    console.log('fetchContractClause...' + this.selectedClauseTitle);
    this.getCurrentContractClauses(this.selectedClauseTitle);
  }


  redirectToContractClauseCreate(): void {}

  createContractClause(): void {
    let contract_clause_data = new ContractClause();
    contract_clause_data.contract_id = this.currentContract.id;
    contract_clause_data.clause_title = this.f.clause_title.value;
    contract_clause_data.clause_body = this.f.clause_body.value;

    //console.log('createContractClause: ' + JSON.stringify(this.f.clause_body.value));

    this.contractService.addContractClauses(contract_clause_data)
      .pipe(first())
      .subscribe(
          res => {
              console.log('create clause res: ' + JSON.stringify(res));
              this.toastr.success('Successfully created Contract Clause!', 'Status');
              this.router.navigateByUrl('/contracts');
          },
          error => {
              this.toastr.success('Error creating Contract clauses!', 'Status');
              this.error = error;
          });
  }

  getCurrentContractClauses(contract_id): void {
    contract_id && this.contractService.getContractClauses(contract_id)
    .pipe(first())
    .subscribe(
      (res) => {
        //console.log('res...any available contracts: ' + JSON.stringify(res));
        this.contract_clauses = res;
        this.clauseForm.controls.clause_body && this.clauseForm.controls.clause_body.setValue(res?.clause_body);
        this.clauseForm.controls.clause_body && this.clauseForm.controls.clause_title.setValue(res?.clause_title);
      },
      (err) => {
        //console.log('err...' + err.status + " " + err.statusText);
        console.error(err);
      }
    );
  }

}



