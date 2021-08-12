import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';

import { ContractEntity } from 'src/app/models/contract';
import { EntityService } from 'src/app/services/entity.service';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-entity',
  templateUrl: './entity.component.html',
  styleUrls: ['./entity.component.css']
})
export class EntityComponent implements OnInit {

  loading = false;
  currentUser: User;
  entities: ContractEntity[];
  displayedColumns: string[] = ['entity_name', 'description'];

  constructor(
    private entityService: EntityService,
    private router: Router,
    private authService: AuthService
  ) {
    this.authService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit(): void {
    this.entityService.getAllEntities().pipe(first()).subscribe(entities => {
      this.loading = false;
      console.log('entities::' + JSON.stringify(entities))
      this.entities = entities.map((c) => {
        return {
          entity_name: c?.entity_name,
          description: c?.description
        }
      });
    });
  }

  redirectToEntityCreate(): void {
    this.router.navigateByUrl('/entity/create');
  }

}
