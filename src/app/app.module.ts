import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './navbar/navbar/navbar.component';
import { MyMaterialModule } from './material.module';
import { LoginComponent } from './login/login/login.component';
import { RegisterComponent } from './register/register/register.component';
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { ContractComponent } from './contract/contract/contract.component';
import { ContractCreateComponent } from './contract/create/contract-create/contract-create.component';
import { TenderCreateComponent } from './tenders/tender-create/tender-create.component';
import { TenderComponent } from './tenders/tender/tender.component';
import { CreateEntityComponent } from './entity/create-entity/create-entity.component';
import { EntityComponent } from './entity/entity/entity.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    ContractComponent,
    ContractCreateComponent,
    TenderCreateComponent,
    TenderComponent,
    CreateEntityComponent,
    EntityComponent
  ],
  imports: [
    BrowserModule,
    FormsModule, 
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule, 
    MyMaterialModule,
    RouterModule,
    AppRoutingModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },],
  bootstrap: [AppComponent]
})
export class AppModule { }
