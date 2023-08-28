import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FireNotificationService } from 'src/app/services/fire-notification.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navigation-panel',
  templateUrl: './navigation-panel.component.html',
  styleUrls: ['./navigation-panel.component.scss']
})
export class NavigationPanelComponent {
  msg = '';
  isError = false;
  loading = false;

  constructor(private userService: UserService, private fireNotificationService: FireNotificationService, private router: Router) { }

  // Handles navigation and updates the active link
  goTo(event, currentUrl) {
    let linkColor = document.querySelectorAll('.nav-link')
    if (linkColor) {
      linkColor.forEach(l => l.classList.remove('active'))
      event.currentTarget.classList.add('active')
    }
    this.fireNotificationService.currentUrl = currentUrl;
  }

  // Logs the user out and handles response
  logout() {
    this.loading = true;
    this.userService.logout().subscribe(
      (response) => {
        if (response['resp'] == 'success') {
          this.userService.deleteStorage('loggedIn');
          this.userService.deleteStorage('token');
          this.router.navigate(['/login']);
        }
        this.timeout();
      },
      err => {
        console.log('Logout failed:', err);
        this.isError = true;
        this.msg = 'Logout failed. Please try again.';
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

}
