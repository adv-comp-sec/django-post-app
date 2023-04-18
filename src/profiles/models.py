from django.db import models
from django.contrib.auth.models import User

# Create your models here.

# Delete profile
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)     # delete user's information
    bio = models.TextField(blank=True)                              # field for bio
    avatar = models.ImageField(default='avatar.png', upload_to='avatars')
    updated = models.DateTimeField(auto_now=True)                   # date time for updating and creating
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"profile of the user {self.user.username}"
