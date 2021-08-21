import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Clause, ClauseDetails, ClauseParts } from '../models/clause';

@Injectable({
  providedIn: 'root'
})
export class ClauseService {

  public baseUrl = "http://localhost:5000/api/v1";

  constructor(private http: HttpClient) { }

  getClause(clause_id) {
    return this.http.get<Clause>(`${this.baseUrl}/clauses/${clause_id}`);
  }

  getAllClauses() {
      return this.http.get<Clause[]>(`${this.baseUrl}/clauses/`);
  }

  getAllClauseParts() {
    return this.http.get<ClauseParts[]>(`${this.baseUrl}/clauses/parts`);
  }

  addClause(clause_data: Clause) {
    return this.http.post<any>(`${this.baseUrl}/clauses/`, clause_data)
        .pipe(map(res => {
            return res;
        }));
  }

  addClauseDetails(clause_details_data: ClauseDetails) {
    return this.http.post<any>(`${this.baseUrl}/clause/details/`, clause_details_data)
        .pipe(map(res => {
            return res;
        }));
  }
}
