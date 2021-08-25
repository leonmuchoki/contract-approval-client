import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ContractEntity } from '../models/contract';

@Injectable({
  providedIn: 'root'
})
export class EntityService {

  public baseUrl = "https://contract-approval-api.herokuapp.com/api/v1";//"http://localhost:5000/api/v1";

  constructor(private http: HttpClient) { }

  getAllEntities() {
    return this.http.get<ContractEntity[]>(`${this.baseUrl}/contractentites/`);
  }

  addEntity(entity_name: string, description: string) {
    return this.http.post<any>(`${this.baseUrl}/contractentites/`, { entity_name, description })
        .pipe(map(entity => {
            return entity;
        }));
  }
}
