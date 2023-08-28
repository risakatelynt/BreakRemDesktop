import { TestBed } from '@angular/core/testing';
import { SettingsService } from './settings.service';
import { FireNotificationService } from '../services/fire-notification.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { UserService } from './user.service';
import { of, throwError } from 'rxjs';

describe('SettingsService', () => {
  let service: SettingsService;
  let httpTestingController: HttpTestingController;
  let userService: UserService;
  let fireNotificationService: jasmine.SpyObj<FireNotificationService>;

  beforeEach(() => {
    const fireNotificationServiceSpy = jasmine.createSpyObj('FireNotificationService', ['viewReminders']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SettingsService, UserService,
        { provide: FireNotificationService, useValue: fireNotificationServiceSpy }
      ]
    });
    service = TestBed.inject(SettingsService);
    httpTestingController = TestBed.inject(HttpTestingController);
    userService = TestBed.inject(UserService);
    fireNotificationService = TestBed.inject(FireNotificationService) as jasmine.SpyObj<FireNotificationService>;
  });

  afterEach(() => {
    httpTestingController.verify();
    localStorage.clear();
  });

  it('should perform setSettings', () => {
    const settingsMockData = { IsSoundOn: true, IsDndOn: false };
    const responseMock = { resp: 'success' };
    spyOn(userService, 'getToken').and.returnValue('token');
    service.setSettings(settingsMockData).subscribe(response => {
      expect(response).toEqual(responseMock);
    });
    const req = httpTestingController.expectOne(environment.apiUrl + 'settings/set/');
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.has('Authorization')).toBeTruthy();
    req.flush(responseMock);
  });

  it('should perform getSettings', () => {
    const responseMock = { resp: 'success', IsSoundOn: true, IsDndOn: false };
    spyOn(userService, 'getToken').and.returnValue('token');
    service.getSettings().subscribe(response => {
      expect(response).toEqual(responseMock);
    });
    const req = httpTestingController.expectOne(environment.apiUrl + 'settings/');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.has('Authorization')).toBeTruthy();
    req.flush(responseMock);
  });

  it('should send settings to firenotifications service on successful getSettings response', () => {
    const settingsData = {
      'isScreenOn': true,
      'isSoundOn': false,
      'isDndOn': true,
      'defaultSoundName': 'Bubbles',
      'defaultSoundUrl': './assets/bubbles.mp3'
    };
    spyOn(service, 'getSettings').and.returnValue(of({ 'resp': 'success', 'data': settingsData }));
    service.getSettingDetails();
    expect(fireNotificationService.isScreenOn).toBe(true);
    expect(fireNotificationService.isSoundOn).toBe(false);
    expect(fireNotificationService.isDndOn).toBe(true);
    expect(fireNotificationService.defaultSoundName).toBe('Bubbles');
    expect(fireNotificationService.defaultSoundUrl).toBe('./assets/bubbles.mp3');
  });

  it('should handle error when getSettings fails', () => {
    spyOn(service, 'getSettings').and.returnValue(throwError(() => 'Error getting settings'));
    spyOn(console, 'log');
    service.getSettingDetails();
    expect(console.log).toHaveBeenCalledWith('Error getting settings');
  });

});