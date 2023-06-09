from django.shortcuts import redirect, render
from .models import Post, Photo
from django.http import JsonResponse, HttpResponse
from .forms import PostForm
from profiles.models import Profile
from .utils import action_permission
from django.contrib.auth.decorators import login_required

# Create your views here.
# is_ajax() is deprecated
# use if request.headers.get('x-requested-with') == 'XMLHttpRequest':
@login_required
def post_list_and_create(request):
    form = PostForm(request.POST or None)
    # qs = Post.objects.all()         # get all posts from database

    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        if form.is_valid():
            author = Profile.objects.get(user=request.user)     # get user before save post
            instance = form.save(commit=False)
            instance.author = author
            instance.save()             # salve to the database
            return JsonResponse({
                'title': instance.title,
                'body': instance.body,
                'author': instance.author.user.username,
                'id': instance.id
            })

    context = {
        'form': form,
    }

    return render(request, 'posts/main.html', context)  # return the request to template


# shows the post detail
@login_required
def post_detail(request, pk):
    obj = Post.objects.get(pk=pk)
    form = PostForm()

    context = {
        'obj': obj,
        'form': form,
    }

    return render(request, 'posts/detail.html', context)


# return a JSON response
# handles ajax call
@login_required
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
    return redirect('posts:main-board')

# handle view for post detail
@login_required
def post_detail_data_view(request, pk):
    obj = Post.objects.get(pk=pk)
    data = {
        'id': obj.id,
        'title': obj.title,
        'body': obj.body,
        'author': obj.author.user.username,
        'logged_in': request.user.username,
    }

    return JsonResponse({'data': data})


# handles ajax call
@login_required
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
    return redirect('posts:main-board')

# view for update post
@login_required
@action_permission
def update_post(request, pk):
    obj = Post.objects.get(pk=pk)
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        new_title = request.POST.get('title')
        new_body = request.POST.get('body')
        obj.title = new_title
        obj.body = new_body
        obj.save()
        return JsonResponse({
            'title': new_title,
            'body': new_body,
        })
    return redirect('posts:main-board')

# view for delete post
@login_required
@action_permission
def delete_post(request, pk):
    obj = Post.objects.get(pk=pk)
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        obj.delete()
        return JsonResponse({})
    return redirect('posts:main-board')

    
# view for uploading image
@login_required
def image_upload_view(request):
    if request.method == 'POST':
        img = request.FILES.get('file')
        new_post_id = request.POST.get('new_post_id')
        post = Post.objects.get(id=new_post_id)
        Photo.objects.create(image=img, post=post)
    return HttpResponse()