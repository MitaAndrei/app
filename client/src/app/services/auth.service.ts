import { HttpClient } from '@angular/common/http';
import {Injectable, signal} from '@angular/core';
import { Observable } from 'rxjs';
import {SignUpCredentials} from "../models/SignUpCredentials";
import {LogInCredentials} from "../models/LogInCredentials";
import {User} from "../models/User";
import {TokenResponse} from "../models/TokenResponse";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router ){ }

  baseApiUrl: string = `https://localhost:7225/api/`
  currentUserSig = signal<User | null | undefined>(undefined);

  signUp(credentials: SignUpCredentials): Observable<any>{
    return this.http.post<SignUpCredentials>(this.baseApiUrl + 'auth/register', credentials);
  }

  logIn(credentials: LogInCredentials): Observable<TokenResponse>{
    return this.http.post<TokenResponse>(this.baseApiUrl + 'auth/login', credentials);
  }

  logOut(){
    localStorage.clear();
    this.currentUserSig.set(null);
    this.router.navigate(['/']);
  }

  getCurrentUser(): Observable<User>{
    return this.http.get<User>(this.baseApiUrl + 'user');
  }

  refreshToken(): Observable<TokenResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post<TokenResponse>(this.baseApiUrl + 'auth/refresh-token', {refreshToken: refreshToken});
  }

  setTokens(tokens: TokenResponse){
    localStorage.setItem('refreshToken', tokens.refreshToken);
    localStorage.setItem('token', tokens.accessToken);
  }

}
