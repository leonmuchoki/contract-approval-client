import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-clause',
  templateUrl: './create-clause.component.html',
  styleUrls: ['./create-clause.component.css']
})
export class CreateContractClauseComponent implements OnInit {

  clause_title: string = '';
  clause_title_detail: string = '';
  clauseDetailsInvalid: false;
  clauseDetailsForm: FormGroup;
  clauseSubDetail: string[] = [];
  clause: object = {
    clause_title: '',
    clause_details: []
  };
  clauses = [] as any;
  clause_detail: {} = {
    detail: {},
    has_product: false,
    sub_details: []
  };

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.clauseDetailsForm = this.formBuilder.group({
      clause_part_id: ['', Validators.required],
      clause_detail: [''],
      clause_sub_detail: [''],
      has_table: [false]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.clauseDetailsForm.controls; }

  addTitle(): void {
    //this.clauseSubDetail.push(this.f.clause_sub_detail.value);

    let c = {
      clause_title : this.clause_title,
      clause_details: []
    }
    this.clauses.push(c);
    console.log('addTitle:: ' + JSON.stringify(this.clauses))
  }

  addDetail(title): void {
    console.log('addDetail:: ' + JSON.stringify(title));
    this.clauses.filter(x => x.clause_title == title).map((x) => {
      let cd = {};
      return {
        clause_title: title,
        clause_details: x.clause_details.push(this.clause_title_detail)
      }
    })
  }

  redirectToContractClauseCreate(): void {}

  onSubmit(): void {}

}
