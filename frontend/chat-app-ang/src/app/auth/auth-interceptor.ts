import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';


@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService){}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (req.withCredentials === undefined || req.withCredentials === false) {
        req = req.clone({
        withCredentials: true
      });
    }
    return next.handle(req);
  }

}
