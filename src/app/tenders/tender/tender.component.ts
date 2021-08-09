import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Tender } from 'src/app/models/tender';
import { TenderService } from 'src/app/services/tender.service';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-tender',
  templateUrl: './tender.component.html',
  styleUrls: ['./tender.component.css']
})
export class TenderComponent implements OnInit {

  loading = false;
  currentUser: User;
  tenders: Tender[];
  displayedColumns: string[] = ['title', 'description'];

  constructor(
    private tenderService: TenderService,
    private router: Router,
    private authService: AuthService
    ) { 
      this.authService.currentUser.subscribe(x => this.currentUser = x);
    }

  ngOnInit(): void {
    this.tenderService.getAllTenders().pipe(first()).subscribe(tenders => {
      this.loading = false;
      console.log('tenders::' + JSON.stringify(tenders))
      this.tenders = tenders.map((c) => {
        return {
          title: c?.title,
          description: c?.description
        }
      });
    });
  }

  redirectToTenderCreate(): void {
    this.router.navigateByUrl('/tender_create');
  }
}
