import { Component } from '@angular/core';
import { RemindersService } from '../../services/reminders.service';
import { IReminder } from 'src/app/interfaces/reminder';
import { DatePipe } from '@angular/common';
import { FireNotificationService } from 'src/app/services/fire-notification.service';

@Component({
  selector: 'app-view-reminders',
  templateUrl: './view-reminders.component.html',
  styleUrls: ['./view-reminders.component.scss'],
  providers: [DatePipe]
})
export class ViewRemindersComponent {
  msg = '';
  isError = false;
  loading = false;

  reminderList: IReminder[] = [];
  selectedId = 0;
  selectedIds: number[] = [];
  allIds: number[] = [];

  reminder = {};
  showCreateRem = false;

  constructor(private reminderService: RemindersService, private fireNotificationService: FireNotificationService, private datePipe: DatePipe) { }

  // calls reminders on load
  ngOnInit(): void {
    this.viewReminders();
  }

  // displays all the reminders
  viewReminders() {
    this.loading = true;
    this.reminderService.getRemindersList().subscribe(
      (response) => {
        if (response['resp'] == 'success') {
          this.reminderList = response['data'];
          this.timeout();
          this.setAllIds();
        } else {
          this.isError = true;
          this.msg = 'An error occured. Please try again.';
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

  // Sets allIds property with ids from the reminderList
  setAllIds() {
    if (this.reminderList && this.reminderList.length > 0) {
      this.allIds = this.reminderList.map(reminder => reminder['id']).filter(id => id !== undefined) as number[];
    }
  }

  // Formats a given dateTime to a specific format
  getFormattedDate(dateTime) {
    return this.datePipe.transform(dateTime, 'dd MMM yyyy h:mm a');
  }

  // timeout sets a timeout to hide the loading spinner after a delay
  timeout() {
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  // Handles the change event of checkboxes and updates selectedIds accordingly
  onCheckboxChange(event, id) {
    if (event.target.checked) {
      this.selectedIds.push(id);
    } else {
      const index = this.selectedIds.indexOf(id);
      if (index !== -1) {
        this.selectedIds.splice(index, 1);
      }
    }
  }

  // Selects or deselects all checkboxes based on the event
  selectAll(event) {
    if (event.target.checked) {
      this.selectedIds = this.allIds
    } else {
      this.selectedIds = [];
    }
  }

  // deletes the selected reminder from the list
  deleteRem(id) {
    this.reminderService.deleteReminder(id).subscribe(
      (response) => {
        if (response['resp'] == 'success') {
          this.msg = 'Deleted successfully!';
          this.fireNotificationService.viewReminders();
          this.ngOnInit();
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

  // deletes all the selected reminders from the list
  deleteAll() {
    this.reminderService.deleteReminders(this.selectedIds).subscribe(
      (response) => {
        if (response['resp'] == 'success') {
          this.msg = 'Deleted successfully!';
          this.fireNotificationService.viewReminders();
          this.ngOnInit();
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

  // Displays edit reminders page
  openCreateRem(data): void {
    this.loading = true;
    this.reminder = data;
    this.showCreateRem = true;
    this.timeout();
  }

  // closes the edit reminder page and initializes this component
  handleCreateRem(event) {
    if (event) {
      this.showCreateRem = false;
      this.ngOnInit();
    }
  }

  // Handles the event to navigate back from edit reminder page
  handleBackEvent(event) {
    this.showCreateRem = event;
  }

}

