import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IUser } from '../interfaces/user';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  apiUrl = environment.apiUrl;

  username = '';
  token = '';
  loggedIn = false;
  private httpOptions: any;

  constructor(private http: HttpClient) {
  }

  // Set logged in status in local storage
  setLoggedIn(message: boolean) {
    this.loggedIn = message;
    localStorage.setItem('loggedIn', JSON.stringify(this.loggedIn));
  }

  // Get logged in status from local storage
  getLoggedIn() {
    const isLogged = localStorage.getItem('loggedIn');
    if (isLogged) {
      this.loggedIn = JSON.parse(isLogged);
    }
    return this.loggedIn;
  }

  // Set authentication token in local storage
  setToken(message: string) {
    this.token = message;
    localStorage.setItem('token', this.token);
  }

  // Get authentication token from local storage
  getToken() {
    let token = localStorage.getItem('token');
    if (token) {
      this.token = token;
    }
    return this.token;
  }

  // Delete an item from local storage
  deleteStorage(item) {
    localStorage.removeItem(item);
    this.loggedIn = false;
    this.token = '';
  }

  // Sends user login details to backend
  public login(user: IUser): Observable<any> {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(this.apiUrl + 'login/', user, this.httpOptions).pipe(
      map((data) => {
        if (data && data['token']) {
          this.setToken(data['token']);
          this.setLoggedIn(true);
        }
        return data;
      })
    )
  }

  // sends user signup details to backend
  public signup(user: IUser): Observable<any> {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(this.apiUrl + 'register/', user, this.httpOptions).pipe(
      map((data) => {
        if (data && data['token']) {
          this.setToken(data['token']);
          this.setLoggedIn(true);
        }
        return data;
      })
    )
  }

  // Set the HTTP request options with the authorization token
  setOptions() {
    let token = localStorage.getItem('token');
    console.log(token);
    if (token) {
      this.token = token;
    }

    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Token ${this.token}`
      })
    };
  }

  // Send userprofile to backend
  setUserProfile(profile): Observable<any> {
    this.setOptions();
    return this.http.post(this.apiUrl + 'userprofile/addProfile/', profile, this.httpOptions).pipe(
      map((data) => {
        return data;
      })
    )
  }

  // Send userprofile Image to backend
  setUserImage(profile): Observable<any> {
    let token = localStorage.getItem('token');
    if (token) {
      this.token = token;
    }
    this.httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Token ${this.token}`
      })
    };
    return this.http.post(this.apiUrl + 'userprofile/addImage/', profile, this.httpOptions).pipe(
      map((data) => {
        return data;
      })
    )
  }

  // Get userprofile from backend
  getUserProfile(): Observable<any> {
    let token = localStorage.getItem('token');
    if (token) {
      this.token = token;
    }
    this.httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Token ${this.token}`
      })
    };
    return this.http.get(this.apiUrl + 'userprofile/', this.httpOptions).pipe(
      map((data) => {
        return data;
      })
    )
  }

  // Logout user from app
  logout(): Observable<any> {
    this.setOptions();
    // Send a logout request to the Django backend
    const body = {};
    return this.http.post(this.apiUrl + 'logout/', body, this.httpOptions).pipe(
      map((data) => {
        return data;
      })
    )
  }
}

