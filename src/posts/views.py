from django.shortcuts import render
from .models import Post
from django.http import JsonResponse

# Create your views here.

def post_list_and_create(request):
    qs = Post.objects.all()         # get all posts from database
    return render(request, 'posts/main.html', {'qs':qs})  # return the request to template

def hello_world_view(request):
    return JsonResponse({'text'})