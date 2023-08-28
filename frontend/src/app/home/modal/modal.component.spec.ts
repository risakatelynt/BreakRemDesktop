import { TestBed, ComponentFixture, flush, fakeAsync } from '@angular/core/testing';
import { ModalComponent } from './modal.component';
import { FormsModule } from '@angular/forms';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalComponent],
      imports: [FormsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit closeBreakModal event', () => {
    const spy = spyOn(component.closeBreakModal, 'emit');
    component.closeModal();
    expect(spy).toHaveBeenCalledWith(true);
  });

  it('should emit modalEvent event with correct values', () => {
    const mockBreakTime = 300000;
    const mockBreakDuration = 60000;
    const spy = spyOn(component.modalEvent, 'emit');
    component.selectedHours = 0;
    component.selectedMinutes = 5;
    component.breakMinDuration = 1;
    component.breakSecDuration = 0;
    component.addRem();
    expect(spy).toHaveBeenCalledWith({
      breakTime: mockBreakTime,
      breakDuration: mockBreakDuration,
    });
  });

  it('should set loading to false after timeout', fakeAsync(() => {
    component.timeout();
    expect(component.loading).toBeFalse();
    flush();
    setTimeout(() => {
      expect(component.loading).toBeFalse();
    }, 1000);
    flush();
  }));

  it('should return true for isInvalid when field is invalid and dirty', () => {
    const field = {
      invalid: true,
      dirty: true,
      touched: false,
    };
    expect(component.isInvalid(field)).toBeTruthy();
  });

  it('should return true for isInvalid when field is invalid and touched', () => {
    const field = {
      invalid: true,
      dirty: false,
      touched: true,
    };
    expect(component.isInvalid(field)).toBeTruthy();
  });

  it('should return false for isInvalid when field is not invalid or not dirty or not touched', () => {
    const field = {
      invalid: false,
      dirty: false,
      touched: false,
    };
    expect(component.isInvalid(field)).toBeFalsy();
  });
});
