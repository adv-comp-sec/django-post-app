from django.shortcuts import render
from .models import Post
from django.http import JsonResponse

# Create your views here.

def post_list_and_create(request):
    qs = Post.objects.all()         # get all posts from database
    return render(request, 'posts/main.html', {'qs':qs})  # return the request to template

# return a JSON response
def load_post_data_view(request):
    qs = Post.objects.all()
    data = []                   # create a list to save the values of each object
    for obj in qs:
        item = {
            'id': obj.id,
            'title': obj.title,
            'body': obj.body,
            'author': obj.author.user.username
        }
        data.append(item)
    return JsonResponse({'data': data})

def hello_world_view(request):
    return JsonResponse({'text': 'hello world'})