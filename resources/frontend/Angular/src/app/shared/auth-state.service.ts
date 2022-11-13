import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { TokenService } from '../shared/token.service';

@Injectable({
  providedIn: 'root'
})

export class AuthStateService {

  private userState = new BehaviorSubject<boolean>(this.token.isLoggedIn());
  userAuthState = this.userState.asObservable();

  constructor(
    public token: TokenService,
    public router: Router,
  ) { }

  setAuthState(value: boolean) {
    this.userState.next(value);
  }
}
