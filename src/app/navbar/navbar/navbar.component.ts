import { Component, OnInit } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  currentUser: User;
  
  constructor(private router: Router, private auth: AuthService) {
    this.auth.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit(): void {
    console.log('currentUser: ' + JSON.stringify(this.currentUser));
    
    console.log('currentUser name: ' + this.currentUser.auth_token);
  }

  redirectLoginPage(): void {
    this.router.navigateByUrl('/login');
  }

  logoutUser(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
