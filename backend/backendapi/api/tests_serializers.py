from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase
from .models import UserProfile
from .serializers import UserSerializer, UserProfileSerializer

class SerializerTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='janydoe',
            password='janydoe123',
            email='janydoe@gmail.com'
        )

    def test_user_serializer(self):
        data = {
            'username': 'johndoe',
            'email': 'johndoe@gmail.com',
            'password': 'johndoe123'
        }
        serializer = UserSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        user = serializer.save()
        self.assertEqual(user.username, 'johndoe')
        self.assertEqual(user.email, 'johndoe@gmail.com')
        self.assertTrue(user.check_password('johndoe123'))
        token = Token.objects.get(user=user)
        self.assertIsNotNone(token)

    def test_user_profile_serializer(self):
        user = User.objects.create(
            username='janedoe', email='janedoe@gmail.com')
        profile = UserProfile.objects.create(user=user)
        serializer = UserProfileSerializer(instance=profile)
        self.assertEqual(serializer.data['username'], 'janedoe')
        self.assertEqual(serializer.data['email'], 'janedoe@gmail.com')