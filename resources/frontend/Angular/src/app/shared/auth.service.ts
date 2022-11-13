import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { TokenService } from './token.service';
import { Router } from '@angular/router';
import { AuthStateService } from './auth-state.service';
import { environment } from 'src/environments/environment';

// User interface
export interface User {
  name: String;
  email: String;
  password: String;
  password_confirmation: String
}

@Injectable({
  providedIn: 'root'
})

export class AuthService implements OnDestroy {
  notifier$ = new Subject()
  baseApi: string = environment.baseApi + 'auth/'

  constructor(
    private http: HttpClient,
    private token: TokenService,
    private router: Router,
    private auth: AuthStateService
    ) { }

  // User registration
  register(user: User): Observable<any> {
    return this.http.post(this.baseApi + 'register', user).pipe(takeUntil(this.notifier$));
  }

  // Login
  signin(user: User): Observable<any> {
    return this.http.post<any>(this.baseApi + 'login', user).pipe(takeUntil(this.notifier$));
  }

  // Access user profile
  profileUser(): Observable<any> {
    return this.http.get(this.baseApi + 'user-profile').pipe(takeUntil(this.notifier$));
  }

  // kill requests
  killRequest(): void {
    this.notifier$.next(null);
    this.notifier$.complete();
  }

  // Signout
  signOut() {
    this.killRequest();
    this.auth.setAuthState(false);
    this.token.removeToken();
    this.router.navigate(['login']);
  }


  ngOnDestroy(): void {
    this.killRequest();
  }
}
