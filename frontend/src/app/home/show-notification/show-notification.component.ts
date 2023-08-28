import { Component } from '@angular/core';
import { FireNotificationService } from '../../services/fire-notification.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-show-notification',
  templateUrl: './show-notification.component.html',
  styleUrls: ['./show-notification.component.scss']
})
export class ShowNotificationComponent {
  reminderData = {}
  notifySubscription: Subscription;
  isNotification = false;

  constructor(public fireNotificationService: FireNotificationService, private router: Router) {
  }

  // Initializes the component and subscribes to notification updates
  ngOnInit() {
    if (this.fireNotificationService.currentReminder) {
      this.reminderData = this.fireNotificationService.currentReminder;
    }
    this.notifySubscription = this.fireNotificationService.notify$.subscribe((value) => {
      this.isNotification = value;
      if (!this.isNotification) {
        this.closeModal();
      }
    });
  }

  // Closes the modal and navigates back to the previous URL
  closeModal() {
    const currentUrl = this.fireNotificationService.currentUrl;
    this.fireNotificationService.stopAudio();
    this.router.navigate([currentUrl]);
  }

  // unsubscribe to avoid memory leaks
  ngOnDestroy() {
    if (this.notifySubscription) {
      this.notifySubscription.unsubscribe();
    }
  }
}
