console.log('hello world');

const postsBox = document.getElementById('posts-box');  // div to display the posts
const spinnerBox = document.getElementById('spinner-box'); // get spinner div
const loadBtn = document.getElementById('load-btn');
const endBox = document.getElementById('end-box');

const postForm = document.getElementById('post-form'); // new post form
const title = document.getElementById('id_title');
const body = document.getElementById('id_body');
const csrf = document.getElementsByName('csrfmiddlewaretoken');

const url = window.location.href;

const alertBox = document.getElementById('alert-box');
console.log('csrf', csrf[0].value);

// Get CSRF token
const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');

// function to handle the click button for like/unlike
const likeUnlikePosts = () => {
    const likeUnlikeForms = [...document.getElementsByClassName('like-unlike-forms')]
    likeUnlikeForms.forEach(form => form.addEventListener('submit', e => {
        e.preventDefault();
        const clickedId = e.target.getAttribute('data-form-id');
        const clickedBtn = document.getElementById(`like-unlike-${clickedId}`);

        $.ajax({
            type: 'POST',
            url: '/like-unlike/',
            data: {
                'csrfmiddlewaretoken': csrftoken,
                'pk': clickedId,
            },
            success: function(response) {
                console.log(response);
                clickedBtn.textContent = response.liked ? `Unlike (${response.count})`: `Like (${response.count})`
            },
            error: function(error) {
                console.log(error);
            },
        })
    }))
}

let visible = 3;    // initial number of posts to display

// getData will be triggered by a button clicked
const getData = () => {
    // ajax call to get the data
    $.ajax({
        type: 'GET',
        url: `/data/${visible}`,
        success: function(response) {
            console.log(response);
            const data = response.data;     // data is an array from views.py
            // timeout to display the spinner before the data is load
            setTimeout(() => {
                spinnerBox.classList.add('not-visible');
                console.log(data);
                // loop the data array and display each post within the div
                data.forEach(element => {
                    postsBox.innerHTML += `
                        <div class="card mb-2">
                            <div class="card-body">
                                <h5 class="card-title">${element.title}</h5>
                                <p class="card-text">${element.body}</p>      
                            </div>
                            <div class="card-footer">
                                <div class="row">
                                    <div class="col-1">
                                        <a href="${url}${element.id}" class="btn btn-primary">Details</a>
                                    </div>
                                    <div class="col-2">
                                        <form class="like-unlike-forms" data-form-id="${element.id}"> <!-- get element id to handle the likes of each post -->   
                                            <button href="#" class="btn btn-primary" id="like-unlike-${element.id}">${element.liked ? `Unlike (${element.count})`: `Like (${element.count})`}</button> <!-- show unlike if the post already liked -->
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `
                });
                likeUnlikePosts();
            }, 100)
            console.log(response.size);
            if (response.size === 0) {
                endBox.textContent = 'No posts added yet...';
            }
            else if (response.size <= visible) {
                loadBtn.classList.add('not-visible');
                endBox.textContent = 'No more posts to load';
            }      
        },
        error: function(error) {
            console.log(error);
        },

    })
}

// button to load more posts
loadBtn.addEventListener('click', ()=>{
    spinnerBox.classList.remove('not-visible');
    visible += 3;
    getData();
})


// function to handle saving a new post
postForm.addEventListener('submit', e=> {
    e.preventDefault()

    $.ajax({
        type: 'POST',
        url: '',
        data: {
            'csrfmiddlewaretoken': csrf[0].value,
            'title': title.value,
            'body': body.value
        },
        success: function(response) {
            console.log(response);
            postsBox.insertAdjacentHTML('afterbegin', `
                    <div class="card mb-2">
                        <div class="card-body">
                            <h5 class="card-title">${response.title}</h5>
                            <p class="card-text">${response.body}</p>      
                        </div>
                        <div class="card-footer">
                            <div class="row">
                                <div class="col-1">
                                    <a href="#" class="btn btn-primary">Details</a>
                                </div>
                                <div class="col-2">
                                    <form class="like-unlike-forms" data-form-id="${response.id}"> <!-- get element id to handle the likes of each post -->   
                                        <button href="#" class="btn btn-primary" id="like-unlike-${response.id}">Like (0)</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

            `);
            likeUnlikePosts();
            $('#addPostModal').modal('hide') // hide the modal after saving post
            handleAlerst('success', 'New post added!')  // display alert
            postForm.reset()    // clear form after saving the post
        },
        error: function(error) {
            console.log(error)
            $('#addPostModal').modal('hide') // hide the modal after saving post
            handleAlerst('danger', 'Ops... something went wrong!') // display alert
        }
    })
})
getData();