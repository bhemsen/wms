import { Injectable } from '@angular/core';
import { CookieService } from './cookie.service';

@Injectable({
  providedIn: 'root'
})

export class TokenService {

  private issuer = {
    login: 'http://127.0.0.1:8000/api/auth/login',
    register: 'http://127.0.0.1:8000/api/auth/register'
  };

  constructor(private cookieService: CookieService) { }

  getToken(){
    return this.cookieService.getCookie('auth_token');
  }

  // Verify the token
  isValidToken(){
    const token = this.getToken();

    if(token){
      const payload = this.payload(token);
      if(payload){
        return Object.values(this.issuer).indexOf(payload.iss) > -1 ? true : false;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  payload(token: string) {
    const jwtPayload = token.split('.')[1];
    return JSON.parse(atob(jwtPayload));
  }

  // User state based on valid token
  isLoggedIn() {
    return this.isValidToken();
  }

  // Remove token
  removeToken(){
    this.cookieService.setCookie('autch_token', '', 0, true)
  }
}
