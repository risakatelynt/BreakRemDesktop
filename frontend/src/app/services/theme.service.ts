import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from './user.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  apiUrl = environment.apiUrl;

  private httpOptions: any;
  private token = '';
  selectedTheme = '';
  constructor(private http: HttpClient, private userService: UserService) {
  }

  // Set the HTTP request options with the authorization token
  setOptions() {
    this.token = this.userService.getToken();
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Token ${this.token}`
      })
    };
  }

  // send theme details to backend
  setThemeService(theme: string): Observable<any> {
    this.setOptions();
    return this.http.post(this.apiUrl + 'theme/set/', { theme }, this.httpOptions).pipe(
      map((data) => {
        return data;
      })
    )
  }

  // get theme details from backend
  getThemeService(): Observable<any> {
    this.setOptions();
    return this.http.get(this.apiUrl + 'theme/', this.httpOptions).pipe(
      map((data) => {
        return data;
      })
    )
  }

  // set theme to body
  setTheme(theme: string) {
    const body = document.querySelector('body');
    if (body) {
      body.className = theme; // Apply the theme class to the body tag
    }
  }

  // get theme from getThemeService
  getTheme() {
    this.getThemeService().subscribe(
      (response) => {
        if (response['resp'] == 'success') {
          // Retrieve the user's theme preference from the server and apply it
          this.selectedTheme = response['theme'];
          this.setTheme(this.selectedTheme);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }


}
