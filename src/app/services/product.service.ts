import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { ContractProduct } from '../models/contract';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  public baseUrl = "https://contract-approval-api.herokuapp.com/api/v1";//"http://localhost:5000/api/v1";

  constructor(private http: HttpClient) { }

  getAllProducts() {
      return this.http.get<Product[]>(`${this.baseUrl}/products/`);
  }

  addContractProduct(product_id: number, contract_id: number, product_quantity: number) {
    return this.http.post<any>(`${this.baseUrl}/contract/products/`, { product_id, contract_id, product_quantity })
        .pipe(map(res => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            console.log('addContractProduct: ' + JSON.stringify(res));
            return res;
        }));
  }
}
