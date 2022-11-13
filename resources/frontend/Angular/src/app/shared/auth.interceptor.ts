import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler } from "@angular/common/http";
import { TokenService } from "../shared/token.service";
import { AuthService } from "./auth.service";

@Injectable()

export class AuthInterceptor implements HttpInterceptor {
  private skipedUrls: string[] = [
    'http://127.0.0.1:8000/api/auth/login'
  ]
  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const accessToken = this.tokenService.getToken();
    if(!this.skipedUrls.includes(req.url)) {
      if(!accessToken) {
        this.authService.signOut();
      }
      req = req.clone({
        setHeaders: {
          Authorization: "Bearer " + accessToken
        }
      });
    }
    return next.handle(req);
  }
}
