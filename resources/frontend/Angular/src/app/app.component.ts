import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from './shared/token.service';
import { AuthStateService } from './shared/auth-state.service';
import { AuthService } from './shared/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  isSignedIn?: boolean;

  constructor(
    private authService: AuthService,
    private authStateService: AuthStateService,
    public token: TokenService,
  ) {
  }

  ngOnInit() {
    this.authStateService.userAuthState.subscribe(val => {
      this.isSignedIn = val;
    });
  }

  signOut(){
    this.authService.signOut()
  }
}
