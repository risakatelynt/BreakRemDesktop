import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  loading = true;
  images = ['./assets/images/balance.jpg', './assets/images/break.jpg', './assets/images/layout.jpg',
    './assets/images/ontrack.jpg', './assets/images/feedback.jpg'];

  // ngOnInit initializes the component by preloading GIF images and setting a timeout
  ngOnInit() {
    this.preloadGifs();
    this.timeout();
  }

  // preloads GIF images by creating new Image objects for each URL
  preloadGifs() {
    this.images.forEach((gifUrl) => {
      const img = new Image();
      img.src = gifUrl;
    });
  }

  // timeout sets a timeout to hide the loading spinner after a delay
  timeout() {
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }
}
