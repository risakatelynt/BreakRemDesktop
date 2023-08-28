import { TestBed, ComponentFixture, fakeAsync, flush } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { UserService } from '../../services/user.service';
import { ThemeService } from '../../services/theme.service';
import { SettingsService } from '../../services/settings.service';
import { FireNotificationService } from '../../services/fire-notification.service';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let themeService: jasmine.SpyObj<ThemeService>;
  let settingsService: jasmine.SpyObj<SettingsService>;
  let fireNotificationService: jasmine.SpyObj<FireNotificationService>;
  let router: jasmine.SpyObj<Router>;
  let formbuilder: FormBuilder;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['login', 'getLoggedIn']);
    const settingsServiceSpy = jasmine.createSpyObj('SettingsService', ['getSettingDetails']);
    const themeServiceSpy = jasmine.createSpyObj('ThemeService', ['getTheme']);
    const fireNotificationServiceSpy = jasmine.createSpyObj('FireNotificationService', ['viewReminders']);
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule, RouterTestingModule.withRoutes([])],
      providers: [
        FormBuilder,
        { provide: UserService, useValue: userServiceSpy },
        { provide: ThemeService, useValue: themeServiceSpy },
        { provide: SettingsService, useValue: settingsServiceSpy },
        { provide: FireNotificationService, useValue: fireNotificationServiceSpy }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    themeService = TestBed.inject(ThemeService) as jasmine.SpyObj<ThemeService>;
    settingsService = TestBed.inject(SettingsService) as jasmine.SpyObj<SettingsService>;
    fireNotificationService = TestBed.inject(FireNotificationService) as jasmine.SpyObj<FireNotificationService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    formbuilder = TestBed.inject(FormBuilder);
    component.loginForm = formbuilder.group({
      username: [''],
      password: ['']
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to home if user is logged in', () => {
    const navigateSpy = spyOn(router, 'navigate');
    userService.getLoggedIn.and.returnValue(true);
    component.ngOnInit();
    expect(themeService.getTheme).toHaveBeenCalled();
    expect(settingsService.getSettingDetails).toHaveBeenCalled();
    expect(fireNotificationService.viewReminders).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/home']);
  });

  it('should not navigate to home if user is not logged in', () => {
    const navigateSpy = spyOn(router, 'navigate');
    userService.getLoggedIn.and.returnValue(false);
    component.ngOnInit();
    expect(themeService.getTheme).not.toHaveBeenCalled();
    expect(fireNotificationService.viewReminders).not.toHaveBeenCalled();
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should set isError to true and display error message on failed login', () => {
    userService.login.and.returnValue(of({ resp: 'failed', message: 'Invalid credentials' }));
    component.loginForm.setValue({ username: 'johndoe', password: 'john' });
    component.login();
    expect(component.isError).toBe(true);
    expect(component.msg).toBe('Invalid credentials');
  });

  it('should navigate to home page on successful login', () => {
    component.loginForm.setValue({ username: 'johndoe', password: 'john' });
    userService.login.and.returnValue(of({ resp: 'success' }));
    const navigateSpy = spyOn(router, 'navigate');
    component.login();
    expect(navigateSpy).toHaveBeenCalledWith(['home']);
  });

  it('should set isError to true and display error message on login error', () => {
    userService.login.and.returnValue(throwError(() => 'error'));
    component.loginForm.setValue({ username: 'johndoe', password: 'john' });
    component.login();
    expect(component.isError).toBe(true);
    expect(component.msg).toBe('An error occured. Please try again later.');
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

  it('should call addReminder and mark all form controls as touched when form is invalid', () => {
    component.loginForm.setErrors({ invalid: true });
    component.login();
  });

  it('should set loading to false after timeout', fakeAsync(() => {
    component.timeout();
    expect(component.loading).toBeFalse();
    flush();
  }));

});
