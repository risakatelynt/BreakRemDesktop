from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient
from django.urls import reverse
from .models import UserProfile
from .serializers import UserProfileSerializer
from django.core.files.uploadedfile import SimpleUploadedFile


class FileUploadViewTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='janedoe', password='janepwd')
        self.token = Token.objects.create(user=self.user)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        self.user_profile = UserProfile.objects.create(
            user=self.user,
            profile_picture=SimpleUploadedFile(
                "profile.jpg", content=b"file_content", content_type="image/jpeg")
        )

    def test_file_upload_success(self):
        uploaded_file = SimpleUploadedFile(
            "profile_picture.jpg", b"file_content", content_type="image/jpeg"
        )

        data = {
            'username': 'johndoe',
            'email': 'johndoe@gmail.com',
            'profile_picture': uploaded_file
        }
        response = self.client.post(
            reverse('update-profile-image'), data=data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        response_data = response.json()
        self.assertEqual(response_data['resp'], 'success')
        self.assertEqual(response_data['message'],
                         'Image uploaded successfully.')
        self.assertIsNotNone(response_data['data'])


class SetUserProfileViewTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='janedoe', password='janepwd')
        self.token = Token.objects.create(user=self.user)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        self.user_profile = UserProfile.objects.create(
            user=self.user,
            profile_picture=SimpleUploadedFile(
                "profile.jpg", content=b"file_content", content_type="image/jpeg")
        )

    def test_update_user_profile(self):
        data = {
            'username': 'john',
            'email': 'john@gmail.com'
        }
        response = self.client.post(reverse('update-profile'), data=data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response_data = response.json()
        self.assertEqual(response_data['resp'], 'success')
        self.assertEqual(response_data['message'], 'Updated successfully.')
        updated_user = User.objects.get(pk=self.user.pk)
        self.assertEqual(updated_user.username, data['username'])
        self.assertEqual(updated_user.email, data['email'])

    def test_update_user_profile_existing_username(self):
        existing_username = 'jane'
        User.objects.create_user(
            username=existing_username, password='password')

        data = {
            'username': existing_username,
            'email': 'jane@gmail.com'
        }

        response = self.client.post(reverse('update-profile'), data=data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response_data = response.json()
        self.assertEqual(response_data['resp'], 'failed')
        self.assertEqual(
            response_data['message'], 'Username already exists. Please enter a different username.')

    def test_update_user_profile_existing_email(self):
        existing_email = 'janedoe@gmail.com'
        User.objects.create_user(
            username='jany', email=existing_email, password='password')

        data = {
            'username': 'jane',
            'email': existing_email
        }

        response = self.client.post(reverse('update-profile'), data=data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response_data = response.json()
        self.assertEqual(response_data['resp'], 'failed')
        self.assertEqual(
            response_data['message'], 'Email already exists. Please enter a different email.')


class UserProfileViewTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='jane', password='janepwd')
        self.token = Token.objects.create(user=self.user)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        self.user_profile = UserProfile.objects.create(
            user=self.user,
            profile_picture=SimpleUploadedFile(
                "profile.jpg", content=b"file_content", content_type="image/jpeg")
        )

    def test_get_user_profile(self):
        response = self.client.get(reverse('profile'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response_data = response.json()
        self.assertEqual(response_data['resp'], 'success')
        self.assertEqual(response_data['data']['username'], self.user.username)
        self.assertEqual(response_data['data']['email'], self.user.email)
        self.assertIsNotNone(response_data['data']['profile_picture'])

    def test_no_profile_picture(self):
        self.user_profile.profile_picture = None
        self.user_profile.save()
        response = self.client.get(reverse('profile'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response_data = response.json()
        self.assertEqual(response_data['resp'], 'success')
        self.assertEqual(response_data['data']['username'], self.user.username)
        self.assertEqual(response_data['data']['email'], self.user.email)
        self.assertIsNone(response_data['data']['profile_picture'])

    def test_get_user_profile_not_found(self):
        self.user_profile.delete()
        response = self.client.get(reverse('profile'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response_data = response.json()
        self.assertEqual(response_data['resp'], 'failed')
        self.assertEqual(response_data['message'], 'No profile found for the current user.')