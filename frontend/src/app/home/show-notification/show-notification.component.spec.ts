import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Subscription, BehaviorSubject, of } from 'rxjs';
import { ShowNotificationComponent } from './show-notification.component';
import { FireNotificationService } from '../../services/fire-notification.service';

describe('ShowNotificationComponent', () => {
  let component: ShowNotificationComponent;
  let fixture: ComponentFixture<ShowNotificationComponent>;
  let router: jasmine.SpyObj<Router>;
  let fireNotificationService: FireNotificationService;
  let notifySubject: BehaviorSubject<boolean>;
  let fireNotificationServiceMock;

  beforeEach(async () => {
    fireNotificationServiceMock = {
      currentReminder: {},
      notify$: of(true),
      stopAudio: jasmine.createSpy('stopAudio'),
    };

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ShowNotificationComponent],
      providers: [
        { provide: FireNotificationService, useValue: fireNotificationServiceMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowNotificationComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fireNotificationService = TestBed.inject(FireNotificationService);
    notifySubject = fireNotificationService.notify$ as BehaviorSubject<boolean>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set reminderData if currentReminder exists', () => {
    const reminderData = {
      content: 'Stretch limbs',
      reminderDateTime: new Date(),
      repeat: false
    };
    fireNotificationService.currentReminder = reminderData;
    component.ngOnInit();
    expect(component.reminderData).toEqual(reminderData);
    expect(component.isNotification).toBeTrue();
  });

  it('should navigate on closeModal', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    const currentUrl = '/home/create';
    fireNotificationService.currentUrl = currentUrl;
    component.closeModal();
    expect(fireNotificationService.stopAudio).toHaveBeenCalled();
    expect(routerSpy).toHaveBeenCalledWith([currentUrl]);
  });

  it('should unsubscribe on ngOnDestroy', () => {
    const subscriptionMock: Subscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
    component.notifySubscription = subscriptionMock;
    component.ngOnDestroy();
    expect(subscriptionMock.unsubscribe).toHaveBeenCalled();
  });
});
