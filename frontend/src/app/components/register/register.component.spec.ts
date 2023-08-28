import { TestBed, ComponentFixture, fakeAsync, flush } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { of, throwError } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let router: jasmine.SpyObj<Router>;
  let formbuilder: FormBuilder;

  beforeEach(() => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['signup']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      providers: [
        FormBuilder,
        { provide: UserService, useValue: userServiceSpy },
        { provide: Router, useValue: routerSpy }
      ],
      imports: [ReactiveFormsModule]
    });
    fixture = TestBed.createComponent(RegisterComponent);
    formbuilder = TestBed.inject(FormBuilder);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    component.signUpForm = formbuilder.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a signUpForm with correct form controls', () => {
    component.ngOnInit();
    const signUpForm = component.signUpForm;
    expect(signUpForm).toBeDefined();
    expect(signUpForm.get('username')).toBeDefined();
    expect(signUpForm.get('email')).toBeDefined();
    expect(signUpForm.get('password')).toBeDefined();
  });

  it('should return "Please enter email" if control has required error', () => {
    const controlWithRequiredError = { hasError: (error) => error === 'required' };
    const errorMessage = component.getEmailErrorMessage(controlWithRequiredError);
    expect(errorMessage).toBe('Please enter email');
  });

  it('should return "Please enter a valid email" if control has email error', () => {
    const controlWithEmailError = { hasError: (error) => error === 'email' };
    const errorMessage = component.getEmailErrorMessage(controlWithEmailError);
    expect(errorMessage).toBe('Please enter a valid email');
  });

  it('should return an empty string if control has no errors', () => {
    const controlWithNoError = { hasError: () => false };
    const errorMessage = component.getEmailErrorMessage(controlWithNoError);
    expect(errorMessage).toBe('');
  });

  it('should navigate to home page on successful signup', () => {
    userService.signup.and.returnValue(of({ resp: 'success' }));
    component.signUpForm.setValue({
      username: 'johndoe',
      email: 'johndoe@example.com',
      password: 'password'
    });
    component.signUp();
    expect(userService.signup).toHaveBeenCalledWith({
      username: 'johndoe',
      email: 'johndoe@example.com',
      password: 'password'
    });
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should show error message on failed signup', () => {
    const errorMessage = 'Username already taken.';
    userService.signup.and.returnValue(of({ resp: 'failed', message: errorMessage }));
    component.signUpForm.setValue({
      username: 'johndoe',
      email: 'johndoe@example.com',
      password: 'password'
    });
    component.signUp();
    expect(userService.signup).toHaveBeenCalled();
    expect(component.isError).toBe(true);
    expect(component.msg).toBe(errorMessage);
  });

  it('should handle error on signup', () => {
    userService.signup.and.returnValue(throwError('Internal server error'));
    component.signUpForm.setValue({
      username: 'johndoe',
      email: 'johndoe@example.com',
      password: 'password'
    });
    component.signUp();
    expect(userService.signup).toHaveBeenCalled();
    expect(component.isError).toBe(true);
    expect(component.msg).toBe('An error occured. Please try again later.');
  });

  it('should mark form controls as touched on invalid submit', () => {
    component.signUp();
    expect(component.signUpForm.controls['username'].touched).toBe(true);
    expect(component.signUpForm.controls['email'].touched).toBe(true);
    expect(component.signUpForm.controls['password'].touched).toBe(true);
  });

  it('should return true for isInvalid when field is invalid and dirty', () => {
    const field = {
      invalid: true,
      dirty: true,
      touched: true,
    };
    expect(component.isInvalid(field)).toBeTruthy();
  });

  it('should return true for isInvalid when field is invalid and touched', () => {
    const field = {
      invalid: true,
      dirty: false,
      touched: true,
    };
    expect(component.isInvalid(field)).toBeTruthy();
  });

  it('should return false for isInvalid', () => {
    const field = false;
    expect(component.isInvalid(field)).toBeFalsy();
  });

  it('should set loading to false after timeout', fakeAsync(() => {
    component.timeout();
    expect(component.loading).toBeFalse();
    flush();
    setTimeout(() => {
      expect(component.loading).toBeFalse();
    }, 1000);
    flush();
  }));

});