import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { Tender } from 'src/app/models/tender';
import { TenderService } from 'src/app/services/tender.service';
import { J } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-tender-create',
  templateUrl: './tender-create.component.html',
  styleUrls: ['./tender-create.component.css']
})
export class TenderCreateComponent implements OnInit {

  loading = false;
  public tenderInvalid = false;
  tenderForm: FormGroup;
  submitted = false;
  returnUrl: string;
  error = '';


  constructor(
    private tenderService: TenderService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.tenderForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

   // convenience getter for easy access to form fields
   get f() { return this.tenderForm.controls; }

   onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.tenderForm.invalid) {
        return;
    }

    this.loading = true;

    let tender_data = new Tender();
    tender_data.title = this.f.title.value;
    tender_data.description = this.f.description.value;
    
    this.tenderService.addTender(tender_data)
      .pipe(first())
      .subscribe(
          data => {
              this.router.navigate(['/tenders']);
          },
          error => {
              if(error?.error?.message.includes('Invalid token')) {
                this.router.navigate(['/login']);
              }
            console.error('tender create: ' + JSON.stringify(error));
              this.error = error;
              this.loading = false;
          });
  }

}
