import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SettingsService } from '../../services/settings.service';
import { UserService } from '../../services/user.service';
import { FireNotificationService } from 'src/app/services/fire-notification.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm!: FormGroup
  msg = '';
  isError = false;
  loading = false;
  loggedIn = false;

  constructor(private formbuilder: FormBuilder, private userService: UserService, private themeService: ThemeService, private fireNotificationService: FireNotificationService, private settingsService: SettingsService, private router: Router) { }

  // ngOnInit initializes the login form and handles auto-login if user is already logged in
  ngOnInit(): void {
    this.loginForm = this.formbuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.loggedIn = this.userService.getLoggedIn();
    // If user is already logged in, retrieve theme, view reminders, and navigate to home
    if (this.loggedIn) {
      this.themeService.getTheme();
      this.settingsService.getSettingDetails();
      this.fireNotificationService.viewReminders();
      this.router.navigate(['/home']);
    }
  }

  // isInvalid checks if a form field is invalid and has been touched or dirty
  isInvalid(field): boolean {
    if (field) {
      if (field.invalid && (field.dirty || field.touched)) {
        return true;
      }
    }
    return false;
  }

  // login submits the login form
  login() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.userService.login(this.loginForm.value).subscribe(
        (response) => {
          if (response['resp'] == 'success') {
            this.timeout();
            this.router.navigate(['home']);
          } else if (response['resp'] == 'failed') {
            this.isError = true;
            this.msg = response['message'];
            this.timeout();
          }
        },
        err => {
          console.log(err);
          this.isError = true;
          this.msg = 'An error occured. Please try again later.';
          this.timeout();
        }
      );
    } else {
      // Mark all form fields as touched to display validation errors
      this.loginForm.markAllAsTouched();
    }
  }

  // timeout sets a timeout to hide the loading spinner after a delay
  timeout() {
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }
}
