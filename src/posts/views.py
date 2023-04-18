from django.shortcuts import render
from .models import Post

# Create your views here.

def post_list_and_create(request):
    qs = Post.objects.all()         # get all posts from database
    return render(request, '', {'qs':qs})   # return the request to template
