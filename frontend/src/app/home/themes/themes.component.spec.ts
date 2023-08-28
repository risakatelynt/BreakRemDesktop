import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ThemesComponent } from './themes.component';
import { ThemeService } from '../../services/theme.service';
import { of, throwError } from 'rxjs';

describe('ThemesComponent', () => {
  let component: ThemesComponent;
  let fixture: ComponentFixture<ThemesComponent>;
  let themeServiceSpy: jasmine.SpyObj<ThemeService>;
  beforeEach(() => {
    const themeServiceMock = jasmine.createSpyObj('ThemeService', ['setThemeService', 'setTheme']);
    TestBed.configureTestingModule({
      declarations: [ThemesComponent],
      providers: [{ provide: ThemeService, useValue: themeServiceMock }],
    });
    fixture = TestBed.createComponent(ThemesComponent);
    component = fixture.componentInstance;
    themeServiceSpy = TestBed.inject(ThemeService) as jasmine.SpyObj<ThemeService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set theme successfully', () => {
    const themeValue = 'fake-plant';
    themeServiceSpy.setThemeService.and.returnValue(of({ resp: 'success' }));
    component.setTheme(themeValue);
    expect(themeServiceSpy.setThemeService).toHaveBeenCalledWith(themeValue);
    expect(themeServiceSpy.setTheme).toHaveBeenCalledWith(themeValue);
  });

  it('should handle theme setting failure', () => {
    const themeValue = 'fake-plant';
    themeServiceSpy.setThemeService.and.returnValue(throwError(() => 'Error'));
    component.setTheme(themeValue);
    expect(themeServiceSpy.setThemeService).toHaveBeenCalledWith(themeValue);
    expect(themeServiceSpy.setTheme).not.toHaveBeenCalled();
  });
  
});
