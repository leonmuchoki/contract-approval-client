import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Clause } from 'src/app/models/clause';
import { ClauseService } from 'src/app/services/clause.service';

@Component({
  selector: 'app-clauses',
  templateUrl: './clauses.component.html',
  styleUrls: ['./clauses.component.css']
})
export class ClausesComponent implements OnInit {
  loading: false;
  clauses: Clause[];
  displayedColumns: string[] = ['id','contract_type', 'clause_title', 'action'];

  constructor(
    private clauseService: ClauseService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.clauseService.getAllClauses().pipe(first()).subscribe(clauses => {
      this.loading = false;
      console.log('clauses::' + JSON.stringify(clauses))
      this.clauses = clauses.map((x) => {
        return {
          id: x.id,
          clause_title: x.clause_title,
          contract_type: x?.contract_types?.name
        };
      });
    });
  }

  redirectToViewDetails(): void {}

  redirectToAddDetails(el): void {
    console.log('redirectToAddDetails...' + JSON.stringify(el));
    this.router.navigateByUrl(`clause/details/create/${el.id}`);
  }
}
