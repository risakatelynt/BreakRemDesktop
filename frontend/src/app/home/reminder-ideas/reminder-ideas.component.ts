import { Component } from '@angular/core';

@Component({
  selector: 'app-reminder-ideas',
  templateUrl: './reminder-ideas.component.html',
  styleUrls: ['./reminder-ideas.component.scss']
})
export class ReminderIdeasComponent {
  loading = false;
  activeIndex: number = 0;
  reminder = {};
  showCreateRem = false;
  breakRem = [
    { content: "Stretch Break: Stretch Those Limbs! Energize your body with simple stretching exercises.", animationName: 'Strech Limbs', animationUrl: './assets/images/breaks/stretch-limbs.jpg' },
    { content: "Deep Breath Break: Close your eyes and take a few deep breaths. Find calmness and relaxation.", animationName: 'Meditate', animationUrl: './assets/images/breaks/meditate.jpg' },
    { content: "Power Up Break: Refreshing Coffee Time! Recharge with a delightful cup of coffee.", animationName: 'Coffee', animationUrl: './assets/images/breaks/coffee.jpg' },
    { content: "Power Up Break: Refreshing Tea Time! Revitalize with a soothing cup of tea.", animationName: 'Tea', animationUrl: './assets/images/breaks/tea.jpg' },
    { content: "Lunge Break: Stand up and do a lunge. Hold for 10 seconds, then switch legs. Strengthen your lower body.", animationName: 'Lunges', animationUrl: './assets/images/breaks/lunges-woman.jpg' },
    { content: "Stretch Break: Rise Up and Shake Off! Loosen up and shake away the stiffness.", animationName: 'Touch Feet', animationUrl: './assets/images/breaks/touch-both-feet.jpg' },
    { content: "Chair Twist Break: Energize and Twist! Release tension with a gentle chair twist.", animationName: 'Turn Waist', animationUrl: './assets/images/breaks/turn-waist.jpg' },
    { content: "Arm Stretch Break: Reach and Hold! Stretch your arms and shoulders for improved flexibility.", animationName: 'Arm Over Head', animationUrl: './assets/images/breaks/arm-over-head.jpg' },
    { content: "Leg Lift Break: Feel the Stretch! Lift one leg at a time to engage your core and legs.", animationName: 'Leg Lift', animationUrl: './assets/images/breaks/bend-leg.jpg' },
    { content: "Chair Stretch Break: Revitalize and Stretch! Stretch your legs while seated for a quick rejuvenation.", animationName: 'Chair Stretch', animationUrl: './assets/images/breaks/leg-chair.jpg' },
    { content: "Hydration Break: Drink Some Water! Stay hydrated with a refreshing sip of water.", animationName: 'Water', animationUrl: './assets/images/breaks/water.jpg' },
    { content: "Neck Stretch Break: Relax and Unwind! Ease tension with a gentle neck stretch.", animationName: 'Neck Stretch', animationUrl: './assets/images/breaks/neck-stretch.jpg' },
    { content: "Squat Break: Time for Squats! Strengthen your lower body with squat exercises.", animationName: 'Squat', animationUrl: './assets/images/breaks/squat.jpg' },
    { content: "Arm Stretch Break: Stretch Those Arms! Increase blood flow and flexibility with arm stretches.", animationName: 'Stretch Arms', animationUrl: './assets/images/breaks/stretch-arms.jpg' },
    { content: "Forward Bend Break: Reach and Touch! Stretch your hamstrings with a forward bend.", animationName: 'Forward Bend', animationUrl: './assets/images/breaks/touch-one-feet.jpg' },
  ];

  constructor() {
  }

  // ngOnInit initializes the component by preloading GIF images and setting a timeout
  ngOnInit() {
    this.preloadGifs();
    this.timeout();
  }

  // preloads GIF images by creating new Image objects for each URL
  preloadGifs() {
    this.breakRem.forEach((gif) => {
      const img = new Image();
      img.src = gif['animationUrl'];
    });
  }

  // Displays create reminders page
  openCreateRem(data): void {
    this.loading = true;
    this.reminder = data;
    this.showCreateRem = true;
    this.timeout();
  }

  // timeout sets a timeout to hide the loading spinner after a delay
  timeout() {
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  // closes the create reminder page
  handleRemEvent(event) {
    if (event) {
      this.showCreateRem = false;
      this.ngOnInit();
    }
  }

  // Handles the event to navigate back from create reminder
  handleBackEvent(event) {
    this.showCreateRem = event;
  }

  // Moves to the previous slide in the carousel
  prevSlide() {
    this.activeIndex = (this.activeIndex - 1 + this.breakRem.length) % this.breakRem.length;
  }

  // Moves to the next slide in the carousel
  nextSlide() {
    this.activeIndex = (this.activeIndex + 1) % this.breakRem.length;
  }

}