import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { Tender } from '../models/tender';

@Injectable({
  providedIn: 'root'
})
export class TenderService {

  public baseUrl = "https://contract-approval-api.herokuapp.com/api/v1";//"http://localhost:5000/api/v1";

  constructor(private http: HttpClient) { }

  getAllTenders() {
      return this.http.get<Tender[]>(`${this.baseUrl}/tenders/`);
  }

  addTender(tender_data: Tender) {
    return this.http.post<any>(`${this.baseUrl}/tenders/`, tender_data)
        .pipe(map(tender => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            
            return tender;
        }));
  }
}
