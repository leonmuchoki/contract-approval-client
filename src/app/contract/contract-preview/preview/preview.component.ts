import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { first } from 'rxjs/operators';
import { Packer } from "docx";
import { saveAs } from "file-saver";
import { ActivatedRoute } from '@angular/router';

import { Contract } from 'src/app/models/contract';
import { ContractService } from 'src/app/services/contract.service';

import { DocumentCreator } from './doc-generator';

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
  
  constructor(
    private contractService: ContractService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
    ) { }

  ngOnInit(): void {
    this.loading = true;
    this.route.params.subscribe((params) => {
      console.log(params['contract_id']);
      this.contract_id = params['contract_id'];
    });

    this.contractService.getContract(this.contract_id).pipe(first()).subscribe(contract => {
      this.loading = false;
      console.log('contracts::' + JSON.stringify(contract));
      this.contract = contract;
      this.contract.created_at = new Date(contract.created_at).toDateString();
    });
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
