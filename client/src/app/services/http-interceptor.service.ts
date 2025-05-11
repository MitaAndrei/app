import {Injectable, Provider} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {BehaviorSubject, catchError, filter, Observable, take, throwError} from "rxjs";
import {AuthService} from "./auth.service";
import {switchMap} from "rxjs/operators";
import {TokenResponse} from "../models/TokenResponse";

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    const authReq = token ? this.addToken(request, token) : request;

    return next.handle(authReq).pipe(
      catchError(error => {
        console.log('ERROR STATUS:', error.status);
        console.log('Request URL:', request.url);
        if (error.status === 401 && !request.url.includes('/auth/refresh-token')) {
          console.log("TRIG")
          return this.handle401Error(request, next);
        }
        return throwError(error);
      })
    );
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((tokens: TokenResponse) => {
          this.isRefreshing = false;
          this.authService.setTokens(tokens);
          this.refreshTokenSubject.next(tokens.accessToken);
          return next.handle(this.addToken(req, tokens.accessToken));
        }),
        catchError(err => {
          this.isRefreshing = false;
          this.authService.logOut();
          return throwError(err);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(token => next.handle(this.addToken(req, token!)))
      );
    }
  }

  private addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }
}


export const noopInterceptorProvider: Provider =
  { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true };


