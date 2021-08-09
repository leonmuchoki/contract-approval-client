import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { Role } from '../models/role';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public baseUrl = "http://localhost:5000/api/v1/users";

  constructor(private http: HttpClient) { }

  getAll() {
      return this.http.get<User[]>(`${this.baseUrl}/`);
  }

  getAllRoles() {
    let url = "http://localhost:5000/api/v1/roles";
    return this.http.get<Role[]>(`${url}/`);
  }
}
