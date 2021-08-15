import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login/login.component';
import { RegisterComponent } from './register/register/register.component';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { ContractComponent } from './contract/contract/contract.component';
import { ContractCreateComponent } from './contract/create/contract-create/contract-create.component';
import { TenderCreateComponent } from './tenders/tender-create/tender-create.component';
import { TenderComponent } from './tenders/tender/tender.component';
import { EntityComponent } from './entity/entity/entity.component';
import { CreateEntityComponent } from './entity/create-entity/create-entity.component';
//import { CreateClauseComponent } from './contract/contract-clauses/create-clause/create-clause.component';
import { CreateComponent } from './contract/contract-products/create/create.component';
import { PreviewComponent } from './contract/contract-preview/preview/preview.component';
import { CreateClauseComponent } from './clauses/create-clause/create-clause.component';
import { ClausesComponent } from './clauses/clauses/clauses.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'contract', component: ContractComponent },
  { path: 'contract/create', component: ContractCreateComponent },
  { path: 'tender/create', component: TenderCreateComponent },
  { path: 'tenders', component: TenderComponent },
  { path: 'entity', component: EntityComponent },
  { path: 'entity/create', component: CreateEntityComponent },
  { path: 'clauses', component: ClausesComponent },
  { path: 'clause/create', component: CreateClauseComponent },
  { path: 'contract/products/create/:contract_id', component: CreateComponent },
  { path: 'contract/preview/:contract_id', component: PreviewComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
