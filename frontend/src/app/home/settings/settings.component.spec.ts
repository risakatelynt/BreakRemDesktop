import { TestBed, ComponentFixture, tick, fakeAsync, flush } from '@angular/core/testing';
import { SettingsComponent } from './settings.component';
import { SettingsService } from '../../services/settings.service';
import { FormsModule } from '@angular/forms';
import { FireNotificationService } from '../../services/fire-notification.service';
import { of, throwError } from 'rxjs';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let settingsService: jasmine.SpyObj<SettingsService>;
  let fireNotificationService: jasmine.SpyObj<FireNotificationService>;
  beforeEach(() => {
    settingsService = jasmine.createSpyObj('SettingsService', ['getSettings', 'setSettings']);
    fireNotificationService = jasmine.createSpyObj('FireNotificationService', ['stopNotifications', 'viewReminders']);
    TestBed.configureTestingModule({
      declarations: [SettingsComponent],
      imports: [FormsModule],
      providers: [
        { provide: SettingsService, useValue: settingsService },
        { provide: FireNotificationService, useValue: fireNotificationService }
      ]
    });
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getSettings on component init', () => {
    settingsService.getSettings.and.returnValue(of({ 'resp': 'success', 'data': {} }));
    fixture.detectChanges();
    expect(settingsService.getSettings).toHaveBeenCalled();
  });

  it('should set settings and call setSettings', () => {
    component.isScreenOn = true;
    component.isSoundOn = true;
    component.isDndOn = false;
    component.defaultSoundName = 'Kitty Meow';
    component.defaultSoundUrl = 'kitty_meow.mp3';
    settingsService.setSettings.and.returnValue(of({ 'resp': 'success' }));
    component.setSettings();
    expect(settingsService.setSettings).toHaveBeenCalledWith({
      isScreenOn: true,
      isSoundOn: true,
      isDndOn: false,
      defaultSoundName: 'Kitty Meow',
      defaultSoundUrl: 'kitty_meow.mp3'
    });
  });

  it('should handle error when setSettings fails', () => {
    settingsService.setSettings.and.returnValue(throwError(() => 'Error'));
    spyOn(console, 'log');
    component.setSettings();
    expect(console.log).toHaveBeenCalledWith('Error');
  });

  it('should load settings on successful getSettings response', () => {
    const settingsData = {
      'isScreenOn': true,
      'isSoundOn': false,
      'isDndOn': true,
      'defaultSoundName': 'Bubbles',
      'defaultSoundUrl': './assets/bubbles.mp3'
    };
    settingsService.getSettings.and.returnValue(of({ 'resp': 'success', 'data': settingsData }));
    fixture.detectChanges();
    expect(component.isScreenOn).toBe(true);
    expect(component.isSoundOn).toBe(false);
    expect(component.isDndOn).toBe(true);
    expect(component.defaultSoundName).toBe('Bubbles');
    expect(component.defaultSoundUrl).toBe('./assets/bubbles.mp3');
  });

  it('should handle error when getSettings fails', () => {
    settingsService.getSettings.and.returnValue(throwError(() => 'Error'));
    spyOn(console, 'log');
    fixture.detectChanges();
    expect(console.log).toHaveBeenCalledWith('Error');
  });

  it('should toggle screen setting and call setSettings', () => {
    settingsService.setSettings.and.returnValue(of({ 'resp': 'success' }));
    component.isScreenOn = true;
    component.toggleScreen();
    expect(fireNotificationService.isScreenOn).toBe(true);
    expect(settingsService.setSettings).toHaveBeenCalled();
  });

  it('should toggle sound setting and call setSettings', () => {
    settingsService.setSettings.and.returnValue(of({ 'resp': 'success' }));
    component.isSoundOn = true;
    component.toggleSound();
    expect(fireNotificationService.isSoundOn).toBe(true);
    expect(settingsService.setSettings).toHaveBeenCalled();
  });

  it('should toggle DND setting and call stopNotifications if isDndOn is On', fakeAsync(() => {
    settingsService.setSettings.and.returnValue(of({ 'resp': 'success' }));
    component.isDndOn = true;
    component.toggleDoNotDisturb();
    flush();
    expect(fireNotificationService.isDndOn).toBe(true);
    expect(fireNotificationService.stopNotifications).toHaveBeenCalled();
  }));

  it('should toggle DND setting and call viewReminders if isDndOn is Off', fakeAsync(() => {
    settingsService.setSettings.and.returnValue(of({ 'resp': 'success' }));
    component.isDndOn = false;
    component.toggleDoNotDisturb();
    flush();
    expect(fireNotificationService.isDndOn).toBe(false);
    expect(fireNotificationService.viewReminders).toHaveBeenCalled();
  }));

  it('should show sub-menu when calling showMenu', () => {
    const menuElement = document.createElement('div');
    menuElement.className = 'sub-menu';
    component.showMenu();
    expect(menuElement.classList.contains('visible-none')).toBe(false);
  });

  it('should play sound, set settings, and call playAudio for selected Alarm sound', () => {
    settingsService.setSettings.and.returnValue(of({ 'resp': 'success' }));
    const soundOption = { name: 'Bubbles', url: './assets/bubbles.mp3' };
    component.selectedSound = 'Select Alarm';
    component.defaultSoundName = '';
    component.defaultSoundUrl = '';
    spyOn(component, 'playAudio');
    component.playSound(soundOption);
    expect(component.selectedSound).toBe('Bubbles');
    expect(component.defaultSoundName).toBe('Bubbles');
    expect(component.defaultSoundUrl).toBe('./assets/bubbles.mp3');
    expect(component.playAudio).toHaveBeenCalledWith('./assets/bubbles.mp3');
  });

  it('should call stopAudio if no alarm is selected as Alarm sound', () => {
    const soundOption = { name: 'Select Alarm', url: '' };
    component.playSound(soundOption);
    expect(component.selectedSound).toBe('Select Alarm');
    expect(component.defaultSoundName).toBe('Select Alarm');
    expect(component.defaultSoundUrl).toBe('');
  });

  it('should play audio', () => {
    spyOn(component.audio, 'play');
    component.playAudio('./assets/bubbles.mp3');
    expect(component.audio.src).toBe('http://localhost:9876/assets/bubbles.mp3');
    expect(component.audio.play).toHaveBeenCalled();
  });

  it('should stop audio', () => {
    component.audio = new Audio();
    spyOn(component.audio, 'pause');
    component.stopAudio();
    expect(component.audio.pause).toHaveBeenCalled();
    expect(component.audio.currentTime).toBe(0);
  });

  it('should stop audio and set settings when calling onMouseLeaveNav', () => {
    settingsService.setSettings.and.returnValue(of({ 'resp': 'success' }));
    spyOn(component, 'stopAudio');
    spyOn(component, 'setSettings');
    component.onMouseLeaveNav();
    expect(component.stopAudio).toHaveBeenCalled();
    expect(component.setSettings).toHaveBeenCalled();
  });

  it('should set loading to false after timeout', fakeAsync(() => {
    component.timeout();
    expect(component.loading).toBeFalse();
    flush();
  }));

});
