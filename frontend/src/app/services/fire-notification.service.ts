import { Injectable } from '@angular/core';
import { RemindersService } from './reminders.service';
import { IReminder } from '../interfaces/reminder';
import { Router } from '@angular/router';
const { electronAPI } = window as any;
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FireNotificationService {
  reminderList: IReminder[] = [];
  audio = new Audio();
  isScreenOn = true;
  isSoundOn = true;
  isDndOn = false;
  defaultSoundName = '';
  defaultSoundUrl = '';
  currentUrl = '/home/create';
  currentReminder: IReminder;
  intervalIds;
  timeoutIds;

  private notifySubject = new BehaviorSubject<boolean>(false);
  notify$ = this.notifySubject.asObservable();


  constructor(private reminderService: RemindersService, private router: Router) { }

  // To get all reminders from backend
  viewReminders() {
    if (!this.isDndOn) {
      // Clear any previous timeouts and intervals
      this.stopNotifications();
      this.reminderService.getRemindersList().subscribe(
        (response) => {
          if (response['resp'] == 'success') {
            this.reminderList = response['data'];
            this.scheduleNotifications();
          }
        },
        err => {
          console.log(err);
        }
      );
    }
  }

  // Schedule notifications for reminders
  scheduleNotifications() {
    const currentDate = new Date();
    this.reminderList.forEach((reminder) => {
      const reminderDateTime = new Date(reminder.reminderDateTime);

      // Check if the reminder's datetime is in the future
      if (reminderDateTime >= currentDate) {
        const timeUntilReminder = reminderDateTime.getTime() - currentDate.getTime();

        // Check if the reminder's datetime is in the future, and reminderType is not 'Hourly'
        if (timeUntilReminder > 0) {
          const timeoutId = setTimeout(() => {
            this.fireNotification(reminder);
          }, timeUntilReminder);
          this.timeoutIds.push(timeoutId);
        }
      }
      else {
        // Check if the reminder's datetime is in the past, and reminderType is 'Hourly'
        if (reminder['repeat']) {
          this.setTimerNotification(reminderDateTime, reminder);
        }
      }
    });
  }

  // Set timer-based notifications for hourly reminders
  setTimerNotification(reminderDateTime, reminder) {
    const currentDate = new Date();
    const nextReminder = this.calculateNextReminder(reminderDateTime, reminder['reminderType']);
    const timeUntilNextReminder = nextReminder.getTime() - currentDate.getTime();

    const intervalType = reminder['reminderType'];
    const breakTime = reminder['breakTime'];
    const breakDuration = reminder['breakDuration'];

    // Stop any ongoing notifications
    if (this.isDndOn) {
      this.stopNotifications();
      return;
    }

    // Calculate the next reminder datetime based on the selectedDate and intervalType
    if (intervalType === 'Hourly' && breakTime && breakDuration) {
      const intervalId = setInterval(() => {
        this.fireNotification(reminder);
        setTimeout(() => {
          this.notifySubject.next(false);
        }, breakDuration);
      }, breakTime);
      this.intervalIds.push(intervalId);
    } else {
      if (timeUntilNextReminder > 0) {
        const timeoutId = setTimeout(() => {
          this.fireNotification(reminder);
        }, timeUntilNextReminder);
        this.timeoutIds.push(timeoutId);
      }
    }
  }

  // Calculate the next reminder datetime based on the selectedDate and intervalType
  calculateNextReminder(selectedDateTime, intervalType): Date {
    if (intervalType === 'Hourly') {
      return new Date(selectedDateTime.getTime() + (60 * 60 * 1000));
    } else if (intervalType === 'Daily') {
      const nextDate = new Date();
      nextDate.setDate(selectedDateTime.getDate() + 1);
      return nextDate;
    } else if (intervalType === 'Weekly') {
      const nextDate = new Date();
      nextDate.setDate(selectedDateTime.getDate() + 7);
      return nextDate;
    } else if (intervalType === 'Monthly') {
      const nextDate = new Date();
      nextDate.setMonth(selectedDateTime.getMonth() + 1);
      return nextDate;
    } else if (intervalType === 'Yearly') {
      const nextDate = new Date();
      nextDate.setFullYear(selectedDateTime.getFullYear() + 1);
      return nextDate;
    }
    return selectedDateTime;
  }

  // Fire a notification for a specific reminder
  fireNotification(reminder) {
    if (this.isScreenOn) {
      this.currentReminder = reminder;
      this.showApp(reminder['soundName'], reminder['soundUrl']);
    } else {
      this.showNotification(reminder['content'], reminder['soundName'], reminder['soundUrl']);
    }
  }

  // Show the main app window and trigger a notification
  showApp(soundName, soundUrl) {
    this.setSound(soundName, soundUrl);
    this.router.navigate(['/home/notification']);
    this.notifySubject.next(true);
    if (electronAPI) {
      electronAPI.showMainWindow();
    }
  }

  // Set the sound for the notification
  setSound(soundName, soundUrl) {
    if (soundName != 'Select Alarm' && this.isSoundOn) {
      this.playSound(soundUrl);
    } else if (this.defaultSoundName && this.defaultSoundName != '' && this.defaultSoundUrl && this.defaultSoundUrl != '' && this.defaultSoundUrl != 'Select Alarm' && this.isSoundOn) {
      this.playSound(this.defaultSoundUrl);
    }
  }

  // Create the audio element, set its source to the selected sound and play
  playSound(soundUrl) {
    this.audio = new Audio(soundUrl);
    if (this.audio) {
      // Play the sound
      this.audio.play();
    }
  }

  // sends data to pass to the electron main process to fire notifications
  showNotification(content, soundName, soundUrl) {
    const title = 'BreakRem';
    let isSound = false;
    if (soundName != 'Select Alarm' && this.isSoundOn) {
      isSound = true
    } else if (this.defaultSoundName && this.defaultSoundName != '' && this.defaultSoundUrl && this.defaultSoundUrl != '' && this.isSoundOn) {
      isSound = true
    }
    const notificationData = {
      title: title,
      message: content,
      sound: isSound
    };

    this.setSound(soundName, soundUrl);
    if (electronAPI) {
      // sends a notification request to the Electron main process
      electronAPI.fireNotification(notificationData);

      electronAPI.onNotificationClose((event) => {
        // Pause and reset the audio when the notification is closed
        this.stopAudio();
      });
    }
  }

  // Pause and reset the audio
  stopAudio() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
  }

  // To turn off all notifications
  stopNotifications() {
    // Clear all timeouts
    if (this.timeoutIds && this.timeoutIds.length > 0) {
      this.timeoutIds.forEach(timeoutId => clearTimeout(timeoutId));
    }
    this.timeoutIds = [];
    // Clear all intervals
    if (this.intervalIds && this.intervalIds.length > 0) {
      this.intervalIds.forEach(intervalId => clearInterval(intervalId));
    }
    this.intervalIds = [];
    this.notifySubject.next(false);
  }

}