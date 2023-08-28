import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  msg = '';
  isError = false;
  loading = false;
  selectedHours: number = 0;
  selectedMinutes: number = 0;
  breakMinDuration: number = 0;
  breakSecDuration: number = 0;
  totalTimeInMs = 0;
  durationInMs = 0;

  @Output() closeBreakModal = new EventEmitter<boolean>();
  @Output() modalEvent = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  // Calculates and emits the total break time and break duration
  addRem() {
    this.totalTimeInMs = (this.selectedHours * 60 + this.selectedMinutes) * 60 * 1000;
    this.durationInMs = (this.breakMinDuration * 60 + this.breakSecDuration) * 1000;
    this.modalEvent.emit({ breakTime: this.totalTimeInMs, breakDuration: this.durationInMs });
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

  // Emits a signal to close the modal
  closeModal(): void {
    this.closeBreakModal.emit(true);
  }

}

