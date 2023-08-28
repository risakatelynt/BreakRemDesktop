import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { AboutComponent } from './about.component';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AboutComponent],
    });
    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize loading to true', () => {
    expect(component.loading).toBe(true);
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
