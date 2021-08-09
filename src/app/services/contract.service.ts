import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Contract } from '../models/contract';

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  public baseUrl = "http://localhost:5000/api/v1";

  constructor(private http: HttpClient) { }

  getAllContracts() {
      return this.http.get<Contract[]>(`${this.baseUrl}/contracts/`);
  }


  addContract(contract_no: string, title: string, contract_entity_purchaser_id: number, contract_entity_supplier_id: number) {
    console.log('posting...' + contract_entity_purchaser_id);
    return this.http.post<any>(`${this.baseUrl}/contracts/`, { contract_no, title, contract_entity_purchaser_id, contract_entity_supplier_id })
        .pipe(map(contract => {
            return contract;
        }));
  }
}
