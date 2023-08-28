import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HomeComponent } from './home.component';
import { UserService } from '../services/user.service';
import { FireNotificationService } from '../services/fire-notification.service';
import { RemindersService } from '../services/reminders.service';
import { NavigationPanelComponent } from './navigation-panel/navigation-panel.component';
import { Router } from '@angular/router';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let fireNotificationService: jasmine.SpyObj<FireNotificationService>;
  let remindersService: jasmine.SpyObj<RemindersService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const fireNotificationServiceSpy = jasmine.createSpyObj('FireNotificationService', ['viewReminders']);
    const remindersService = jasmine.createSpyObj('RemindersService', ['viewReminders']);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [HomeComponent, NavigationPanelComponent],
      providers: [
        {
          provide: UserService,
          useValue: { getLoggedIn: () => false }
        },
        { provide: RemindersService, useValue: remindersService },
        { provide: FireNotificationService, useValue: fireNotificationServiceSpy }
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    remindersService = TestBed.inject(RemindersService) as jasmine.SpyObj<RemindersService>;
    fireNotificationService = TestBed.inject(FireNotificationService) as jasmine.SpyObj<FireNotificationService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /login if not logged in', () => {
    spyOn(userService, 'getLoggedIn').and.returnValue(false);
    const routerSpy = spyOn(component['router'], 'navigate');
    component.ngOnInit();
    expect(routerSpy).toHaveBeenCalledWith(['/login']);
  });

  it('should navigate to /home/view if logged in', () => {
    spyOn(userService, 'getLoggedIn').and.returnValue(true);
    const routerSpy = spyOn(component['router'], 'navigate');
    component.ngOnInit();
    expect(routerSpy).toHaveBeenCalledWith(['/home/view']);
  });
});
