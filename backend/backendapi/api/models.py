from django.contrib.auth.models import User
from django.db import models

# UserProfile model with user details and profile pictures

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    profile_picture = models.FileField(
        upload_to='profile_pics/', null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} Picture"


# Reminder model with user reminders

class Reminder(models.Model):
    reminder_choices = [
        ('Select Option', 'Select Option'),
        ('Hourly', 'Hourly'),
        ('Daily', 'Daily'),
        ('Weekly', 'Weekly'),
        ('Monthly', 'Monthly'),
        ('Yearly', 'Yearly')
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField(default='Reminder Text', blank=False)
    reminderDateTime = models.DateTimeField()
    repeat = models.BooleanField(default=False)
    reminderType = models.TextField(
        choices=reminder_choices, null=True, blank=True)
    soundName = models.CharField(max_length=100, null=True, blank=True)
    soundUrl = models.CharField(max_length=100, null=True, blank=True)
    animationName = models.CharField(max_length=100, null=True, blank=True)
    animationUrl = models.CharField(max_length=100, null=True, blank=True)
    breakTime = models.IntegerField(null=True, blank=True)
    breakDuration = models.IntegerField(null=True, blank=True)

    def __str__(self):
        # return first 50 characters
        return self.content[0:50]


# Theme model with user themes

class Theme(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    theme_name = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.user.username} Theme"


# Setting model with user settings

class Setting(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    isScreenOn = models.BooleanField(default=True)
    isSoundOn = models.BooleanField(default=True)
    isDndOn = models.BooleanField(default=False)
    defaultSoundName = models.CharField(max_length=100, null=True, blank=True)
    defaultSoundUrl = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} Settings"
