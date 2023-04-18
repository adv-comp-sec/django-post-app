from django.shortcuts import render
from .models import Post
from django.http import JsonResponse

# Create your views here.

def post_list_and_create(request):
    qs = Post.objects.all()         # get all posts from database
    return render(request, 'posts/main.html', {'qs':qs})  # return the request to template

# return a JSON response
def load_post_data_view(request, num_posts):
    visible = 3     # initial number of posts visible
    upper = num_posts
    lower = upper - visible     # number of posts inivisble
    size = Post.objects.all().count()   # count total number of posts

    qs = Post.objects.all()
    data = []                   # create a list to save the values of each object
    for obj in qs:
        item = {
            'id': obj.id,
            'title': obj.title,
            'body': obj.body,
            'liked': True if request.user in obj.liked.all() else False,
            'count': obj.like_count,
            'author': obj.author.user.username
        }
        data.append(item)
    return JsonResponse({'data': data[lower:upper], 'size': size})

def hello_world_view(request):
    return JsonResponse({'text': 'hello world'})