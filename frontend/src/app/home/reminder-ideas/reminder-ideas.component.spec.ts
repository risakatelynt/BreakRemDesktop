import { TestBed, ComponentFixture, fakeAsync, flush } from '@angular/core/testing';
import { ReminderIdeasComponent } from './reminder-ideas.component';

describe('ReminderIdeasComponent', () => {
  let component: ReminderIdeasComponent;
  let fixture: ComponentFixture<ReminderIdeasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReminderIdeasComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReminderIdeasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should preload GIFs', () => {
    const breakRem = [
      { content: "Stretch Break: Stretch Those Limbs!", animationName: 'Strech Limbs', animationUrl: './assets/images/breaks/stretch-limbs.jpg' }
    ];
    spyOn(window, 'Image').and.returnValue({ src: '' } as any);
    component.breakRem = breakRem;
    component.preloadGifs();
    expect(window.Image).toHaveBeenCalledTimes(breakRem.length);
  });

  it('should set showCreateRem to true when openCreateRem is called', () => {
    const data = { content: 'Test Break', animationName: 'Test Animation', animationUrl: './test.jpg' };
    component.openCreateRem(data);
    expect(component.showCreateRem).toBe(true);
    expect(component.reminder).toEqual(data);
  });

  it('should set showCreateRem to false and call ngOnInit when handleRemEvent is called with true', () => {
    spyOn(component, 'ngOnInit');
    component.handleRemEvent(true);
    expect(component.showCreateRem).toBe(false);
    expect(component.ngOnInit).toHaveBeenCalled();
  });

  it('should set showCreateRem to the provided value when handleBackEvent is called', () => {
    component.handleBackEvent(true);
    expect(component.showCreateRem).toBe(true);
    component.handleBackEvent(false);
    expect(component.showCreateRem).toBe(false);
  });

  it('should decrement activeIndex correctly on prevSlide', () => {
    component.activeIndex = 2;
    component.prevSlide();
    expect(component.activeIndex).toBe(1);
    component.activeIndex = 0;
    component.prevSlide();
    expect(component.activeIndex).toBe(component.breakRem.length - 1);
  });

  it('should increment activeIndex correctly on nextSlide', () => {
    component.activeIndex = 2;
    component.nextSlide();
    expect(component.activeIndex).toBe(3);
    component.activeIndex = component.breakRem.length - 1;
    component.nextSlide();
    expect(component.activeIndex).toBe(0);
  });

  it('should set loading to false after timeout', fakeAsync(() => {
    component.timeout();
    expect(component.loading).toBeFalse();
    flush();
  }));
});
