import { Component, OnInit, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {Router} from '@angular/router';

import {AuthService} from '../auth.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {

  loginForm: FormGroup;

  constructor(private fb: FormBuilder, public auth: AuthService, public afAuth: AngularFireAuth, public router: Router) { }

  user = {
    username: '',
    password: ''
  };

  @ViewChild('nameRef', {static: false}) nameElementRef: ElementRef;

  ngAfterViewInit() {
    this.nameElementRef.nativeElement.focus();
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: '',
      password: ''
    });
  }

  emailLogin() {
    const formValue = this.loginForm.value;
    if (formValue.username.slice(-4) !== '.com') {
    formValue.username = formValue.username + '@warship.com';
    }
    this.auth.emailLogin(formValue);
  }
}




