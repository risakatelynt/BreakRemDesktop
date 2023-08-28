import { TestBed, ComponentFixture, fakeAsync, flush } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { InnerSpinnerComponent } from '../inner-spinner/inner-spinner.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { of, throwError } from 'rxjs';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let formbuilder: FormBuilder;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    const userServiceMock = jasmine.createSpyObj('UserService', ['getUserProfile', 'setUserProfile', 'setUserImage']);

    TestBed.configureTestingModule({
      declarations: [ProfileComponent, InnerSpinnerComponent],
      imports: [ReactiveFormsModule],
      providers: [FormBuilder, { provide: UserService, useValue: userServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    formbuilder = TestBed.inject(FormBuilder);
    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    component.profileForm = formbuilder.group({
      profile: ['profile_pic.jpg'],
      username: [{ value: '', disabled: true }, Validators.required],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]]
    });
    component.previousForm = formbuilder.group({
      profile: ['profile.png'],
      username: [{ value: '', disabled: true }, Validators.required],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]]
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should populate form with user profile data on initialization', () => {
    const mockProfileData = {
      username: 'janedoe',
      email: 'janedoe@example.com',
      profile_picture: 'profile.jpg',
    };
    userServiceSpy.getUserProfile.and.returnValue(of({ resp: 'success', data: mockProfileData }));
    fixture.detectChanges();
    expect(component.profileForm.controls['username'].value).toBe(mockProfileData.username);
    expect(component.profileForm.controls['email'].value).toBe(mockProfileData.email);
    expect(component.imageUrl).toBe(component.apiUrl + mockProfileData.profile_picture);
  });

  it('should set error message and image URL to empty if loading profile data fails', () => {
    userServiceSpy.getUserProfile.and.returnValue(of({ resp: 'failed', message: 'Error message' }));
    fixture.detectChanges();
    expect(component.isError).toBe(true);
    expect(component.msg).toBe('Error message');
    expect(component.imageUrl).toBe('');
  });

  it('should set error message and image URL to empty if loading profile data encounters an error', () => {
    userServiceSpy.getUserProfile.and.returnValue(of(new Error('error')));
    fixture.detectChanges();
    expect(component.isError).toBe(true);
    expect(component.msg).toBe('An error occured while loading image. Please try again later.');
    expect(component.imageUrl).toBe('');
  });

  it('should reset form values to original values and disable form on cancel', () => {
    const originalFormValue = formbuilder.group({
      profile: [{ value: 'profile_pic.jpg' }],
      username: [{ value: '', disabled: true }, Validators.required],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]]
    });
    component.profileForm = formbuilder.group(originalFormValue);
    component.isDisabled = false;
    component.onCancel();
    expect(component.profileForm.disabled).toBe(true);
    expect(component.isDisabled).toBe(true);
  });

  it('should upload image and update imageUrl on successful upload', () => {
    const mockResponse = { resp: 'success', data: 'profile-image.jpg' };
    userServiceSpy.setUserImage.and.returnValue(of(mockResponse));
    component.profileForm.controls['profile'].setValue(new File([], 'profile-image.jpg'));
    component.profileForm.controls['username'].setValue('janedoe');
    component.profileForm.controls['email'].setValue('janedoe@example.com');
    component.onUpload();
    expect(component.loading).toBe(true);
    expect(userServiceSpy.setUserImage).toHaveBeenCalledOnceWith(jasmine.any(FormData));
    expect(component.imageUrl).toBe(`${component.apiUrl}${mockResponse.data}`);
  });

  it('should set error message and image URL to empty on failed image upload', () => {
    const mockResponse = { resp: 'failed', message: 'Upload failed' };
    userServiceSpy.setUserImage.and.returnValue(of(mockResponse));
    component.profileForm.controls['profile'].setValue(new File([], 'profile-image.jpg'));
    component.profileForm.controls['username'].setValue('janedoe');
    component.profileForm.controls['email'].setValue('janedoe@example.com');
    component.onUpload();
    expect(component.loading).toBe(true);
    expect(userServiceSpy.setUserImage).toHaveBeenCalledOnceWith(jasmine.any(FormData));
    expect(component.isError).toBe(true);
    expect(component.msg).toBe(mockResponse.message);
    expect(component.imageUrl).toBe('');
  });

  it('should submit user profile and set error message on failed submission', () => {
    const mockResponse = { resp: 'failed', message: 'Submission failed' };
    userServiceSpy.setUserProfile.and.returnValue(of(mockResponse));
    component.profileForm.controls['username'].setValue('janedoe');
    component.profileForm.controls['email'].setValue('janedoe@example.com');
    component.onSubmit();
    expect(component.loading).toBe(true);
    expect(userServiceSpy.setUserProfile).toHaveBeenCalledOnceWith({ username: 'janedoe', email: 'janedoe@example.com' });
    expect(component.profileForm.disabled).toBe(true);
    expect(component.isDisabled).toBe(true);
    expect(component.msg).toBe(mockResponse.message);
  });

  it('should return appropriate error message for required and invalid email', () => {
    const requiredControl = { hasError: (error) => error === 'required' };
    const emailControl = { hasError: (error) => error === 'email' };
    const noErrorControl = { hasError: (error) => error === 'none' };
    const requiredMessage = component.getEmailErrorMessage(requiredControl);
    const emailMessage = component.getEmailErrorMessage(emailControl);
    const noErrorMsg = component.getEmailErrorMessage(noErrorControl);
    expect(requiredMessage).toBe('Please enter email');
    expect(emailMessage).toBe('Please enter a valid email');
    expect(noErrorMsg).toBe('');
  });

  it('should return true if field is invalid and has been touched or dirty', () => {
    const invalidField = { invalid: true, dirty: true, touched: true };
    const invalidTouchedField = { invalid: true, dirty: false, touched: true };
    const validField = { invalid: false, dirty: false, touched: false };
    const isInvalid = component.isInvalid(invalidField);
    const isTouchedInvalid = component.isInvalid(invalidTouchedField);
    const isValid = component.isInvalid(validField);
    expect(isInvalid).toBe(true);
    expect(isTouchedInvalid).toBe(true);
    expect(isValid).toBe(false);
  });

  it('should enable form for editing and store original form values on edit', () => {
    component.profileForm.disable();
    component.isDisabled = true;
    component.edit();
    expect(component.profileForm.enabled).toBe(true);
    expect(component.isDisabled).toBe(false);
    expect(component.previousForm).toEqual(component.profileForm.value);
  });

  it('should update profileForm and call onUpload if image file is selected', () => {
    const mockFile = new File([''], 'profile.jpg', { type: 'image/jpeg' });
    const event = { target: { files: [mockFile] } };
    spyOn(component, 'onUpload');
    component.onChange(event);
    expect(component.msg).toBe('');
    expect(component.profileForm.controls['profile'].value).toBe(mockFile);
    expect(component.onUpload).toHaveBeenCalled();
  });

  it('should set error message if non-image file is selected', () => {
    const mockFile = new File([''], 'profile.txt', { type: 'text/plain' });
    const event = { target: { files: [mockFile] } };
    component.onChange(event);
    expect(component.msg).toBe('Only image files are allowed.');
  });

  it('onUpload should log error in console', fakeAsync(() => {
    const mockError = 'Error uploading';
    userServiceSpy.setUserImage.and.returnValue(throwError(() => mockError));
    spyOn(console, 'log');
    component.onUpload();
    flush();
    expect(console.log).toHaveBeenCalledWith(mockError);
    expect(component.isError).toBe(true);
    expect(component.msg).toBe('An error occured. Please try again.');
  }));

  it('onSubmit should log error in console', fakeAsync(() => {
    const mockError = 'Error submitting';
    userServiceSpy.setUserProfile.and.returnValue(throwError(() => mockError));
    spyOn(console, 'log');
    component.onSubmit();
    flush();
    expect(console.log).toHaveBeenCalledWith(mockError);
    expect(component.isError).toBe(true);
    expect(component.msg).toBe('An error occured. Please try again.');
  }));

  it('getProfile should log error in console', fakeAsync(() => {
    const mockError = 'Error getting profile';
    userServiceSpy.getUserProfile.and.returnValue(throwError(() => mockError));
    spyOn(console, 'log');
    component.getProfile();
    flush();
    expect(console.log).toHaveBeenCalledWith(mockError);
    expect(component.isError).toBe(true);
    expect(component.msg).toBe('An error occured. Please try again.');
  }));

  it('should return empty imageUrl with user profile data on initialization', () => {
    const mockProfileData = {
      username: 'janedoe',
      email: 'janedoe@example.com',
    };
    userServiceSpy.getUserProfile.and.returnValue(of({ resp: 'success', data: mockProfileData }));
    fixture.detectChanges();
    expect(component.profileForm.controls['username'].value).toBe(mockProfileData.username);
    expect(component.profileForm.controls['email'].value).toBe(mockProfileData.email);
    expect(component.imageUrl).toBe('');
  });
});
