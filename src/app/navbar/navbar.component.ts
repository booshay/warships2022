import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(public auth: AuthService, public router: Router ) { }
  page: string;
  ngOnInit() {
  this.page = this.router.url.substr(1);
  }

  signOut() {
    this.router.navigateByUrl('/login');
    this.auth.signOut();
  }

}
