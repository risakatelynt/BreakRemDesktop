import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from './user.service';
import { environment } from '../../environments/environment';
import { FireNotificationService } from 'src/app/services/fire-notification.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  apiUrl = environment.apiUrl;
  private httpOptions: any;
  private token = '';
  constructor(private http: HttpClient, private userService: UserService, private fireNotificationService: FireNotificationService) {
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

  // Set user settings
  setSettings(settings): Observable<any> {
    this.setOptions();
    return this.http.post(this.apiUrl + 'settings/set/', settings, this.httpOptions).pipe(
      map((data) => {
        return data;
      })
    )
  }

  // Get user settings
  getSettings(): Observable<any> {
    this.setOptions();
    return this.http.get(this.apiUrl + 'settings/', this.httpOptions).pipe(
      map((data) => {
        return data;
      })
    )
  }

  // get settings details from getSettings service
  getSettingDetails() {
    this.getSettings().subscribe(
      (response) => {
        if (response['resp'] == 'success') {
          const data = response['data'];
          this.fireNotificationService.isScreenOn = data['isScreenOn'];
          this.fireNotificationService.isSoundOn = data['isSoundOn'];
          this.fireNotificationService.isDndOn = data['isDndOn'];
          this.fireNotificationService.defaultSoundName = data['defaultSoundName'];
          this.fireNotificationService.defaultSoundUrl = data['defaultSoundUrl'];
        }
      },
      err => {
        console.log(err);
      }
    );
  }

}
