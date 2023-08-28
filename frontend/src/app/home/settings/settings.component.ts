import { Component } from '@angular/core';
import { FireNotificationService } from 'src/app/services/fire-notification.service';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  loading = false;
  isScreenOn: boolean = true;
  isSoundOn: boolean = true;
  isDndOn: boolean = false;

  soundOptions = [
    { name: 'Select Alarm', url: 'Select Alarm' },
    { name: 'Bubbles', url: './assets/sounds/cartoon-bubbles.mp3' },
    { name: 'Harry Potter Minions', url: './assets/sounds/harry-potter-minions.mp3' },
    { name: 'Kitty Meow', url: './assets/sounds/kitty-meow.mp3' },
    { name: 'Funny Alarm', url: './assets/sounds/funny-alarm.mp3' },
    { name: 'Sweet Melody', url: './assets/sounds/melody-1.mp3' },
    { name: 'Morning Melody', url: './assets/sounds/melody-2.mp3' },
    { name: 'Alison Melody', url: './assets/sounds/melody-3.mp3' },
    { name: 'Iphone Alarm', url: './assets/sounds/iphone-alarm.mp3' },
    { name: 'Retro', url: './assets/sounds/retro.mp3' },
    { name: 'Tweet', url: './assets/sounds/tweet.mp3' }
  ];
  selectedSound = 'Select Alarm';
  audio = new Audio();
  defaultSoundName = '';
  defaultSoundUrl = '';

  constructor(private fireNotificationService: FireNotificationService, private settingsService: SettingsService) {

  }

  // call settings on load
  ngOnInit() {
    this.getSettings();
  }

  // get settings from service
  getSettings() {
    this.loading = true;
    this.settingsService.getSettings().subscribe(
      (response) => {
        if (response['resp'] == 'success') {
          const data = response['data'];
          this.isScreenOn = data['isScreenOn'];
          this.isSoundOn = data['isSoundOn'];
          this.isDndOn = data['isDndOn'];
          this.defaultSoundName = data['defaultSoundName'];
          this.selectedSound = data['defaultSoundName'];
          if (!this.selectedSound || this.selectedSound != '') {
            this.selectedSound = 'Select Alarm';
          }
          this.defaultSoundUrl = data['defaultSoundUrl'];
          this.fireNotificationService.isScreenOn = data['isScreenOn'];
          this.fireNotificationService.isSoundOn = data['isSoundOn'];
          this.fireNotificationService.isDndOn = data['isDndOn'];
          this.fireNotificationService.defaultSoundName = data['defaultSoundName'];
          this.fireNotificationService.defaultSoundUrl = data['defaultSoundUrl'];
        }
        this.timeout();
      },
      err => {
        console.log(err);
        this.timeout();
      }
    );
  }

  // send changed settings to service
  setSettings() {
    const settings = {
      isScreenOn: this.isScreenOn,
      isSoundOn: this.isSoundOn,
      isDndOn: this.isDndOn,
      defaultSoundName: this.defaultSoundName,
      defaultSoundUrl: this.defaultSoundUrl
    };
    this.settingsService.setSettings(settings).subscribe(
      (response) => {
        this.timeout();
      },
      err => {
        console.log(err);
        this.timeout();
      }
    );
  }

  // timeout sets a timeout to hide the loading spinner after a delay
  timeout() {
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  // To toggle screen on or off
  toggleScreen() {
    this.fireNotificationService.isScreenOn = this.isScreenOn;
    this.setSettings();
  }

  // To toggle sound on or off
  toggleSound() {
    this.fireNotificationService.isSoundOn = this.isSoundOn;
    this.setSettings();
  }

  // To toggle do not disturb on or off
  toggleDoNotDisturb() {
    this.fireNotificationService.isDndOn = this.isDndOn;
    this.setSettings();

    // Stop notifications when isDndOn is true
    if (this.isDndOn) {
      this.fireNotificationService.stopNotifications();
    } else {
      this.fireNotificationService.viewReminders();
    }
  }

  // Displays the sub-menu by removing the 'visible-none' class
  showMenu() {
    const menu = document.querySelector('.sub-menu');
    if (menu) {
      menu.classList.remove('visible-none');
    }
  }

  // updates the selected sound option, sets values in the form controls, and plays or stops the audio
  playSound(soundOption) {
    this.selectedSound = soundOption['name'];
    this.defaultSoundName = soundOption['name'];
    this.defaultSoundUrl = soundOption['url'];
    if (soundOption['name'] != 'Select Alarm') {
      this.playAudio(soundOption['url']);
    } else {
      this.stopAudio();
    }
  }

  // To play audio of selected sound
  playAudio(soundUrl) {
    if (this.audio) {
      this.audio.src = soundUrl;
      this.audio.load();
      this.audio.play();
    }
  }

  // stopAudio pauses and resets the currently playing audio
  stopAudio() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
  }

  // onMouseLeaveNav stops the audio playback and call setSettings when the mouse leaves a navigation element
  onMouseLeaveNav() {
    this.stopAudio();
    this.setSettings();
  }

}
