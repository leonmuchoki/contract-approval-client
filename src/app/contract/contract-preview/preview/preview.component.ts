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
    });
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

}
