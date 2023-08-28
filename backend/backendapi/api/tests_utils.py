from django.test import TestCase, Client
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from .models import Reminder, Theme, Setting
from unittest.mock import patch


class UserAuthenticationTestCase(TestCase):
    def setUp(self):
        self.register_url = reverse('register')
        self.login_url = reverse('login')
        self.logout_url = reverse('logout')

    def test_register_new_user(self):
        data = {
            'username': 'janedoe',
            'email': 'janedoe@gmail.com',
            'password': 'jane',
        }
        response = self.client.post(self.register_url, data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['resp'], 'success')
        self.assertTrue(Token.objects.filter(
            user__username=data['username']).exists())

    def test_register_existing_username(self):
        User.objects.create_user(
            username='johndoe', email='johndoe@gmail.com', password='doe')
        data = {
            'username': 'johndoe',
            'email': 'johndoe@gmail.com',
            'password': 'doe',
        }
        response = self.client.post(self.register_url, data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['resp'], 'failed')
        self.assertIn('Username already exists', response.json()['message'])

    def test_register_existing_email(self):
        User.objects.create_user(
            username='joedoe', email='johndoe@gmail.com', password='doe')
        data = {
            'username': 'johndoe',
            'email': 'johndoe@gmail.com',
            'password': 'doe',
        }
        response = self.client.post(self.register_url, data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['resp'], 'failed')
        self.assertIn('Email ID already exists', response.json()['message'])

    @patch('django.contrib.auth.models.User.objects.create_user')
    def test_register_exception(self, mock_create_user):
        mock_create_user.side_effect = Exception('Error')

        data = {
            'username': 'jenadoe',
            'email': 'jena@gmail.com',
            'password': 'jena123',
        }
        response = self.client.post(self.register_url, data)

        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.json()['resp'], 'error')
        self.assertIn('Error', response.json()['error'])

    def test_user_login_success(self):
        User.objects.create_user(
            username='janedoe', password='jane')
        data = {
            'username': 'janedoe',
            'password': 'jane',
        }
        response = self.client.post(self.login_url, data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['resp'], 'success')
        self.assertTrue('token' in response.json())

    def test_user_login_invalid_username(self):
        data = {
            'username': 'wronguser',
            'password': 'jane',
        }
        response = self.client.post(self.login_url, data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['resp'], 'failed')
        self.assertEqual(response.json()['message'], 'Invalid username.')

    def test_user_login_invalid_password(self):
        User.objects.create_user(
            username='janedoe', password='jane')
        data = {
            'username': 'janedoe',
            'password': 'wrongpassword',
        }
        response = self.client.post(self.login_url, data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['resp'], 'failed')
        self.assertEqual(response.json()['message'], 'Invalid password.')


class ReminderViewsTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='john', password='doe')
        self.token = Token.objects.create(user=self.user)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')

    def test_create_reminder(self):
        data = {
            'content': 'Stretch Break: Stretch Those Limbs!',
            'reminderDateTime': '2023-08-09T10:10:00Z',
            'repeat': True,
            'reminderType': 'Weekly',
            'soundName': 'Bubbles',
            'soundUrl': './assets/sounds/cartoon-bubbles.mp3',
            'animationName': 'Strech Limbs',
            'animationUrl': './assets/images/breaks/stretch-limbs.jpg',
            'breakTime': '600',
            'breakDuration': '300'
        }
        url = reverse('create-reminder')
        response = self.client.post(url, data=data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_reminder_exception(self):
        data = {
            'reminderDateTime': '2023-09-10T10:10:00Z'
        }
        url = reverse('create-reminder')
        response = self.client.post(url, data=data)
        self.assertEqual(response.status_code,
                         status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertEqual(response.json()['resp'], 'error')

    def test_get_reminders_list(self):
        url = reverse('reminders')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    @ patch('api.views.Reminder.objects.filter')
    def test_get_reminder_exception(self, mock_filter):
        mock_filter.side_effect = Exception('Error occurred')
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        url = reverse('reminders')
        response = self.client.get(url)
        self.assertEqual(response.status_code,
                         status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertEqual(response.json()['resp'], 'error')

    def test_update_reminder(self):
        reminder = Reminder.objects.create(
            user=self.user,
            content='Stretch arms',
            reminderDateTime='2023-08-10T10:10:00Z',
            repeat=True,
            reminderType='Weekly'
        )

        data = {
            'content': 'Stretch Break: Stretch Those Limbs!',
            'reminderDateTime': '2023-08-09T10:10:00Z',
            'repeat': False,
            'reminderType': 'Weekly',
            'soundName': 'Bubbles',
            'soundUrl': './assets/sounds/cartoon-bubbles.mp3',
            'animationName': 'Strech Limbs',
            'animationUrl': './assets/images/breaks/stretch-limbs.jpg',
            'breakTime': '600',
            'breakDuration': '300'
        }

        url = reverse('update-reminder', args=[reminder.pk])
        response = self.client.put(
            url, data=data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_reminder_invalid_data(self):
        reminder = Reminder.objects.create(
            user=self.user,
            content='Stretch arms',
            reminderDateTime='2023-08-10T10:10:00Z',
            repeat=True,
            reminderType='Weekly'
        )
        data = {
            'content': ''}
        url = reverse('update-reminder', args=[reminder.pk])
        response = self.client.put(url, data=data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['resp'], 'failed')
        self.assertEqual(response.json()['message'], 'Invalid data.')

    def test_update_reminder_not_found(self):
        no_existing_pk = 700
        data = {
            'content': 'Stretch Break: Stretch Those Limbs!',
            'reminderDateTime': '2023-08-09T10:10:00Z',
            'repeat': False,
        }

        url = reverse('update-reminder', args=[no_existing_pk])
        response = self.client.put(url, data=data)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['resp'], 'failed')
        self.assertEqual(response.json()['message'], 'Reminder not found.')

    @ patch('api.views.ReminderSerializer')
    def test_update_reminder_exception(self, mock_serializer):
        reminder = Reminder.objects.create(
            user=self.user,
            content='Stretch arms',
            reminderDateTime='2023-08-10T10:10:00Z',
            repeat=True,
            reminderType='Weekly'
        )
        data = {
            'content': ''}
        url = reverse('update-reminder', args=[reminder.pk])
        response = self.client.put(url, data=data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['resp'], 'failed')
        self.assertEqual(response.json()['message'], 'Invalid data.')
        self.assertEqual(response.json()['errors'], {
                         'reminderDateTime': ['This field is required.']})

    def test_delete_reminder(self):
        reminder = Reminder.objects.create(
            user=self.user,
            content='Stretch arms',
            reminderDateTime='2023-08-10T10:10:00Z',
            repeat=True,
            reminderType='Weekly'
        )
        url = reverse('delete-reminder', args=[reminder.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['resp'], 'success')

    def test_delete_reminder_not_found(self):
        reminder_id = 700
        url = reverse('delete-reminder', args=[reminder_id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['resp'], 'failed')
        self.assertEqual(response.json()['message'], 'Reminder not found.')

    def test_delete_reminder_exception(self):
        with self.assertRaises(Exception):
            reminder = Reminder.objects.create(
                user=self.user, content='Stretch arms.')
            url = reverse('delete-reminder', args=[reminder.id])
            response = self.client.delete(url + 'error/')
            self.assertEqual(response.status_code, 500)
            self.assertEqual(response.json()['resp'], 'error')

        with self.assertRaises(Exception):
            reminder = Reminder.objects.create(
                user=self.user, content='Drink tea!')
            url = reverse('delete-reminder', args=[reminder.id])
            response = self.client.delete(url)
            self.assertEqual(response.status_code, 500)
            self.assertEqual(response.json()['resp'], 'error')


class DeleteRemindersTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='jane', password='janepwd')
        self.token = Token.objects.create(user=self.user)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        self.reminder1 = Reminder.objects.create(
            user=self.user, content='drink water', reminderDateTime='2023-08-10T10:10:00Z')
        self.reminder2 = Reminder.objects.create(
            user=self.user, content='drink coffee', reminderDateTime='2023-08-10T10:10:00Z')

    def test_delete_reminders(self):
        data = {'reminder_ids': [self.reminder1.id, self.reminder2.id]}
        url = reverse('delete_all')
        response = self.client.post(url, data=data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['resp'], 'success')

    def test_delete_reminders_no_ids(self):
        data = {'reminder_ids': []}
        url = reverse('delete_all')
        response = self.client.post(url, data=data)
        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.json()['resp'], 'error')

    def test_delete_reminders_invalid_ids(self):
        data = {'reminder_ids': [700, 800]}
        url = reverse('delete_all')
        response = self.client.post(url, data=data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['resp'], 'failed')
        self.assertEqual(response.json()['message'], 'Reminder not found.')

    def test_delete_reminders_not_found(self):
        data = {'reminder_ids': [self.reminder1.id, 700]}
        url = reverse('delete_all')
        response = self.client.post(url, data=data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['resp'], 'failed')
        self.assertEqual(response.json()['message'], 'Reminder not found.')


class ThemeAndSettingsTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='jane', password='janepwd')
        self.token = Token.objects.create(user=self.user)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')

    def test_set_theme(self):
        theme_data = {'theme': 'Sanguine'}
        response = self.client.post(reverse('set-theme'), data=theme_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        theme = Theme.objects.get(user=self.user)
        self.assertEqual(theme.theme_name, theme_data['theme'])

    def test_set_theme_empty(self):
        theme_data = {'theme': ''}
        response = self.client.post(reverse('set-theme'), data=theme_data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['resp'], 'success')

    def test_set_no_theme(self):
        theme_data = {}
        response = self.client.post(reverse('set-theme'), data=theme_data)
        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.json()['resp'], 'error')

    def test_get_theme(self):
        theme = Theme.objects.create(user=self.user, theme_name='Sanguine')
        response = self.client.get(reverse('get-theme'))
        response_data = response.json()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data['theme'], theme.theme_name)

    def test_get_theme_not_found(self):
        response = self.client.get(reverse('get-theme'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['resp'], 'failed')

    def test_set_settings(self):
        settings_data = {
            'isScreenOn': True,
            'isSoundOn': False,
            'isDndOn': True,
            'defaultSoundName': 'Chime',
            'defaultSoundUrl': './assets/sounds/chime.mp3'
        }
        response = self.client.post(
            reverse('set-settings'), data=settings_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_settings(self):
        settings = Setting.objects.create(
            user=self.user,
            isScreenOn=True,
            isSoundOn=False,
            isDndOn=True,
            defaultSoundName='Bell',
            defaultSoundUrl='./assets/sounds/bell.mp3'
        )
        response = self.client.get(reverse('get-settings'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response_data = response.json()
        settings_data = response_data['data']
        self.assertEqual(
            settings_data['defaultSoundName'], settings.defaultSoundName)
