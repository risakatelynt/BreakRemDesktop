from django.contrib import admin

from .models import UserProfile, Reminder, Theme, Setting

# Register your models here.

# admin.site.register(User)
admin.site.register(UserProfile)
admin.site.register(Reminder)
admin.site.register(Theme)
admin.site.register(Setting)
