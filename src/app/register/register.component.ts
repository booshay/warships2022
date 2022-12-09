import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Router} from '@angular/router';

import {AuthService} from '../auth.service';
import {PasswordValidator} from '../shared/password.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registrationForm: FormGroup;

  constructor(private fb: FormBuilder, public auth: AuthService, public router: Router) { }


  ngOnInit() {
    this.registrationForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: '',
      subscribe: false
    },
    {validator: PasswordValidator});
    this.registrationForm.get('subscribe').valueChanges
      .subscribe(checkedValue => {
        const email = this.registrationForm.get('email');
        if (checkedValue) {
          email.setValidators(Validators.required);
        } else {
          email.clearValidators();
        }
        email.updateValueAndValidity();
      });
  }

  register() {
    const formValue = this.registrationForm.value;
    formValue.username = formValue.username + '@warship.com';
    this.auth.register(formValue);
  }

  cancel(event: Event) {
    event.preventDefault();
    this.router.navigateByUrl('/login');
  }
}
