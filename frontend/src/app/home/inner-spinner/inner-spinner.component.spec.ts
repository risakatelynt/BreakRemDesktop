import { TestBed, ComponentFixture } from '@angular/core/testing';

import { InnerSpinnerComponent } from './inner-spinner.component';

describe('InnerSpinnerComponent', () => {
  let component: InnerSpinnerComponent;
  let fixture: ComponentFixture<InnerSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InnerSpinnerComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(InnerSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
