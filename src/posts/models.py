from django.db import models
from django.contrib.auth.models import User
from profiles.models import Profile

# Create your models here.

class Post(models.Model):
    title = models.CharField(max_length=200)
    body = models.TextField()
    liked = models.ManyToManyField(User, blank=True)    # track likes to the post
    author = models.ForeignKey(Profile, on_delete=models.CASCADE)
    updated = models.DateTimeField(auto_now=True)                   # date time for updating and creating
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.title)
    
    # class to count likes
    @property
    def like_count(self):
        return self.liked.all().count()
    
    # associate photos to a user
    def get_photos(self):
        return self.photo_set.all()
    
    # class to organize from newst to oldest
    class Meta:
        ordering = ("-created",)

# class to add images in the post
class Photo(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    image = models.ImageField(upload_to="photos")
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.post.title}-{self.pk}"

