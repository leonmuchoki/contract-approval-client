import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { first } from 'rxjs/operators';
import { Packer } from "docx";
import { saveAs } from "file-saver";
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { Contract, ContractClause } from 'src/app/models/contract';
import { ContractService } from 'src/app/services/contract.service';

import { DocumentCreator } from './doc-generator';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { ContractStages } from 'src/app/_helpers/contract_stages';
import { Roles } from 'src/app/_helpers/roles';
import { Role } from 'src/app/models/role';
import { ContractStatus } from 'src/app/_helpers/contract_status';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {

  contract_id: number;
  contract: Contract;
  loading: Boolean = false;
  previewImgUrl: any;
  currentContract: any;
  contract_clauses: ContractClause;
  currentUser: User;
  roles: any;
  
  constructor(
    private contractService: ContractService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private router: Router,
    private toastr: ToastrService
    ) {
      this.currentContract = this.router.getCurrentNavigation().extras.state;
      console.log('currentContract...' + JSON.stringify(this.currentContract));
      this.authService.currentUser.subscribe(x => this.currentUser = x);
    }

  ngOnInit(): void {
    this.roles = {...Roles};

    this.loading = true;
    this.route.params.subscribe((params) => {
      console.log(params['contract_id']);
      this.contract_id = params['contract_id']; 
    });

    this.contractService.getContract(this.contract_id).pipe(first()).subscribe(contract => {
      this.loading = false;
      //console.log('contracts::' + JSON.stringify(contract));
      this.contract = contract;
      this.contract.created_at = new Date(contract.created_at).toDateString();
    });

    this.getCurrentContractClauses(this.currentContract.id);
  }

  getTotalAmount() : number {
    let totalAmount = 0;
    this.contract.contract_products.forEach(el => {
      totalAmount += el.product_quantity * el.products.price; 
    });
    return totalAmount;
  }

  generatePreviewDoc(): void {
    const documentCreator = new DocumentCreator();
    const doc = documentCreator.create(this.contract);

    Packer.toBase64String(doc).then((imgUrl) => {
      console.log('image url...' + imgUrl);
      this.previewImgUrl = imgUrl;
    });

    Packer.toBlob(doc).then(blob => {
      console.log(blob);
      saveAs(blob, "ContractPreview.docx");
      
      console.log("Document created successfully");
    });
  }

  getCurrentContractClauses(contract_id): void {
    contract_id && this.contractService.getContractClauses(contract_id)
    .pipe(first())
    .subscribe(
      (res) => {
        //console.log('res...any available contracts: ' + JSON.stringify(res));
        this.contract_clauses = res;
      },
      (err) => {
        //console.log('err...' + err.status + " " + err.statusText);
        console.error(err);
      }
    );
  }

  fowardContract(): void {
    let contract_data = new Contract();
    contract_data.id = this.currentContract.id;
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
  this.contractService.updateContract(this.currentContract.id, contract_data).pipe(first()).subscribe((res) => {
    console.log('fowardContract::current user: ' + JSON.stringify(res));
    this.toastr.success('Successfully fowarded Contract!', 'Status');
    this.router.navigateByUrl('/contracts');
  });
}

  revertContract(): void {
    let contract_data = new Contract();
    contract_data.id = this.currentContract.id;;
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

    this.contractService.updateContract(this.currentContract.id, contract_data).pipe(first()).subscribe((res) => {
      console.log('rejectContract::current user: ' + JSON.stringify(res));
      this.toastr.success('Successfully reverted Contract!', 'Status');
      this.router.navigateByUrl('/contracts');
    });
  }

  approveContract(): void {
    let contract_data = new Contract();
    contract_data.id = this.currentContract.id;
    contract_data.contract_status_id = ContractStatus.approved;
    this.contractService.updateContract(this.currentContract.id, contract_data).pipe(first()).subscribe((res) => {
      console.log('approveContract::current user: ' + JSON.stringify(res));
      this.toastr.success('Successfully Approved Contract!', 'Status');
      this.router.navigateByUrl('/contracts');
    });
  }

  rejectContract(): void {
    let contract_data = new Contract();
    contract_data.id = this.currentContract.id;
    contract_data.contract_status_id = ContractStatus.rejected;
    this.contractService.updateContract(this.currentContract.id, contract_data).pipe(first()).subscribe((res) => {
      console.log('rejectContract::current user: ' + JSON.stringify(res));
      this.toastr.success('Successfully rejected Contract!', 'Status');
      this.router.navigateByUrl('/contracts');
    });
  }

  public getSantizeUrl(url : string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  amountToWords(num): string {
    const a = ['','one ','two ','three ','four ', 'five ','six ','seven ','eight ','nine ','ten ','eleven ','twelve ','thirteen ','fourteen ','fifteen ','sixteen ','seventeen ','eighteen ','nineteen '];
    const b = ['', '', 'twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];
    num =num.toString();
    num = num.replace(/[\, ]/g,'');

    var n = num.split(''); 

    if ((num = num.toString()).length > 9) return 'overflow';
    n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return; var str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'only ' : '';
    return str;
  }

}
