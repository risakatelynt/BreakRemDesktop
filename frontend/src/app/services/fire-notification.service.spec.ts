import { TestBed, fakeAsync, flush } from '@angular/core/testing';
import { FireNotificationService } from './fire-notification.service';
import { Router } from '@angular/router';
import { RemindersService } from './reminders.service';
import { IReminder } from '../interfaces/reminder';
import { BehaviorSubject, of, throwError } from 'rxjs';

describe('FireNotificationService', () => {
  let service: FireNotificationService;
  let reminderService: RemindersService;
  let router: Router;
  const mockElectronAPI = {
    showMainWindow: jasmine.createSpy(),
  };

  (window as any).electronAPI = mockElectronAPI;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FireNotificationService,
        { provide: RemindersService, useValue: { getRemindersList: () => of({ resp: 'success', data: [] }) } },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
      ],
    });
    service = TestBed.inject(FireNotificationService);
    reminderService = TestBed.inject(RemindersService);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getRemindersList when viewReminders is called', () => {
    let dateTime = new Date();
    dateTime.setDate(dateTime.getDate() + 7);
    const reminderList: IReminder[] = [
      { content: 'Drink coffee', 'reminderDateTime': dateTime, repeat: true, reminderType: 'Hourly' },
      { content: 'Drink water', 'reminderDateTime': dateTime, repeat: true, reminderType: 'Weekly' },
      { content: 'Drink tea', 'reminderDateTime': dateTime, repeat: true, reminderType: 'Monthly' },
      { content: 'Stretch limbs', 'reminderDateTime': dateTime, repeat: true, reminderType: 'Yearly' }
    ]
    spyOn(reminderService, 'getRemindersList').and.returnValue(of({ resp: 'success', data: reminderList }));
    spyOn(service, 'scheduleNotifications');
    service.viewReminders();
    expect(reminderService.getRemindersList).toHaveBeenCalled();
    expect(service.scheduleNotifications).toHaveBeenCalled();
  });

  it('should call scheduleNotifications', () => {
    let dateTime = new Date();
    dateTime.setDate(dateTime.getDate() + 7);
    let reminderList: IReminder[] = [
      { content: 'Drink coffee', 'reminderDateTime': dateTime, repeat: true, reminderType: 'Hourly' },
      { content: 'Drink water', 'reminderDateTime': dateTime, repeat: true, reminderType: 'Weekly' },
      { content: 'Drink tea', 'reminderDateTime': dateTime, repeat: true, reminderType: 'Monthly' },
      { content: 'Stretch limbs', 'reminderDateTime': dateTime, repeat: true, reminderType: 'Yearly' }
    ]
    service.timeoutIds = [];
    service.reminderList = reminderList;
    service.scheduleNotifications();
    dateTime = new Date();
    dateTime.setDate(dateTime.getDate() - 10);
    reminderList = [
      { content: 'Drink coffee', 'reminderDateTime': dateTime, repeat: true, reminderType: 'Hourly', breakTime: 300, breakDuration: 100 },
      { content: 'Stretch arms', 'reminderDateTime': dateTime, repeat: true, reminderType: 'Daily' },
      { content: 'Drink water', 'reminderDateTime': dateTime, repeat: true, reminderType: 'Weekly' },
      { content: 'Drink tea', 'reminderDateTime': dateTime, repeat: true, reminderType: 'Monthly' },
      { content: 'Stretch limbs', 'reminderDateTime': dateTime, repeat: true, reminderType: 'Yearly' },
      { content: 'Stretch neck', 'reminderDateTime': dateTime, repeat: true, reminderType: '' }
    ]
    service.reminderList = reminderList;
    service.isDndOn = true;
    service.scheduleNotifications();
  });


  it('getRemindersList should log error in console', fakeAsync(() => {
    spyOn(reminderService, 'getRemindersList').and.returnValue(throwError(() => 'error'));
    spyOn(console, 'log');
    service.viewReminders();
    flush();
    expect(console.log).toHaveBeenCalledWith('error');
  }));

  it('should call fireNotification and set next timeout when setTimerNotification is called', () => {
    const reminderDateTime = new Date();
    service.timeoutIds = [];
    reminderDateTime.setMinutes(reminderDateTime.getMinutes() + 5);
    const reminder: IReminder = {
      content: 'Stretch limbs',
      reminderDateTime: reminderDateTime,
      reminderType: 'Hourly',
      repeat: true
    };
    spyOn(service, 'fireNotification');
    jasmine.clock().install();
    service.setTimerNotification(reminderDateTime, reminder);
    jasmine.clock().tick(5000);
    expect(service.notify$).toBeTruthy();
    jasmine.clock().uninstall();
  });


  it('should navigate to specified route when fireNotification is called', () => {
    spyOn(service, 'setSound');
    service.fireNotification({
      content: 'Drink tea',
      soundName: 'Bubbles',
      soundUrl: './assets/bubbles.mp3',
    });
    expect(service.setSound).toHaveBeenCalledWith('Bubbles', './assets/bubbles.mp3');
    expect(router.navigate).toHaveBeenCalledWith(['/home/notification']);
  });


  it('should call fireNotification when isScreen is off', () => {
    spyOn(service, 'showNotification');
    service.isScreenOn = false;
    service.fireNotification({
      content: 'Drink tea',
      soundName: 'Bubbles',
      soundUrl: './assets/bubbles.mp3',
    });
    expect(service.showNotification).toHaveBeenCalled();
  });

  it('should play sound if soundName is valid and sound is on when setSound is called', () => {
    service.isSoundOn = true;
    spyOn(service, 'playSound');
    service.setSound('Bubbles', './assets/bubbles.mp3');
    expect(service.playSound).toHaveBeenCalledWith('./assets/bubbles.mp3');
  });

  it('should play default sound if defaultSoundName is valid when setSound is called', () => {
    service.isSoundOn = true;
    service.defaultSoundName = 'tweet';
    service.defaultSoundUrl = './assets/tweet.mp3';
    spyOn(service, 'playSound');
    service.setSound('Select Alarm', '');
    expect(service.playSound).toHaveBeenCalledWith('./assets/tweet.mp3');
  });

  it('should show a notification and set sound when showNotification is called', () => {
    service.isSoundOn = true;
    spyOn(service, 'setSound');
    service.showNotification('Drink water', 'tweet', './assets/tweet.mp3');
    expect(service.setSound).toHaveBeenCalledWith('tweet', './assets/tweet.mp3');
  });

  it('should show a notification and set default sound when showNotification is called', () => {
    service.isSoundOn = true;
    spyOn(service, 'setSound');
    service.defaultSoundName = 'minions';
    service.defaultSoundUrl = './assets/minions.mp3';
    service.showNotification('', 'Select Alarm', '');
    expect(service.setSound).toHaveBeenCalledWith('Select Alarm', '');
  });

  it('should stop the audio when stopAudio is called', () => {
    const audioMock = jasmine.createSpyObj('audio', ['pause']);
    service.audio = audioMock;
    service.stopAudio();
    expect(audioMock.pause).toHaveBeenCalled();
  });

  it('should clear timeouts and intervals and notify subject when stopNotifications is called', () => {
    service.timeoutIds = [1, 2, 3];
    service.intervalIds = [4, 5, 6];
    service.stopNotifications();
    expect(service.timeoutIds.length).toBe(0);
    expect(service.intervalIds.length).toBe(0);
  });

});
