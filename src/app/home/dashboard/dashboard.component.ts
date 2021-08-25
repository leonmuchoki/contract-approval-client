import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { DateTime } from 'luxon';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { ContractService } from 'src/app/services/contract.service';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';
import { Contract } from 'src/app/models/contract';
import { Roles } from 'src/app/_helpers/roles';
import { Role } from 'src/app/models/role';
import { ContractStages } from 'src/app/_helpers/contract_stages';

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
  roles: any;
  
  displayedColumns: string[] = ['contract_no', 'title', 'purchaser', 'supplier','created_at','contract_stage', 'contract_status','action'];

  constructor(
    private userService: UserService, 
    private auth: AuthService,
    private contractService: ContractService,
    private router: Router,
    private toastr: ToastrService
    ) {
    this.auth.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {
      this.roles = {...Roles};
      
      this.loading = true;
      this.userService.getAll().pipe(first()).subscribe(users => {
          this.loading = false;
          this.users = users;
          //console.log('users::' + JSON.stringify(users))
      });
      //console.log('Dashboard::currentUser::' + JSON.stringify(this.currentUser));
      this.getAllContracts();
  }

  getAllContracts(): void {
    this.contractService.getAllContracts().pipe(first()).subscribe(contracts => {
      this.loading = false;
      //console.log('contracts::' + JSON.stringify(contracts));
      this.contracts = Array.isArray(contracts) && contracts.length > 0 && contracts.map((c) => {
        return {
          id: c?.id,
          contract_no: c?.contract_no,
          title: c?.title,
          purchaser: c?.contract_entity_purchaser?.entity_name,
          supplier: c?.contract_entity_supplier?.entity_name,
          created_at: new Date(c?.created_at).toLocaleDateString(),
          contract_stage: c?.contract_stage,
          contract_products: c?.contract_products,
          contract_status: c?.contract_status
        }
      })
      .filter((x) => {
        if(x.contract_stage == undefined || x.contract_stage == null) return x;
        switch(+this.currentUser.user_data.role_id) {
          case Roles.legal:
            return x?.contract_stage.id == ContractStages.legal;
            break;
          case Roles.ceo:
            return x?.contract_stage.id == ContractStages.ceo;
            break;
          case Roles?.procurement:
            return x;
        }
      });
      //console.log('contracts::' + JSON.stringify(this.contracts));
    });
  }

  redirectToContractCreate() : void {
    this.router.navigateByUrl('/contract/create');
  }

  redirectToAddContractProducts(element): void {
    console.log('clickedRow::' + JSON.stringify(element));
    this.router.navigateByUrl(`/contract/products/create/${element.id}`,{ state: element.contract_products });
  }

  redirectToPreviewContract(element): void {
    //contract/peview
    this.router.navigateByUrl(`/contract/preview/${element.id}`,{ state: element });
  }

  redirectToAddContractClauses(element): void {
    this.router.navigateByUrl(`contract/clauses/create/${element.id}`, { state: element });
  }

  fowardContract(element): void {
    //console.log('fowardContract::current user: ' + JSON.stringify(this.currentUser));
    //console.log('fowardContract::current user: ' + JSON.stringify(element));
    let contract_id = element?.id;
    let contract_data = new Contract();
    contract_data.id = contract_id;
    let currentRole = +this.currentUser.user_data.role_id;
    switch(currentRole) {
      case Roles.procurement:
        contract_data.contract_stage_id = ContractStages.legal;
        break;
      case Roles.legal:
        contract_data.contract_stage_id = ContractStages.ceo;
        break;
      case Roles.finance:
        contract_data.contract_stage_id = ContractStages.ceo;
        break;
      case Roles.ceo:
        contract_data.contract_stage_id = ContractStages.supplier;
        break;
      default:
        contract_data.contract_stage_id = ContractStages.procurement;
        break;
    }

    this.contractService.updateContract(contract_id, contract_data).pipe(first()).subscribe((res) => {
      console.log('fowardContract::current user: ' + JSON.stringify(res));
      this.toastr.success('Successfully fowarded Contract!', 'Status');
      this.getAllContracts();
    });
  }

  revertContract(element): void {
    //console.log('fowardContract::current user: ' + JSON.stringify(this.currentUser));
    //console.log('fowardContract::current user: ' + JSON.stringify(element));
    let contract_id = element?.id;
    let contract_data = new Contract();
    contract_data.id = contract_id;
    let currentRole = +this.currentUser.user_data.role_id;
    switch(currentRole) {
      case Roles.legal:
        contract_data.contract_stage_id = ContractStages.procurement;
        break;
      case Roles.finance:
        contract_data.contract_stage_id = ContractStages.legal;
        break;
      case Roles.ceo:
        contract_data.contract_stage_id = ContractStages.legal;
        break;
      default:
        contract_data.contract_stage_id = ContractStages.procurement;
        break;
    }

    this.contractService.updateContract(contract_id, contract_data).pipe(first()).subscribe((res) => {
      console.log('fowardContract::current user: ' + JSON.stringify(res));
      this.toastr.success('Successfully reverted Contract!', 'Status');
      this.getAllContracts();
    });
  }
}
