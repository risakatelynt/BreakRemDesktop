import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { AnimationComponent } from './animation.component';

describe('AnimationComponent', () => {
  let component: AnimationComponent;
  let fixture: ComponentFixture<AnimationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnimationComponent],
    });
    fixture = TestBed.createComponent(AnimationComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize loading to true', () => {
    expect(component.loading).toBe(true);
  });

  it('should emit close event when goBack is called', () => {
    const closeEventSpy = spyOn(component.closeEvent, 'emit');
    component.goBack();
    expect(closeEventSpy).toHaveBeenCalledWith(false);
  });

  it('should emit animation event when addAnimation is called', () => {
    const animation = { name: 'test', url: './assets/test.gif' };
    const animationEventSpy = spyOn(component.animationEvent, 'emit');
    component.addAnimation(animation);
    expect(animationEventSpy).toHaveBeenCalledWith(animation);
  });

  it('should preload gifs', () => {
    const preloadGifsSpy = spyOn(component, 'preloadGifs').and.callThrough();
    component.ngOnInit();
    expect(preloadGifsSpy).toHaveBeenCalled();
  });

  it('should set loading to false after a delay', fakeAsync(() => {
    component.timeout();
    tick(1000);
    expect(component.loading).toBe(false);
  }));
});
