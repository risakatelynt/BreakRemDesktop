import { TestBed } from '@angular/core/testing';
import { RemindersService } from './reminders.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { UserService } from './user.service';
import { IReminder } from '../interfaces/reminder';

describe('RemindersService', () => {
  let service: RemindersService;
  let httpTestingController: HttpTestingController;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RemindersService, UserService]
    });
    service = TestBed.inject(RemindersService);
    httpTestingController = TestBed.inject(HttpTestingController);
    userService = TestBed.inject(UserService);
  });

  afterEach(() => {
    httpTestingController.verify();
    localStorage.clear();
  });

  it('should perform createReminders', () => {
    const mockReminder: IReminder = { content: 'Drink water', reminderDateTime: new Date(), repeat: false };
    const responseMock = { resp: 'success' };
    spyOn(userService, 'getToken').and.returnValue('token');
    service.createReminders(mockReminder).subscribe(response => {
      expect(response).toEqual(responseMock);
    });
    const req = httpTestingController.expectOne(environment.apiUrl + 'reminders/create/');
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.has('Authorization')).toBeTruthy();
    req.flush(responseMock);
  });

  it('should perform getRemindersList', () => {
    const responseMock = [{ id: 1, content: 'Stretch your arms' }, { id: 2, content: 'Drink water' }];
    spyOn(userService, 'getToken').and.returnValue('token');
    service.getRemindersList().subscribe(response => {
      expect(response).toEqual(responseMock);
    });
    const req = httpTestingController.expectOne(environment.apiUrl + 'reminders/');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.has('Authorization')).toBeTruthy();
    req.flush(responseMock);
  });

  it('should perform updateReminder', () => {
    const mockReminder: IReminder = { content: 'Updated Reminder', reminderDateTime: new Date(), repeat: false };
    const responseMock = { resp: 'success' };
    spyOn(userService, 'getToken').and.returnValue('token');
    service.updateReminder(mockReminder, 1).subscribe(response => {
      expect(response).toEqual(responseMock);
    });
    const req = httpTestingController.expectOne(environment.apiUrl + 'reminders/1/update/');
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.has('Authorization')).toBeTruthy();
    req.flush(responseMock);
  });

  it('should perform deleteReminder', () => {
    const responseMock = { resp: 'success' };
    spyOn(userService, 'getToken').and.returnValue('token');
    service.deleteReminder(1).subscribe(response => {
      expect(response).toEqual(responseMock);
    });
    const req = httpTestingController.expectOne(environment.apiUrl + 'reminders/1/delete/');
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.has('Authorization')).toBeTruthy();
    req.flush(responseMock);
  });

  it('should perform deleteReminders', () => {
    const reminderIds = [1, 2];
    const responseMock = { resp: 'success' };
    spyOn(userService, 'getToken').and.returnValue('token');
    service.deleteReminders(reminderIds).subscribe(response => {
      expect(response).toEqual(responseMock);
    });
    const req = httpTestingController.expectOne(environment.apiUrl + 'reminders/delete/');
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.has('Authorization')).toBeTruthy();
    req.flush(responseMock);
  });

});
