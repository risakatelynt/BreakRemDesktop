import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';

describe('UserService', () => {
  let service: UserService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get loggedIn status', () => {
    service.setLoggedIn(true);
    expect(service.getLoggedIn()).toBeTrue();
    service.setLoggedIn(false);
    expect(service.getLoggedIn()).toBeFalse();
  });

  it('should set and get token', () => {
    const testToken = 'token';
    service.setToken(testToken);
    expect(service.getToken()).toEqual(testToken);
  });

  it('should set and get token', () => {
    localStorage.setItem('token', 'token');
    service.setOptions();
    expect(service.token).toEqual('token');
  });

  it('should delete storage', () => {
    service.setLoggedIn(true);
    service.setToken('token');
    service.deleteStorage('loggedIn');
    service.deleteStorage('token');
    expect(service.getLoggedIn()).toBeFalse();
    expect(service.getToken()).toEqual('');
  });

  it('should perform login', () => {
    const userMockData = { username: 'johndoe', password: 'password' };
    const responseMockData = { token: 'token' };
    service.login(userMockData).subscribe(response => {
      expect(response).toEqual(responseMockData);
      expect(service.getToken()).toEqual('token');
      expect(service.getLoggedIn()).toBeTrue();
    });
    const req = httpTestingController.expectOne(environment.apiUrl + 'login/');
    expect(req.request.method).toBe('POST');
    req.flush(responseMockData);
  });

  it('should perform signup', () => {
    const userMockData = { username: 'johndoe', email: 'john@gmail.com', password: 'password' };
    const responseMockData = { token: 'token' };
    service.signup(userMockData).subscribe(response => {
      expect(response).toEqual(responseMockData);
      expect(service.getToken()).toEqual('token');
      expect(service.getLoggedIn()).toBeTrue();
    });
    const req = httpTestingController.expectOne(environment.apiUrl + 'register/');
    expect(req.request.method).toBe('POST');
    req.flush(responseMockData);
  });

  it('should perform setUserProfile', () => {
    const profileData = { name: 'John Doe' };
    const responseMockData = { resp: 'success' };
    service.setUserProfile(profileData).subscribe(response => {
      expect(response).toEqual(responseMockData);
    });
    const req = httpTestingController.expectOne(environment.apiUrl + 'userprofile/addProfile/');
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.has('Authorization')).toBeTruthy();
    req.flush(responseMockData);
  });

  it('should perform setUserImage', () => {
    localStorage.setItem('token', 'token');
    const profileData = { image: 'profile.jpg' };
    const responseMockData = { resp: 'success' };
    service.setUserImage(profileData).subscribe(response => {
      expect(response).toEqual(responseMockData);
    });
    const req = httpTestingController.expectOne(environment.apiUrl + 'userprofile/addImage/');
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.has('Authorization')).toBeTruthy();
    req.flush(responseMockData);
  });

  it('should perform getUserProfile', () => {
    localStorage.setItem('token', 'token');
    const responseMockData = { name: 'John Doe' };
    service.getUserProfile().subscribe(response => {
      expect(response).toEqual(responseMockData);
    });
    const req = httpTestingController.expectOne(environment.apiUrl + 'userprofile/');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.has('Authorization')).toBeTruthy();
    expect(service.token).toEqual('token');
    req.flush(responseMockData);
  });

  it('should perform logout', () => {
    const responseMockData = { resp: 'success' };
    service.logout().subscribe(response => {
      expect(response).toEqual(responseMockData);
    });
    const req = httpTestingController.expectOne(environment.apiUrl + 'logout/');
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.has('Authorization')).toBeTruthy();
    req.flush(responseMockData);
  });

});

