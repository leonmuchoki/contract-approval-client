import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { ContractService } from 'src/app/services/contract.service';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';
import { Contract } from 'src/app/models/contract';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  loading = false;
  contracts: Contract[];
  users: User[];
  currentUser: User;

  displayedColumns: string[] = ['contract_no', 'title', 'purchaser', 'supplier','action'];

  constructor(
    private userService: UserService, 
    private auth: AuthService,
    private contractService: ContractService,
    private router: Router
    ) {
    this.auth.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {
      this.loading = true;
      this.userService.getAll().pipe(first()).subscribe(users => {
          this.loading = false;
          this.users = users;
          console.log('users::' + JSON.stringify(users))
      });
      console.log('Dashboard::currentUser::' + JSON.stringify(this.currentUser));

      this.contractService.getAllContracts().pipe(first()).subscribe(contracts => {
        this.loading = false;
        this.contracts = contracts.map((c) => {
          return {
            contract_no: c?.contract_no,
            title: c?.title,
            purchaser: c?.contract_entity_purchaser?.entity_name,
            supplier: c?.contract_entity_supplier?.entity_name
          }
        });
        console.log('contracts::' + JSON.stringify(this.contracts))
    });
  }

  redirectToContractCreate() : void {
    this.router.navigateByUrl('/contract_create');
  }

  redirectToAddContractProducts(): void {}

  redirectToAddContractClauses(): void {}
}