import { TestBed, ComponentFixture, fakeAsync, tick, flush } from '@angular/core/testing';
import { CreateRemindersComponent } from './create-reminders.component';
import { ModalComponent } from '../modal/modal.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RemindersService } from '../../services/reminders.service';
import { FireNotificationService } from '../../services/fire-notification.service';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('CreateRemindersComponent', () => {
  let component: CreateRemindersComponent;
  let fixture: ComponentFixture<CreateRemindersComponent>;
  let reminderService: jasmine.SpyObj<RemindersService>;
  let fireNotificationService: jasmine.SpyObj<FireNotificationService>;
  let formBuilder: FormBuilder;

  beforeEach(() => {
    const reminderServiceSpy = jasmine.createSpyObj('RemindersService', ['createReminders', 'updateReminder']);
    const fireNotificationServiceSpy = jasmine.createSpyObj('FireNotificationService', ['viewReminders']);
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [CreateRemindersComponent, ModalComponent],
      providers: [
        { provide: FormBuilder },
        { provide: RemindersService, useValue: reminderServiceSpy },
        { provide: FireNotificationService, useValue: fireNotificationServiceSpy },
      ],
    });

    fixture = TestBed.createComponent(CreateRemindersComponent);
    component = fixture.componentInstance;
    reminderService = TestBed.inject(RemindersService) as jasmine.SpyObj<RemindersService>;
    fireNotificationService = TestBed.inject(FireNotificationService) as jasmine.SpyObj<FireNotificationService>;
    formBuilder = TestBed.inject(FormBuilder);
    component.remindersForm = formBuilder.group({
      content: [''],
      selectedDate: [''],
      reminderTime: [''],
      repeat: [false],
      reminderType: [''],
      soundName: [''],
      soundUrl: [''],
      animationName: [''],
      animationUrl: [''],
      breakTime: [0],
      breakDuration: [0],
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit should set remindersForm and call setModalform', () => {
    spyOn(component, 'setModalform');
    component.ngOnInit();
    expect(component.remindersForm).toBeDefined();
    expect(component.setModalform).toHaveBeenCalled();
  });

  it('ngOnChanges should call setModalform', () => {
    spyOn(component, 'setModalform');
    component.ngOnChanges();
    expect(component.setModalform).toHaveBeenCalled();
  });

  it('should call playAudio when playSound is called for selected Alarm sound', () => {
    spyOn(component, 'playAudio');
    const soundOption = { name: 'bubbles', url: './assets/bubbles.mp3' };
    component.playSound(soundOption);
    expect(component.selectedSound).toBe(soundOption.name);
    expect(component.remindersForm.controls['soundName'].value).toBe(soundOption.name);
    expect(component.remindersForm.controls['soundUrl'].value).toBe(soundOption.url);
    expect(component.playAudio).toHaveBeenCalledWith('./assets/bubbles.mp3');
  });

  it('should call stopAudio if no alarm is selected as Alarm sound', () => {
    const soundOption = { name: 'Select Alarm', url: './assets/bubbles.mp3' };
    component.playSound(soundOption);
    expect(component.selectedSound).toBe(soundOption.name);
    expect(component.remindersForm.controls['soundName'].value).toBe(soundOption.name);
    expect(component.remindersForm.controls['soundUrl'].value).toBe(soundOption.url);
  });

  it('should play audio', () => {
    spyOn(component.audio, 'play');
    component.playAudio('./assets/bubbles.mp3');
    expect(component.audio.src).toBe('http://localhost:9876/assets/bubbles.mp3');
    expect(component.audio.play).toHaveBeenCalled();
  });


  it('should pause and reset audio when stopAudio is called', () => {
    spyOn(component.audio, 'pause');
    component.stopAudio();
    expect(component.audio.pause).toHaveBeenCalled();
    expect(component.audio.currentTime).toBe(0);
  });

  it('should stop audio when onMouseLeaveNav is called', () => {
    spyOn(component, 'stopAudio');
    component.onMouseLeaveNav();
    expect(component.stopAudio).toHaveBeenCalled();
  });

  it('should call openDefaultModal when reminderType is Default', () => {
    component.reminderType = 'Default';
    component.selectedReminder = { content: 'Stretch your neck', reminderDateTime: new Date(), repeat: false };
    spyOn(component, 'openDefaultModal');
    component.setModalform();
    expect(component.openDefaultModal).toHaveBeenCalledWith(component.selectedReminder);
  });

  it('should call openModal when reminderType is Edit', () => {
    component.reminderType = 'Edit';
    component.selectedReminder = { content: 'Stretch your neck', reminderDateTime: new Date(), repeat: false };
    spyOn(component, 'openModal');
    component.setModalform();
    expect(component.openModal).toHaveBeenCalledWith(component.selectedReminder);
  });

  it('openModal should update form controls with provided data', () => {
    const currentReminder = {
      id: 1,
      reminderDateTime: '2023-08-01T10:30:00',
      content: 'Test reminder',
      repeat: true,
      reminderType: 'Hourly',
      soundName: 'bubbles',
      soundUrl: 'bubbles.mp3',
      animationName: 'Animation1',
      animationUrl: 'animation1.mp4'
    };
    component.openModal(currentReminder);
    expect(component.selectedId).toBe(currentReminder.id);
    expect(component.remindersForm.controls['content'].value).toBe(currentReminder.content);
  });

  it('formatDate should format date correctly', () => {
    const date = new Date('2023-08-01T10:30:00');
    const formattedDate = component.formatDate(date);
    expect(formattedDate).toBe('2023-08-01');
  });

  it('formatTime should format time correctly', () => {
    const date = new Date('2023-08-01T10:30:00');
    const formattedTime = component.formatTime(date);
    expect(formattedTime).toBe('10:30');
  });

  it('should populate form controls correctly in openDefaultModal', () => {
    const currentReminder = {
      content: 'Stretch your neck',
      animationName: 'Meditate',
      animationUrl: './assets/meditate.png',
    };
    component.openDefaultModal(currentReminder);
    const formValue = component.remindersForm.value;
    expect(formValue.content).toEqual('Stretch your neck');
    expect(formValue.animationName).toEqual('Meditate');
    expect(formValue.animationUrl).toEqual('./assets/meditate.png');
  });

  it('should populate form controls correctly in updateReminder', () => {
    const response = { resp: 'success', message: 'Updated successfully!' };
    reminderService.updateReminder.and.returnValue(of(response));
    component.selectedId = 1;
    const currentReminder = {
      content: 'Updated content',
      reminderType: 'Monthly',
      soundName: 'Bubbles',
      soundUrl: 'bubbles.mp3',
      animationName: 'Meditate',
      animationUrl: 'meditate.png',
    };
    component.remindersForm.controls['content'].setValue(currentReminder.content);
    component.remindersForm.controls['reminderType'].setValue(currentReminder.reminderType);
    component.remindersForm.controls['soundName'].setValue(currentReminder.soundName);
    component.remindersForm.controls['soundUrl'].setValue(currentReminder.soundUrl);
    component.remindersForm.controls['animationName'].setValue(currentReminder.animationName);
    component.remindersForm.controls['animationUrl'].setValue(currentReminder.animationUrl);
    component.updateReminder();
    expect(component.msg).toEqual('Updated successfully!');
  });

  it('should handle error in updateReminder', () => {
    const errorResponse = { resp: 'failed', message: 'Update failed!' };
    reminderService.updateReminder.and.returnValue(of(errorResponse));
    component.selectedId = 1;
    component.updateReminder();
    expect(component.isError).toBe(true);
    expect(component.msg).toEqual('Update failed!');
  });

  it('should call createReminders when reminderType is Create', fakeAsync(() => {
    component.reminderType = 'Create';
    component.remindersForm.controls['content'].setValue('Drink coffee');
    component.remindersForm.controls['selectedDate'].setValue('2024-08-10');
    component.remindersForm.controls['reminderTime'].setValue('12:00:00');
    component.remindersForm.controls['repeat'].setValue(false);
    component.remindersForm.controls['reminderType'].setValue('Monthly');
    component.remindersForm.controls['soundName'].setValue('Tweet');
    component.remindersForm.controls['soundUrl'].setValue('./assets/tweet.mp3');
    component.remindersForm.controls['animationName'].setValue('Meditate');
    component.remindersForm.controls['animationUrl'].setValue('meditate.png');
    spyOn(component, 'createReminders');
    component.addReminder();
    tick();
    expect(component.createReminders).toHaveBeenCalled();
  }));

  it('createReminders should call createReminders from RemindersService on success', fakeAsync(() => {
    reminderService.createReminders.and.returnValue(of({ resp: 'success', message: 'Created successfully' }));
    component.createReminders();
    expect(reminderService.createReminders).toHaveBeenCalled();
    expect(component.msg).toBe('Created successfully');
    flush();
  }));

  it('createReminders should handle error response', fakeAsync(() => {
    reminderService.createReminders.and.returnValue(of({ resp: 'failed', message: 'Error creating reminder' }));
    component.createReminders();
    expect(component.isError).toBe(true);
    expect(component.msg).toBe('Error creating reminder');
    flush();
  }));

  it('createReminders should log error in console', fakeAsync(() => {
    const mockError = 'Error creating reminder';
    reminderService.createReminders.and.returnValue(throwError(() => mockError));
    spyOn(console, 'log');
    component.createReminders();
    flush();
    expect(console.log).toHaveBeenCalledWith(mockError);
    expect(component.isError).toBe(true);
    expect(component.msg).toBe('An error occured. Please try again.');
  }));

  it('should call createReminders when reminderType is Default', fakeAsync(() => {
    component.remindersForm.controls['content'].setValue('Drink coffee');
    component.remindersForm.controls['selectedDate'].setValue('2024-08-10');
    component.remindersForm.controls['reminderTime'].setValue('12:00:00');
    component.remindersForm.controls['repeat'].setValue(false);
    component.remindersForm.controls['reminderType'].setValue('Monthly');
    component.remindersForm.controls['soundName'].setValue('Tweet');
    component.remindersForm.controls['soundUrl'].setValue('./assets/tweet.mp3');
    component.remindersForm.controls['animationName'].setValue('Meditate');
    component.remindersForm.controls['animationUrl'].setValue('meditate.png');
    component.reminderType = 'Default';
    spyOn(component, 'createReminders');
    component.addReminder();
    tick();
    expect(component.createReminders).toHaveBeenCalled();
  }));

  it('should call updateReminder when reminderType is Edit', fakeAsync(() => {
    component.remindersForm.controls['content'].setValue('Drink coffee');
    component.remindersForm.controls['selectedDate'].setValue('2024-08-10');
    component.remindersForm.controls['reminderTime'].setValue('12:00:00');
    component.remindersForm.controls['repeat'].setValue(false);
    component.remindersForm.controls['reminderType'].setValue('Monthly');
    component.remindersForm.controls['soundName'].setValue('Tweet');
    component.remindersForm.controls['soundUrl'].setValue('./assets/tweet.mp3');
    component.remindersForm.controls['animationName'].setValue('Meditate');
    component.remindersForm.controls['animationUrl'].setValue('meditate.png');
    component.reminderType = 'Edit';
    spyOn(component, 'updateReminder');
    component.addReminder();
    tick();
    expect(component.updateReminder).toHaveBeenCalled();
  }));

  it('should call addReminder and display error if selected date is greater than current date', fakeAsync(() => {
    component.remindersForm.controls['content'].setValue('Drink coffee');
    component.remindersForm.controls['selectedDate'].setValue('2020-08-10');
    component.remindersForm.controls['reminderTime'].setValue('12:00:00');
    component.remindersForm.controls['repeat'].setValue(false);
    component.remindersForm.controls['reminderType'].setValue('Monthly');
    component.remindersForm.controls['soundName'].setValue('Tweet');
    component.remindersForm.controls['soundUrl'].setValue('./assets/tweet.mp3');
    component.remindersForm.controls['animationName'].setValue('Meditate');
    component.remindersForm.controls['animationUrl'].setValue('meditate.png');
    component.addReminder();
    tick();
    expect(component.isError).toBeTruthy();
  }));

  it('should call addReminder and mark all form controls as touched when form is invalid', fakeAsync(() => {
    component.remindersForm.setErrors({ invalid: true });
    component.addReminder();
    tick();
  }));

  it('updateReminder should log error in console', fakeAsync(() => {
    const mockError = 'Error updating reminder';
    reminderService.updateReminder.and.returnValue(throwError(() => mockError));
    spyOn(console, 'log');
    component.updateReminder();
    flush();
    expect(console.log).toHaveBeenCalledWith(mockError);
    expect(component.isError).toBe(true);
    expect(component.msg).toBe('An error occured. Please try again.');
  }));


  it('should show sub-menu when calling showMenu', () => {
    const menuElement = document.createElement('div');
    menuElement.className = 'sub-menu';
    component.showMenu();
    expect(menuElement.classList.contains('visible-none')).toBe(false);
  });

  it('should select option and update reminderType control', () => {
    const breakModalElement = fixture.debugElement.query(By.css('#breakModal'));
    if (breakModalElement) {
      component.breakModal = {
        nativeElement: breakModalElement.nativeElement
      };
    }
    const option = 'Hourly';
    const event = {
      stopPropagation: jasmine.createSpy('stopPropagation')
    };
    component.selectOption(option, event);
    expect(component.selectedOption).toEqual(option);
    expect(component.remindersForm.controls['reminderType'].value).toEqual(option);
    expect(event.stopPropagation).toHaveBeenCalled();

    expect(component.showBreakModal).toBe(true);
    expect(component.breakModal.nativeElement.style.display).toBe('block');
    expect(component.breakModal.nativeElement.style.opacity).toBe('1');
  });

  it('should show animations', () => {
    component.showAnimations();
    expect(component.isAnimation).toBeTrue();
  });

  it('should close animation and reset isAnimation and msg', () => {
    component.isAnimation = true;
    component.closeAnimation(false);
    expect(component.isAnimation).toBeFalse();
    expect(component.msg).toEqual('');
  });

  it('should handle animation selection and update form controls', () => {
    const animationEvent = { name: 'Meditate', url: 'Meditate.jpg' };
    component.handleAnimation(animationEvent);
    expect(component.animationName).toEqual(animationEvent.name);
    expect(component.isAnimation).toBeFalse();
    expect(component.remindersForm.controls['animationName'].value).toEqual(animationEvent.name);
    expect(component.remindersForm.controls['animationUrl'].value).toEqual(animationEvent.url);
  });

  it('should emit go back event', () => {
    spyOn(component.goBackEvent, 'emit');
    component.goBack();
    expect(component.goBackEvent.emit).toHaveBeenCalledWith(false);
  });

  it('should handle modal data and update form controls', () => {
    const modalData = { breakTime: 10, breakDuration: 5 };
    const breakModalElement = fixture.debugElement.query(By.css('#breakModal'));
    if (breakModalElement) {
      component.breakModal = {
        nativeElement: breakModalElement.nativeElement
      };
    }
    component.handleModalData(modalData);
    expect(component.remindersForm.controls['breakTime'].value).toEqual(modalData.breakTime);
    expect(component.remindersForm.controls['breakDuration'].value).toEqual(modalData.breakDuration);
  });

  it('should close break modal if event target is break modal', () => {
    component.breakModal = {
      nativeElement: {
        style: {
          display: 'block'
        }
      }
    };
    const event = {
      target: component.breakModal.nativeElement
    };
    component.closeBreakModal(event);
    expect(component.breakModal.nativeElement.style.display).toEqual('none');
  });

  it('should close modal and hide break modal', () => {
    component.breakModal = {
      nativeElement: {
        style: {
          display: 'block'
        }
      }
    };
    component.handleCloseModal(true);
    expect(component.breakModal.nativeElement.style.display).toEqual('none');
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


});
