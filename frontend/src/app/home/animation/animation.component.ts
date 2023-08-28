import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-animation',
  templateUrl: './animation.component.html',
  styleUrls: ['./animation.component.scss']
})
export class AnimationComponent {
  loading = true;
  animations = [
    {
      name: 'Minion Birthday',
      url: './assets/animations/minion-birthday.gif',
    },
    {
      name: 'Minion Dancing',
      url: './assets/animations/minion-dancing.gif',
    },
    {
      name: 'Happy Birthday',
      url: './assets/animations/happy-birthday.gif',
    },
    {
      name: 'Stretch Limbs',
      url: './assets/animations/stretch-limbs.gif',
    },
    {
      name: 'Stretch Neck',
      url: './assets/animations/stretch-neck.gif',
    },
    { name: 'Stretch Limbs', url: './assets/images/breaks/stretch-limbs.jpg' },
    { name: 'Meditate', url: './assets/images/breaks/meditate.jpg' },
    { name: 'Coffee', url: './assets/images/breaks/coffee.jpg' },
    { name: 'Tea', url: './assets/images/breaks/tea.jpg' },
    { name: 'Lunges', url: './assets/images/breaks/lunges-woman.jpg' },
    { name: 'Touch Feet', url: './assets/images/breaks/touch-both-feet.jpg' },
    { name: 'Turn Waist', url: './assets/images/breaks/turn-waist.jpg' },
    { name: 'Arm Over Head', url: './assets/images/breaks/arm-over-head.jpg' },
    { name: 'Leg Lift', url: './assets/images/breaks/bend-leg.jpg' },
    { name: 'Chair Stretch', url: './assets/images/breaks/leg-chair.jpg' },
    { name: 'Water', url: './assets/images/breaks/water.jpg' },
    { name: 'Neck Stretch', url: './assets/images/breaks/neck-stretch.jpg' },
    { name: 'Squat', url: './assets/images/breaks/squat.jpg' },
    { name: 'Stretch Arms', url: './assets/images/breaks/stretch-arms.jpg' },
    { name: 'Forward Bend', url: './assets/images/breaks/touch-one-feet.jpg' },
  ];

  @Output() closeEvent = new EventEmitter<boolean>();
  @Output() animationEvent = new EventEmitter<any>();

  // ngOnInit initializes the component by preloading GIF images and setting a timeout
  ngOnInit() {
    this.preloadGifs();
    this.timeout();
  }

  // preloads GIF images by creating new Image objects for each URL
  preloadGifs() {
    this.animations.forEach((gif) => {
      const img = new Image();
      img.src = gif['url'];
    });
  }
  // sends animation details to parent component
  addAnimation(animation) {
    this.animationEvent.emit(animation);
  }

  // closes the animation modal
  goBack() {
    this.closeEvent.emit(false);
  }

  // timeout sets a timeout to hide the loading spinner after a delay
  timeout() {
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

}
