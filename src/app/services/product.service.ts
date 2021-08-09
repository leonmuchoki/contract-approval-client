import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  public baseUrl = "http://localhost:5000/api/v1";

  constructor(private http: HttpClient) { }

  getAllProducts() {
      return this.http.get<Product[]>(`${this.baseUrl}/products/`);
  }
}
