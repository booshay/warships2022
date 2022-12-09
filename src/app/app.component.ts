import { Component, OnInit } from '@angular/core';
// import {Router} from '@angular/router';
// import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'warships';

  constructor(// public afAuth: AngularFireAuth, public router: Router
    ) { }

  ngOnInit() {
    /*
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.router.navigateByUrl('/home');
      } else {
        this.router.navigateByUrl('/login');
      }
    });
    */
  }
}
