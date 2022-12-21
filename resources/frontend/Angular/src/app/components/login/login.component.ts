import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './../../shared/auth.service';
import { FormBuilder, FormGroup } from "@angular/forms";
import { TokenService } from '../../shared/token.service';
import { AuthStateService } from '../../shared/auth-state.service';
import { CookieService } from 'src/app/shared/cookie.service';

export interface Errors {
  email: string;
  password: string;
  error: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errors?: Errors;

  constructor(
    public router: Router,
    public fb: FormBuilder,
    public authService: AuthService,
    private authState: AuthStateService,
    private cookieService: CookieService,
  ) {
    this.loginForm = this.fb.group({
      email: [],
      password: []
    })
  }

  ngOnInit() { }

  onSubmit() {
    this.authService.signin(this.loginForm.value).subscribe(
      result => {
        this.responseHandler(result);
      },
      error => {
        this.errors = error.error;
      },() => {
        this.authState.setAuthState(true);
        this.loginForm.reset();
        this.router.navigate(['dashboard']);
      }
    );
  }

  // Handle response
  responseHandler(data: any){
    console.log(data)
    this.cookieService.setCookie('auth_token', data.access_token);
  }

}
