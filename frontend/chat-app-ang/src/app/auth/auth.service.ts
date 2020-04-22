import { Injectable } from '@angular/core';
import { AuthData } from './auth-data.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: string;
  private isAuthenticated = false;
  private timerToken: any;
  private userId: string;
  private username: string;

  private authListener = new Subject<boolean>();

  constructor(
    private http: HttpClient,
    private router: Router
    ) { }

  getUserId() {
    return this.userId;
  }

  getUsername() {
    return this.username;
  }

  getAuthStatus() {
    return this.isAuthenticated;
  }

  getToken() {
    return this.token;
  }

  createUser(username: string, email: string, password: string,
             firstName: string, lastName: string) {
    const authData: AuthData = {
      username,
      email,
      password,
      firstName,
      lastName
    };
    this.http.post('http://localhost:3000/user/signup', authData)
    .subscribe(response => {
      console.log(response);
    });
  }

  getCookie(){
    this.http.get<{message: string}>('http://localhost:3000/user/name')
    .subscribe(response => {
      console.log('GETNAME RESPONSE: ' + response.message);
    });
  }

  login(username: string, password: string) {
    const authData: AuthData = {
      username,
      email: null,
      password,
      firstName: null,
      lastName: null
    };
    console.log(authData.password);
    this.http.post<{
      expires: number,
      userId: string,
      username: string,
      firstName: string,
      lastName: string
    }>('http://localhost:3000/user/login', authData)
    .subscribe(response => {
        const expiresIn = response.expires;
        this.setAuthTimer(expiresIn);
        this.isAuthenticated = true;
        this.authListener.next(true);
        this.userId = response.userId;
        this.username = response.username;
        const now = new Date();
        const expiration = new Date(now.getTime() + expiresIn * 1000);
        this.saveAuthData(
          expiration,
          this.userId,
          this.username
          );
        this.router.navigate(['/']);
    });
  }

  logout() {
    this.http.get<{message: string}>('http://localhost:3000/user/logout')
    .subscribe(res => {
      console.log(res.message);
      this.token = null;
      this.isAuthenticated = false;
      this.authListener.next(false);
      clearTimeout(this.timerToken);
      this.clearAuthData();
      this.userId = null;
      this.username = null;
      this.router.navigate(['/user/login']);
    });
  }

  autoAuthUser() {
    const authInfo = this.getAuthData();
    if (!authInfo) {
      return;
    }
    const now = new Date();
    const expires = authInfo.expiration.getTime() - now.getTime();
    if (expires > 0) {
      this.isAuthenticated = true;
      this.userId = authInfo.userId;
      this.username = authInfo.username;
      this.getCookie();
      this.setAuthTimer(expires / 1000);
      this.authListener.next(true);
    }
  }
  private saveAuthData(/*token: string,*/expire: Date, userId: string, username: string) {
    localStorage.setItem('expiration', expire.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('username', username);
  }

  private clearAuthData() {
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
  }

  private getAuthData() {
    const expiration = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    if (!expiration) {
      return;
    }
    return {
      expiration: new Date(expiration),
      userId,
      username
    };
  }

  private setAuthTimer(duration: number) {
    this.timerToken = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  getAuthListener() {
    return this.authListener.asObservable();
  }
}
