import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { UserService } from './user.service';
import { of, throwError } from 'rxjs';

describe('ThemeService', () => {
  let service: ThemeService;
  let httpTestingController: HttpTestingController;
  let userService: UserService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ThemeService, UserService]
    });
    service = TestBed.inject(ThemeService);
    httpTestingController = TestBed.inject(HttpTestingController);
    userService = TestBed.inject(UserService);
  });

  afterEach(() => {
    httpTestingController.verify();
    localStorage.clear();
  });

  it('should perform setThemeService', () => {
    const mockTheme = 'Sanguine';
    const responseMock = { resp: 'success' };
    spyOn(userService, 'getToken').and.returnValue('token');
    service.setThemeService(mockTheme).subscribe(response => {
      expect(response).toEqual(responseMock);
    });
    const req = httpTestingController.expectOne(environment.apiUrl + 'theme/set/');
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.has('Authorization')).toBeTruthy();
    req.flush(responseMock);
  });

  it('should perform getThemeService', () => {
    const responseMock = { resp: 'success', theme: 'Fake Plant' };
    spyOn(userService, 'getToken').and.returnValue('token');
    service.getThemeService().subscribe(response => {
      expect(response).toEqual(responseMock);
    });
    const req = httpTestingController.expectOne(environment.apiUrl + 'theme/');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.has('Authorization')).toBeTruthy();
    req.flush(responseMock);
  });

  it('should set theme on setTheme', () => {
    const mockBody = document.createElement('body');
    document.querySelector = jasmine.createSpy('HTML Element').and.returnValue(mockBody);
    service.setTheme('Fake Plant');
    expect(mockBody.className).toBe('Fake Plant');
  });

  it('should perform getTheme', () => {
    spyOn(service, 'getThemeService').and.returnValue(of({ resp: 'success', theme: 'Sanguine' }));
    spyOn(service, 'setTheme');
    service.getTheme();
    expect(service.setTheme).toHaveBeenCalledWith('Sanguine');
  });

  it('should handle getTheme failure', () => {
    spyOn(service, 'getThemeService').and.returnValue(throwError(() => 'Error getting themes'));
    spyOn(console, 'log');
    service.getTheme();
    expect(console.log).toHaveBeenCalledWith('Error getting themes');
  });

});
