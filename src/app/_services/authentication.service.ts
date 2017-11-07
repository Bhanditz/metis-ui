﻿import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';

import { environment } from '../../environments/environment';
import { User } from '../_models';

@Injectable()
export class AuthenticationService {

  private readonly key = 'currentUser';

  private token: string;

  public currentUser = null;

  constructor(public router: Router,
              private http: HttpClient) {
    // set currentUser and token if already saved in local storage
    const value = sessionStorage.getItem(this.key);
    if (value) {
      const hash = JSON.parse(value);
      this.currentUser = hash.user;
      this.token = hash.token;
    }
  }

  validatedUser(): boolean {
    return sessionStorage.getItem(this.key) !== null;
  }

  getToken(): string {
    return this.token;
  }

  register(email: string, password: string) {
    const fn = `register(email='${email}',password='${password}'`;
    const url = `${environment.apiHost}/${environment.apiRegister}`;
    const headers = new HttpHeaders({Authorization: 'Basic ' + btoa(email + ':' + password)});
    return this.http.post(url, '', { headers: headers }).map(data => {
      // registration successful
        console.log(`${fn} => OK`);
        return true;
      });
  }

  login(email: string, password: string) {
    const fn = `login(email='${email}',password='${password}')`;
    const url = `${environment.apiHost}/${environment.apiLogin}`;
    const headers = new HttpHeaders({Authorization: 'Basic ' + btoa(email + ':' + password)});
    return this.http.post(url, '', { headers: headers }).map(data => {
      const user = <User>data;
      if (user && user.metisUserAccessToken) {
        // set token property
        this.currentUser = user;
        this.token = user.metisUserAccessToken.accessToken;

        // store email and jwt token in local storage to keep user logged in between page refreshes
        sessionStorage.setItem(this.key, JSON.stringify({ user: user, email: email, token: this.token }));

        // return true to indicate successful login
        console.log(`${fn} => OK`);
        return true;
      } else {
        // return false to indicate failed login
        console.log(`${fn} => NOK (token missing)`);
        return false;
      }
    });
  }

  logout(): void {
    // clear token remove user from local storage to log user out
    this.currentUser = null;
    this.token = null;
    sessionStorage.removeItem(this.key);
  }
}