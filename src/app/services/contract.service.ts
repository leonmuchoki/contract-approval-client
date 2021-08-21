import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, pipe } from 'rxjs';
import { map } from 'rxjs/operators';

import { Contract, ContractClause, ContractType } from '../models/contract';
import { ThrowStmt } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  public baseUrl = "http://localhost:5000/api/v1";

  constructor(private http: HttpClient) { }

  getContract(contract_id) {
    return this.http.get<Contract>(`${this.baseUrl}/contracts/${contract_id}`);
  }

  getAllContracts() {
      return this.http.get<Contract[]>(`${this.baseUrl}/contracts/`);
  }

  addContract(contract_data: Contract) {
    return this.http.post<any>(`${this.baseUrl}/contracts/`, contract_data)
        .pipe(map(contract => {
            return contract;
        }));
  }

  updateContract(contract_id, contract_data: Contract) {
    return this.http.put<any>(`${this.baseUrl}/contracts/${contract_id}`, contract_data)
      .pipe(map(res => {
        return res;
      }));
  }

  getContractTypes() {
    return this.http.get<ContractType[]>(`${this.baseUrl}/contract/types/`);
  } 

  addContractClauses(contract_clauses_data: ContractClause) {
    return this.http.post<any>(`${this.baseUrl}/contract/clauses/`, contract_clauses_data)
        .pipe(map(res => {
            return res;
        }));
  }

  getContractClauses(contract_id) {
    return this.http.get<Contract>(`${this.baseUrl}/contracts/clauses/${contract_id}`);
  }
  
}
