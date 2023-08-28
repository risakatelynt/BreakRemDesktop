from django.test import TestCase
from django.test import TestCase
from django.contrib.auth.models import User
from .models import UserProfile, Reminder, Theme, Setting

class UserProfileModelTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='johndoe', password='doe')
        self.user_profile = UserProfile.objects.create(user=self.user)

    def test_user_profile_str_method(self):
        self.assertEqual(str(self.user_profile),
                         f"{self.user.username} Picture")


class ReminderModelTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='johndoe', password='doe')
        self.reminder = Reminder.objects.create(
            user=self.user,
            content='Take a break',
            reminderDateTime='2023-08-09T11:17:00Z',
            reminderType='Hourly',
        )

    def test_reminder_str_method(self):
        self.assertEqual(str(self.reminder), 'Take a break')


class ThemeModelTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='johndoe', password='doe')
        self.theme = Theme.objects.create(
            user=self.user, theme_name='Sanguine')

    def test_theme_str_method(self):
        self.assertEqual(str(self.theme), f"{self.user.username} Theme")


class SettingModelTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='johndoe', password='doe')
        self.setting = Setting.objects.create(
            user=self.user, defaultSoundName='Bubbles')

    def test_setting_str_method(self):
        self.assertEqual(str(self.setting), f"{self.user.username} Settings")
