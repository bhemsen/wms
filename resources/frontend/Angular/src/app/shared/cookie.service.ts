import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CookieService {

  constructor() { }

  setCookie(cname: string, cvalue: string, ttl: number = 60 * 60 * 1000, reset: boolean = false) {
    const d = new Date();
    d.setTime(d.getTime() + ttl);
    let expires;
    if (!reset) {
      expires = 'expires=' + d.toUTCString();
      document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
    } else {
      document.cookie = `${cname}=; Max-Age=0; path=/; SameSite=Strict; Secure`;
    }
  }

  getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts?.pop()?.split(';').shift();
    return '';
  }
}
