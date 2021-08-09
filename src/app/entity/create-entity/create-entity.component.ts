import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { EntityService } from 'src/app/services/entity.service';

@Component({
  selector: 'app-create-entity',
  templateUrl: './create-entity.component.html',
  styleUrls: ['./create-entity.component.css']
})
export class CreateEntityComponent implements OnInit {

  loading = false;
  public entityInvalid = false;
  entityForm: FormGroup;
  submitted = false;
  returnUrl: string;
  error = '';


  constructor(
    private entityService: EntityService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.entityForm = this.formBuilder.group({
      entity_name: ['', Validators.required],
      description: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

   // convenience getter for easy access to form fields
   get f() { return this.entityForm.controls; }

   onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.entityForm.invalid) {
        return;
    }

    this.loading = true;
    this.entityService.addEntity(this.f.entity_name.value,this.f.description.value)
      .pipe(first())
      .subscribe(
          data => {
              this.router.navigate(['/entity']);
          },
          error => {
              this.error = error;
              this.loading = false;
          });
   }

}
