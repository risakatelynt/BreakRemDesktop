from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from .models import UserProfile, Reminder, Theme, Setting
from .serializers import ReminderSerializer, SettingSerializer
from django.http import JsonResponse
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth.decorators import login_required


def register(request):
    try:
        username = request.data['username']
        email = request.data['email']
        password = request.data['password']

        # Check if username or email already exists
        if User.objects.filter(username=username).exists():
            return JsonResponse({'resp': 'failed', 'message': 'Username already exists. Please enter a different username.'})
        if User.objects.filter(email=email).exists():
            return JsonResponse({'resp': 'failed', 'message': 'Email ID already exists. Please enter a different email.'})

        # Create the user
        user = User.objects.create_user(
            username=username, email=email, password=password)

        #  create a user profile for the user
        UserProfile.objects.create(user=user)

        # Create a token for the user
        token, _ = Token.objects.get_or_create(user=user)

        # Create a theme for the user
        Theme.objects.create(user=user, theme_name='default')

        # Create settings for the user
        Setting.objects.create(
            user=user, isScreenOn=True, isSoundOn=True, isDndOn=False)

        return JsonResponse({'resp': 'success', 'token': token.key})
    except Exception as e:
        return JsonResponse({'resp': 'error', 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def user_login(request):
    try:
        username = request.data['username']
        password = request.data['password']

        # Check if username exists
        if not User.objects.filter(username=username).exists():
            return JsonResponse({'resp': 'failed', 'message': 'Invalid username.'})

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)

            # Create a new token for the logged-in user
            token, _ = Token.objects.get_or_create(user=user)

            return JsonResponse({'resp': 'success', 'token': token.key})
        else:
            return JsonResponse({'resp': 'failed', 'message': 'Invalid password.'})
    except Exception as e:
        return JsonResponse({'resp': 'error', 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@login_required
def user_logout(request):
    try:
        # Delete the token associated with the logged-out user
        token = Token.objects.get(user=request.user)
        token.delete()
        logout(request)
        return JsonResponse({'resp': 'success'})
    except Exception as e:
        return JsonResponse({'resp': 'error', 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def createReminder(request):
    try:
        data = request.data
        user = request.user
        Reminder.objects.create(
            user=user,
            content=data['content'],
            reminderDateTime=data['reminderDateTime'],
            repeat=data['repeat'],
            reminderType=data['reminderType'],
            soundName=data['soundName'],
            soundUrl=data['soundUrl'],
            animationName=data['animationName'],
            animationUrl=data['animationUrl'],
            breakTime=data['breakTime'],
            breakDuration=data['breakDuration']
        )
        return JsonResponse({'resp': 'success', 'message': 'Reminder created successfully!'})
    except Exception as e:
        return JsonResponse({'resp': 'error', 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def getRemindersList(request):
    try:
        user = request.user
        reminders = Reminder.objects.filter(user=user)
        serializer = ReminderSerializer(reminders, many=True)
        return JsonResponse({'resp': 'success', 'data': serializer.data})
    except Exception as e:
        return JsonResponse({'resp': 'error', 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def updateReminder(request, pk):
    try:
        data = request.data
        user = request.user
        try:
            reminder = Reminder.objects.get(id=pk, user=user)
        except Reminder.DoesNotExist:
            return JsonResponse({'resp': 'failed', 'message': 'Reminder not found.'})

        serializer = ReminderSerializer(instance=reminder, data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse({'resp': 'success'})
        else:
            return JsonResponse({'resp': 'failed', 'message': 'Invalid data.', 'errors': serializer.errors})

    except Exception as e:
        return JsonResponse({'resp': 'error', 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def deleteReminder(request, pk):
    try:
        user = request.user
        reminder = Reminder.objects.get(id=pk, user=user)
        reminder.delete()
        return JsonResponse({'resp': 'success'})
    except ObjectDoesNotExist:
        return JsonResponse({'resp': 'failed', 'message': 'Reminder not found.'})
    except Exception as e:
        return JsonResponse({'resp': 'error', 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def deleteReminders(request):
    try:
        reminder_ids = request.data['reminder_ids']
        user = request.user
        if reminder_ids:
            for reminder_id in reminder_ids:
                reminder = Reminder.objects.get(id=reminder_id, user=user)
                reminder.delete()
            return JsonResponse({'resp': 'success'})
        else:
            return JsonResponse({'resp': 'failed', 'message': 'Reminder not found.'}, status=400)
    except ObjectDoesNotExist:
        return JsonResponse({'resp': 'failed', 'message': 'Reminder not found.'})
    except Exception as e:
        return JsonResponse({'resp': 'error', 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def set_theme(request):
    try:
        theme_name = request.data['theme']
        if theme_name is not None:
           # Get the user for the current request
            user = request.user

            # Check if the user already has a theme, if so, update it otherwise, create a new theme
            theme, created = Theme.objects.get_or_create(user=user)
            theme.theme_name = theme_name
            theme.save()

            # Return a success JSON response
            return JsonResponse({'resp': 'success'})
        else:
            return JsonResponse({'resp': 'failed', 'message': 'Invalid theme data'}, status=400)
    except Exception as e:
        # Return an error JSON response if the request method is not POST
        return JsonResponse({'resp': 'error', 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def get_theme(request):
    try:
        # Retrieve the theme preference for the current user from the database
        theme = Theme.objects.get(user=request.user)

        # Return the theme preference as a JSON response
        return JsonResponse({'resp': 'success', 'theme': theme.theme_name})
    except Theme.DoesNotExist:
        return JsonResponse({'resp': 'failed', 'message': 'Theme not found for the current user.'})
    except Exception as e:
        return JsonResponse({'resp': 'error', 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def set_settings(request):
    try:
        # Get the user for the current request
        user = request.user

        # Check if the user already has a theme, if so, update it otherwise, create a new theme
        settings, created = Setting.objects.get_or_create(user=user)
        settings.isScreenOn = request.data['isScreenOn']
        settings.isSoundOn = request.data['isSoundOn']
        settings.isDndOn = request.data['isDndOn']
        settings.defaultSoundName = request.data['defaultSoundName']
        settings.defaultSoundUrl = request.data['defaultSoundUrl']
        settings.save()
        return JsonResponse({'resp': 'success', 'message': 'Setting created successfully!'})
    except Exception as e:
        return JsonResponse({'resp': 'error', 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def get_settings(request):
    try:
        # Retrieve the theme preference for the current user from the database
        settings = Setting.objects.get(user=request.user)
        serializer = SettingSerializer(settings)

        # Return the theme preference as a JSON response
        return JsonResponse({'resp': 'success', 'data': serializer.data})
    except Theme.DoesNotExist:
        return JsonResponse({'resp': 'failed', 'message': 'Setting not found for the current user.'})
    except Exception as e:
        return JsonResponse({'resp': 'error', 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
