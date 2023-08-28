import { TestBed, ComponentFixture, fakeAsync, flush } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { NavigationPanelComponent } from './navigation-panel.component';
import { UserService } from '../../services/user.service';
import { FireNotificationService } from '../../services/fire-notification.service';
import { of, throwError } from 'rxjs';

describe('NavigationPanelComponent', () => {
  let component: NavigationPanelComponent;
  let fixture: ComponentFixture<NavigationPanelComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let fireNotificationServiceSpy: jasmine.SpyObj<FireNotificationService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['logout', 'deleteStorage']);
    const fireNotificationServiceMock = jasmine.createSpyObj('FireNotificationService', [], { currentUrl: '' });
    TestBed.configureTestingModule({
      declarations: [NavigationPanelComponent],
      imports: [RouterTestingModule.withRoutes([])],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: FireNotificationService, useValue: fireNotificationServiceMock },
      ],
    });
    fixture = TestBed.createComponent(NavigationPanelComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    fireNotificationServiceSpy = TestBed.inject(FireNotificationService) as jasmine.SpyObj<FireNotificationService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark link as active and update current URL on goTo()', () => {
    const linkElement = document.createElement('a');
    linkElement.classList.add('nav-link');
    const event = { currentTarget: linkElement };
    const currentUrl = '';
    component.goTo(event, currentUrl);
    expect(linkElement.classList.contains('active')).toBeTrue();
    expect(fireNotificationServiceSpy.currentUrl).toEqual(currentUrl);
  });

  it('should logout successfully', () => {
    userService.logout.and.returnValue(of({ resp: 'success' }));
    const navigateSpy = spyOn(router, 'navigate');
    component.logout();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
    expect(userService.deleteStorage).toHaveBeenCalledWith('loggedIn');
    expect(userService.deleteStorage).toHaveBeenCalledWith('token');
    expect(userService.deleteStorage).toHaveBeenCalledTimes(2);
  });

  it('should handle logout failure', () => {
    userService.logout.and.returnValue(throwError(() => 'Error'));
    component.logout();
    expect(component.isError).toBeTrue();
    expect(component.msg).toEqual('Logout failed. Please try again.');
  });

  it('should set loading to false after timeout', fakeAsync(() => {
    component.timeout();
    expect(component.loading).toBeFalse();
    flush();
  }));
});