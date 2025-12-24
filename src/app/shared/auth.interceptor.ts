import { HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let authReq = req;
    const token = this.authService.getToken();
    const langkey = this.authService.getLanguage();
    if (token) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `${token}`,
          language: `${langkey}`,
        },
        // headers: req.headers.set('Authorization', token),
      });
    }
    // console.log("auth",authReq)
    return next.handle(authReq);
  }
}
// export const authInterceptorProviders = [
//   { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
// ];
