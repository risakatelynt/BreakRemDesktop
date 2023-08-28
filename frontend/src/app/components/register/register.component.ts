import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  signUpForm!: FormGroup;
  msg = '';
  isError = false;
  loading = false;
  constructor(private formBuilder: FormBuilder, private userService: UserService, private router: Router) { }

  // ngOnInit initializes the signUpForm with form controls
  ngOnInit(): void {
    this.signUpForm = this.formBuilder.group({
      username: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required]
    })
  }

  // getEmailErrorMessage returns an error message based on the email form control's validation
  getEmailErrorMessage(control): string {
    if (control.hasError('required')) {
      return 'Please enter email';
    }
    if (control.hasError('email')) {
      return 'Please enter a valid email';
    }
    return '';
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

  // signUp submits the signUpForm
  signUp() {
    if (this.signUpForm.valid) {
      this.loading = true;
      this.userService.signup(this.signUpForm.value).subscribe(
        (response) => {
          if (response['resp'] == 'success') {
            this.router.navigate(['/home']);
          } else if (response['resp'] == 'failed') {
            this.isError = true;
            this.msg = response['message'];
            this.timeout();
          }
        },
        err => {
          this.msg = 'An error occured. Please try again later.';
          console.log(err);
          this.isError = true;
          this.timeout();
        }
      );
    } else {
      this.signUpForm.markAllAsTouched();
    }
  }

  // timeout sets a timeout to hide the loading spinner after a delay
  timeout() {
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

}
