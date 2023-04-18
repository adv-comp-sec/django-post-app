from django.shortcuts import render
from .models import Post
from django.http import JsonResponse
from .forms import PostForm
from profiles.models import Profile

# Create your views here.
# is_ajax() is deprecated
# use if request.headers.get('x-requested-with') == 'XMLHttpRequest':

def post_list_and_create(request):
    form = PostForm(request.POST or None)
    # qs = Post.objects.all()         # get all posts from database

    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        if form.is_valid():
            author = Profile.objects.get(user=request.user)     # get user before save post
            instance = form.save(commit=False)
            instance.author = author
            instance.save()             # salve to the database

    context = {
        'form': form,
    }

    return render(request, 'posts/main.html', context)  # return the request to template

# return a JSON response
# handles ajax call
def load_post_data_view(request, num_posts):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
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

# handles ajax call
def like_unlike_view(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        pk = request.POST.get('pk')
        obj = Post.objects.get(pk=pk)
        if request.user in obj.liked.all():
            liked = False
            obj.liked.remove(request.user)
        else:
            liked = True
            obj.liked.add(request.user)
        return JsonResponse({'liked': liked, 'count': obj.like_count})

def hello_world_view(request):
    return JsonResponse({'text': 'hello world'})