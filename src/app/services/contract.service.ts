import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Contract, ContractType } from '../models/contract';

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

  getContractTypes() {
    return this.http.get<ContractType[]>(`${this.baseUrl}/contract/types/`);
  } 
}
