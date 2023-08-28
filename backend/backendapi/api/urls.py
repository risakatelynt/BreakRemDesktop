from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.UserViewSet.register_user, name='register'),
    path('login/', views.UserViewSet.login_user, name='login'),
    path('logout/', views.UserViewSet.logout_user, name='logout'),
    path('userprofile/addImage/', views.FileUploadView.as_view(),
         name='update-profile-image'),
    path('userprofile/addProfile/', views.SetUserProfile.as_view(),
         name='update-profile'),
    path('userprofile/', views.UserProfileView.as_view(), name='profile'),
    path('reminders/create/', views.RemindersViewSet.getReminders,
         name="create-reminder"),
    path('reminders/', views.RemindersViewSet.getReminders, name="reminders"),
    path('reminders/<int:pk>/update/',
         views.RemindersViewSet.getReminder, name="update-reminder"),
    path('reminders/<int:pk>/delete/',
         views.RemindersViewSet.getReminder, name="delete-reminder"),
    path('reminders/delete/', views.RemindersViewSet.deleteReminders,
         name='delete_all'),
    path('theme/', views.ThemeViewSet.Themes, name='get-theme'),
    path('theme/set/', views.ThemeViewSet.Themes, name='set-theme'),
    path('settings/', views.SettingsViewSet.Settings, name='get-settings'),
    path('settings/set/', views.SettingsViewSet.Settings, name='set-settings'),
]
