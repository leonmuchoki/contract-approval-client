import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { ClauseDetails, ClauseParts } from 'src/app/models/clause';
import { ClauseService } from 'src/app/services/clause.service';

@Component({
  selector: 'app-create-clause-details',
  templateUrl: './create-clause-details.component.html',
  styleUrls: ['./create-clause-details.component.css']
})
export class CreateClauseDetailsComponent implements OnInit {

  loading = false;
  submitted = false;
  error = '';
  clause_id: number;
  clause_parts: ClauseParts[];
  clauseDetailsForm: FormGroup;
  clauseDetailsInvalid: boolean;
  clause_details: ClauseDetails[] = [];

  constructor(
    private clauseService: ClauseService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
    ) { }

  ngOnInit(): void {
    this.clauseService.getAllClauseParts().pipe(first()).subscribe(res => {
      this.loading = false;
      this.clause_parts = res;
      //console.log('getAllClauseParts::' + JSON.stringify(res))

      this.route.params.subscribe((params) => {
        this.clause_id = params['clause_id'];
      });
    });
  
    this.clauseDetailsForm = this.formBuilder.group({
      clause_part_id: ['', Validators.required],
      clause_detail: [''],
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.clauseDetailsForm.controls; }

  addDetail(): void {
    console.log('addDetail...' + this.f.clause_detail.value);
    let cd = new ClauseDetails();
    cd.clause_detail = this.f.clause_detail.value;
    this.clause_details.push(cd);
    this.f.clause_detail.reset();
  }

  onSubmit(): void {
    this.submitted = true;

    // stop here if form is invalid
    if (this.clauseDetailsForm.invalid) {
        return;
    }

    if(this.clause_details.length<=0) {
      this.error = 'please add details';
      return;
    }

    this.loading = true;

    this.clause_details.forEach(clause_detail => {
      const clause_detail_data = new ClauseDetails();
      clause_detail_data.clause_id = this.clause_id;
      clause_detail_data.clause_detail = clause_detail.clause_detail;
      clause_detail_data.clause_part_id = this.f.clause_part_id.value;

      this.clauseService.addClauseDetails(clause_detail_data)
      .pipe(first())
        .subscribe(
          res => {
            //this.router.navigateByUrl('/clauses');
          },
          error => {
              console.error('clause detail create: ' + JSON.stringify(error));
              this.error = error;
              this.loading = false;
          }
        );
    });

    this.router.navigateByUrl('/clauses');
  }
}
