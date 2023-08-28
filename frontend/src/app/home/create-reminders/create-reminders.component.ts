import { Component, EventEmitter, Output, Input, ElementRef, ViewChild } from '@angular/core';
import { RemindersService } from '../../services/reminders.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FireNotificationService } from '../../services/fire-notification.service';

@Component({
  selector: 'app-create-reminders',
  templateUrl: './create-reminders.component.html',
  styleUrls: ['./create-reminders.component.scss']
})
export class CreateRemindersComponent {
  msg = '';
  isError = false;
  loading = false;
  remindersForm!: FormGroup;
  reminderDateTime: Date = new Date();
  reminderTypeObj = ['Select Option', 'Hourly', 'Daily', 'Weekly', 'Monthly', 'Yearly'];
  selectedOption = 'Select Option';
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

  isAnimation = false;
  animationName = 'None';

  @Input('showCreateRem') showCreateRem = false;
  @Input('selectedReminder') selectedReminder = {};
  @Input('reminderType') reminderType = 'Create';
  @Output() closeReminder = new EventEmitter<boolean>();
  @Output() goBackEvent = new EventEmitter<boolean>();

  @ViewChild('audioPlayer', { static: false }) audioElement: ElementRef;
  @ViewChild('breakModal', { static: false }) breakModal!: ElementRef;

  selectedId = 0;

  showBreakModal = false;

  constructor(private formbuilder: FormBuilder, private reminderService: RemindersService, private fireNotificationService: FireNotificationService) { }

  // ngOnInit initializes the remindersForm with form controls and modal
  ngOnInit(): void {
    this.remindersForm = this.formbuilder.group({
      content: ['', Validators.required],
      selectedDate: ['', Validators.required],
      reminderTime: ['', Validators.required],
      repeat: [false],
      reminderType: ['Select Option'],
      soundName: ['Select Alarm'],
      soundUrl: [''],
      animationName: ['None'],
      animationUrl: [''],
      breakTime: [0],
      breakDuration: [0]
    });
    this.setModalform();
  }

  // calls setModalform for every change in modal's remindersForm
  ngOnChanges() {
    this.setModalform();
  }

