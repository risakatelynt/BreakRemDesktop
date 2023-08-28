import { TestBed, ComponentFixture, fakeAsync, flush } from '@angular/core/testing';
import { ViewRemindersComponent } from './view-reminders.component';
import { RemindersService } from '../../services/reminders.service';
import { FireNotificationService } from '../../services/fire-notification.service';
import { DatePipe } from '@angular/common';
import { of, throwError } from 'rxjs';

describe('ViewRemindersComponent', () => {
  let component: ViewRemindersComponent;
  let fixture: ComponentFixture<ViewRemindersComponent>;
  let mockReminderService: jasmine.SpyObj<RemindersService>;
  let mockFireNotificationService: jasmine.SpyObj<FireNotificationService>;
  let mockDatePipe: jasmine.SpyObj<DatePipe>;

  beforeEach(() => {
    const reminderServiceSpy = jasmine.createSpyObj('RemindersService', ['getRemindersList', 'deleteReminder', 'deleteReminders']);
    const fireNotificationServiceSpy = jasmine.createSpyObj('FireNotificationService', ['viewReminders'], {
      notify$: of(true)
    });
    mockDatePipe = jasmine.createSpyObj('DatePipe', ['transform']);

    TestBed.configureTestingModule({
      declarations: [ViewRemindersComponent],
      providers: [
        { provide: RemindersService, useValue: reminderServiceSpy },
        { provide: FireNotificationService, useValue: fireNotificationServiceSpy },
        { provide: DatePipe, useValue: mockDatePipe }
      ]
    });

    fixture = TestBed.createComponent(ViewRemindersComponent);
    component = fixture.componentInstance;
    mockReminderService = TestBed.inject(RemindersService) as jasmine.SpyObj<RemindersService>;
    mockFireNotificationService = TestBed.inject(FireNotificationService) as jasmine.SpyObj<FireNotificationService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch and populate reminder list on ngOnInit', () => {
    const mockResponse = { resp: 'success', data: [{ content: 'Drink water', reminderDateTime: new Date(), repeat: false }] };
    const mockReminderList = [{ id: 1, content: 'Drink water', reminderDateTime: new Date(), repeat: false }, { id: 2, content: 'Drink water', reminderDateTime: new Date(), repeat: false },
    { id: 3, content: 'Drink water', reminderDateTime: new Date(), repeat: true }];
    component.reminderList = mockReminderList;
    mockReminderService.getRemindersList.and.returnValue(of(mockResponse));
    component.ngOnInit();
    expect(component.loading).toBe(true);
    expect(component.isError).toBe(false);
  });

  it('should set isError to true and display error message', () => {
    mockReminderService.getRemindersList.and.returnValue(of({ resp: 'failed' }));
    component.ngOnInit();
    expect(component.isError).toBe(true);
    expect(component.msg).toBe('An error occured. Please try again.');
  });

  it('should handle error while fetching reminder list on ngOnInit', () => {
    mockReminderService.getRemindersList.and.returnValue(throwError(() => 'Error'));
    component.ngOnInit();
    expect(component.loading).toBe(true);
    expect(component.isError).toBe(true);
    expect(component.msg).toBe('An error occured. Please try again.');
  });

  it('should set allIds from reminderList', () => {
    const mockReminderList = [{ id: 1, content: 'Drink water', reminderDateTime: new Date(), repeat: false }, { id: 2, content: 'Drink water', reminderDateTime: new Date(), repeat: false },
    { id: 3, content: 'Drink water', reminderDateTime: new Date(), repeat: true }];
    component.reminderList = mockReminderList;
    component.setAllIds();
    expect(component.allIds).toEqual([1, 2, 3]);
  });

  it('should format date using DatePipe', () => {
    const mockDateTime = new Date('2023-08-10T12:00:00');
    mockDatePipe.transform.and.returnValue('10 Aug 2023 12:00 PM');
    const formattedDate = component.getFormattedDate(mockDateTime);
    expect(formattedDate).toBe('10 Aug 2023 12:00 PM');
  });

  it('should add id to selectedIds on checkbox change', () => {
    component.selectedIds = [1, 2];
    const event = { target: { checked: true } };
    component.onCheckboxChange(event, 3);
    expect(component.selectedIds).toEqual([1, 2, 3]);
  });

  it('should remove id from selectedIds on checkbox change', () => {
    component.selectedIds = [1, 2, 3];
    const event = { target: { checked: false } };
    component.onCheckboxChange(event, 2);
    expect(component.selectedIds).toEqual([1, 3]);
  });

  it('should select all ids', () => {
    component.allIds = [1, 2, 3];
    const event = { target: { checked: true } };
    component.selectAll(event);
    expect(component.selectedIds).toEqual([1, 2, 3]);
  });

  it('should clear selectedIds on deselect all', () => {
    component.selectedIds = [1, 2, 3];
    const event = { target: { checked: false } };
    component.selectAll(event);
    expect(component.selectedIds).toEqual([]);
  });

  it('should delete reminder and refresh list on successful delete', () => {
    mockReminderService.deleteReminder.and.returnValue(of({ resp: 'success' }));
    mockReminderService.getRemindersList.and.returnValue(of({ resp: 'success' }));
    const mockReminderList = [{ id: 1, content: 'Drink water', reminderDateTime: new Date(), repeat: false }, { id: 2, content: 'Drink water', reminderDateTime: new Date(), repeat: false },
    { id: 3, content: 'Drink water', reminderDateTime: new Date(), repeat: true }];
    component.reminderList = mockReminderList;
    component.deleteRem(1);
    expect(component.msg).toBe('Deleted successfully!');
  });

  it('should set isError to true and display error message if failed to delete', () => {
    mockReminderService.deleteReminder.and.returnValue(of({ resp: 'failed', message: 'Failed to delete.' }));
    component.deleteRem(1);
    expect(component.isError).toBe(true);
    expect(component.msg).toBe('Failed to delete.');
  });

  it('should handle error on delete reminder', () => {
    mockReminderService.deleteReminder.and.returnValue(throwError(() => 'Error'));
    component.deleteRem(1);
    expect(component.isError).toBe(true);
    expect(component.msg).toBe('An error occured. Please try again.');
    expect(component.loading).toBe(false);
  });

  it('should delete selected reminders and refresh list on successful delete', () => {
    mockReminderService.deleteReminders.and.returnValue(of({ resp: 'success' }));
    mockReminderService.getRemindersList.and.returnValue(of({ resp: 'success' }));
    const mockReminderList = [{ id: 1, content: 'Drink water', reminderDateTime: new Date(), repeat: false }, { id: 2, content: 'Drink water', reminderDateTime: new Date(), repeat: false },
    { id: 3, content: 'Drink water', reminderDateTime: new Date(), repeat: true }];
    component.reminderList = mockReminderList;
    component.selectedIds = [1, 2];
    component.deleteAll();
    expect(component.msg).toBe('Deleted successfully!');
  });

  it('should set isError to true and display error message if failed to delete all', () => {
    mockReminderService.deleteReminders.and.returnValue(of({ resp: 'failed', message: 'Failed to delete.' }));
    component.deleteAll();
    expect(component.isError).toBe(true);
    expect(component.msg).toBe('Failed to delete.');
  });

  it('should handle error on delete selected reminders', () => {
    mockReminderService.deleteReminders.and.returnValue(throwError(() => 'Error'));
    component.selectedIds = [1, 2];
    component.deleteAll();
    expect(component.isError).toBe(true);
    expect(component.msg).toBe('An error occured. Please try again.');
    expect(component.loading).toBe(false);
  });

  it('should open create reminder modal', () => {
    component.openCreateRem({ title: 'Stretch limbs' });
    expect(component.loading).toBe(true);
    expect(component.reminder).toEqual({ title: 'Stretch limbs' });
    expect(component.showCreateRem).toBe(true);
  });

  it('should handle create reminder event and refresh list', () => {
    mockReminderService.getRemindersList.and.returnValue(of({ resp: 'success' }));
    const mockReminderList = [{ id: 1, content: 'Drink water', reminderDateTime: new Date(), repeat: false }, { id: 2, content: 'Drink water', reminderDateTime: new Date(), repeat: false },
    { id: 3, content: 'Drink water', reminderDateTime: new Date(), repeat: true }];
    component.reminderList = mockReminderList;
    component.handleCreateRem(true);
    expect(component.showCreateRem).toBe(false);
  });

  it('should handle back event', () => {
    component.handleBackEvent(true);
    expect(component.showCreateRem).toBe(true);
  });

  it('should set loading to false after timeout', fakeAsync(() => {
    component.timeout();
    expect(component.loading).toBeFalse();
    flush();
  }));
});
