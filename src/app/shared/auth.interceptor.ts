import { HTTP_INTERCEPTORS, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = req;
    const token = this.authService.getToken();
    const langkey = this.authService.getLanguage();
    const webflow = this.authService.getWebFlow();
    if (token) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `${token}`,
          language: `${langkey}`,
        },
        // headers: req.headers.set(TOKEN_HEADER_KEY, token),
      });
    }
    // console.log("auth",authReq)
    return next.handle(authReq);
  }
}
// export const authInterceptorProviders = [
//   { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
// ];