  // updates the selected sound option, sets values in the form controls, and plays or stops the audio
  playSound(soundOption) {
    this.selectedSound = soundOption['name'];
    this.remindersForm.controls['soundName'].setValue(soundOption['name']);
    this.remindersForm.controls['soundUrl'].setValue(soundOption['url']);
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

  // onMouseLeaveNav stops the audio playback when the mouse leaves a navigation element
  onMouseLeaveNav() {
    this.stopAudio();
  }

  // opens the appropriate modal form based on the reminder type and form data
  setModalform() {
    if (this.remindersForm && this.reminderType == 'Default') {
      this.openDefaultModal(this.selectedReminder);

    } else if (this.remindersForm && this.reminderType == 'Edit') {
      this.openModal(this.selectedReminder);
    }
  }

  // opens the default modal form and populates it with provided reminder data
  openDefaultModal(currentReminder) {
    this.msg = '';
    if (currentReminder) {
      this.remindersForm.controls['content'].setValue(currentReminder['content']);
      this.selectedOption = 'Select Option';
      this.remindersForm.controls['repeat'].setValue(false);
      this.selectedSound = 'Select Alarm';
      this.remindersForm.controls['animationName'].setValue(currentReminder['animationName']);
      this.animationName = currentReminder['animationName'];
      this.remindersForm.controls['animationUrl'].setValue(currentReminder['animationUrl']);
    }
  }

  // Clears the message and populates the form fields with current reminder data for editing
  openModal(currentReminder) {
    this.msg = '';
    if (currentReminder) {
      this.selectedId = currentReminder['id'];
      const date = new Date(currentReminder['reminderDateTime']);
      const formattedDate = this.formatDate(date);
      const formattedTime = this.formatTime(date);
      this.remindersForm.controls['content'].setValue(currentReminder['content']);
      this.remindersForm.controls['selectedDate'].setValue(formattedDate);
      this.remindersForm.controls['reminderTime'].setValue(formattedTime);
      this.remindersForm.controls['repeat'].setValue(currentReminder['repeat']);
      this.remindersForm.controls['reminderType'].setValue(currentReminder['reminderType']);
      this.selectedOption = currentReminder['reminderType'];
      this.remindersForm.controls['soundName'].setValue(currentReminder['soundName']);
      this.selectedSound = currentReminder['soundName'];
      this.remindersForm.controls['soundUrl'].setValue(currentReminder['soundUrl']);
      this.remindersForm.controls['animationName'].setValue(currentReminder['animationName']);
      this.animationName = currentReminder['animationName'];
      this.remindersForm.controls['animationUrl'].setValue(currentReminder['animationUrl']);
    }
  }

  // Formats a given date object into a string with the 'YYYY-MM-DD' format
  formatDate(date: Date): string {
    return (
      date.getFullYear() + '-' +
      ('0' + (date.getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + date.getDate()).slice(-2)
    );
  }

  // Formats a given date object into a string with the 'HH:mm' format
  formatTime(date: Date): string {
    return (
      ('0' + date.getHours()).slice(-2) +
      ':' +
      ('0' + date.getMinutes()).slice(-2)
    );
  }

  // creates reminders with all the form data
  createReminders() {
    const remindersData = {
      content: this.remindersForm.controls['content'].value,
      reminderDateTime: this.reminderDateTime,
      repeat: this.remindersForm.controls['repeat'].value,
      reminderType: this.remindersForm.controls['reminderType'].value,
      soundName: this.remindersForm.controls['soundName'].value,
      soundUrl: this.remindersForm.controls['soundUrl'].value,
      animationName: this.remindersForm.controls['animationName'].value,
      animationUrl: this.remindersForm.controls['animationUrl'].value,
      breakTime: this.remindersForm.controls['breakTime'].value,
      breakDuration: this.remindersForm.controls['breakDuration'].value
    }

    this.loading = true;
    this.reminderService.createReminders(remindersData).subscribe(
      (response) => {
        if (response['resp'] == 'success') {
          this.msg = response['message'];
          this.remindersForm.reset();
          this.selectedOption = 'Select Option';
          this.remindersForm.controls['repeat'].setValue(false);
          this.selectedSound = 'Select Alarm';
          this.timeout();
          this.fireNotificationService.viewReminders();
          this.closeReminder.emit(true);
        } else if (response['resp'] == 'failed') {
          this.isError = true;
          this.msg = response['message'];
          this.timeout();
        }
      },
      err => {
        console.log(err);
        this.isError = true;
        this.msg = 'An error occured. Please try again.';
        this.timeout();
      }
    );
  }

  // update reminders with all the form data
  updateReminder() {
    const remindersData = {
      content: this.remindersForm.controls['content'].value,
      reminderDateTime: this.reminderDateTime,
      repeat: this.remindersForm.controls['repeat'].value,
      reminderType: this.remindersForm.controls['reminderType'].value,
      soundName: this.remindersForm.controls['soundName'].value,
      soundUrl: this.remindersForm.controls['soundUrl'].value,
      animationName: this.remindersForm.controls['animationName'].value,
      animationUrl: this.remindersForm.controls['animationUrl'].value,
      breakTime: this.remindersForm.controls['breakTime'].value,
      breakDuration: this.remindersForm.controls['breakDuration'].value
    }

    this.loading = true;
    this.reminderService.updateReminder(remindersData, this.selectedId).subscribe(
      (response) => {
        if (response['resp'] == 'success') {
          this.msg = response['message'];
          this.remindersForm.reset();
          this.selectedOption = 'Select an option';
          this.remindersForm.controls['repeat'].setValue(false);
          this.selectedSound = 'Select alarm';
          this.timeout();
          this.fireNotificationService.viewReminders();
          this.closeReminder.emit(true);
        } else if (response['resp'] == 'failed') {
          this.isError = true;
          this.msg = response['message'];
          this.timeout();
        }
      },
      err => {
        console.log(err);
        this.isError = true;
        this.msg = 'An error occured. Please try again.';
        this.timeout();
      }
    )
  }

  // timeout sets a timeout to hide the loading spinner after a delay
  timeout() {
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  // isInvalid checks if a form field is invalid and has been touched or dirty
  isInvalid(field): boolean {
    if (field) {
      if (field.invalid && (field.dirty || field.touched)) {
        return true;
      }
    }
    return false;
  }

  // Adds a new reminder or updates an existing one based on form data
  addReminder() {
    this.msg = "";
    if (this.remindersForm.valid) {
      this.isError = false;
      const currentDate = new Date();
      const selectedDateTime = new Date(`${this.remindersForm.controls['selectedDate'].value}T${this.remindersForm.controls['reminderTime'].value}`);
      this.reminderDateTime = selectedDateTime;
      if (this.reminderDateTime >= currentDate) {
        this.loading = true;
        if (this.reminderType == 'Create' || this.reminderType == 'Default') {
          this.createReminders();
        } else if (this.reminderType == 'Edit') {
          this.updateReminder();
        }
      }
      else {
        this.isError = true;
        this.msg = "Please select a future date and time."
      }
    } else {
      this.remindersForm.markAllAsTouched();
    }
  }

  // Displays the sub-menu by removing the 'visible-none' class
  showMenu() {
    const menu = document.querySelector('.sub-menu');
    if (menu) {
      menu.classList.remove('visible-none');
    }
  }

  // Shows Set Interval modal
  selectOption(option: string, event) {
    event.stopPropagation();
    this.selectedOption = option;
    this.remindersForm.controls['reminderType'].setValue(option);
    const menu = document.querySelector('.sub-menu');
    if (menu) {
      menu.classList.add('visible-none');
    }
    if (option == 'Hourly') {
      this.showBreakModal = true;

      if (this.breakModal) {
        this.breakModal.nativeElement.style.display = 'block';
        this.breakModal.nativeElement.style.opacity = '1';
      }
    }
  }

  // Sets the flag to show animations
  showAnimations() {
    this.isAnimation = true;
  }

  // Closes the animation and resets the message
  closeAnimation(event) {
    this.isAnimation = event;
    this.msg = '';
  }

  // Handles the animation selection and updates form fields accordingly
  handleAnimation(event) {
    this.animationName = event['name'];
    this.isAnimation = false;
    this.remindersForm.controls['animationName'].setValue(event['name']);
    this.remindersForm.controls['animationUrl'].setValue(event['url']);
  }

  // Emits an event to navigate back
  goBack() {
    this.goBackEvent.emit(false);
  }

  // Handles the modal data received from a child component
  handleModalData(event) {
    if (this.breakModal) {
      this.breakModal.nativeElement.style.display = 'none';
    }
    this.remindersForm.controls['breakTime'].setValue(event['breakTime']);
    this.remindersForm.controls['breakDuration'].setValue(event['breakDuration']);
  }

  // Closes the break modal if the event target matches the modal's native element
  closeBreakModal(event) {
    if (event.target === this.breakModal.nativeElement) {
      this.breakModal.nativeElement.style.display = 'none';
    }
  }

  // Closes the modal based on the provided event
  handleCloseModal(event) {
    if (event) {
      this.breakModal.nativeElement.style.display = 'none';
    }
  }

}
