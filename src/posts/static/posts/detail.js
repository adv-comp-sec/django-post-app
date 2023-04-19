console.log('hello world detail')


// variables
const postBox = document.getElementById('post-box');
const backBtn = document.getElementById('back-btn');
const updateBtn = document.getElementById('update-btn');
const deleteBtn = document.getElementById('delete-btn');
const url = window.location.href + "data/"
const spinnerBox = document.getElementById('spinner-box')

// back button
backBtn.addEventListener('click', () => {
    history.back()
})

// ajax call 
$.ajax({
    type: 'GET',
    url: url,
    success: function(response){
        console.log(response);
        const data = response.data;

        // check if the author is the user logged in
        if (data.logged_in !== data.author) {

        } else {
            updateBtn.classList.remove('not-visible');
            deleteBtn.classList.remove('not-visible');
        }

        // create html element to display title
        const titleEl = document.createElement('h3');
        titleEl.setAttribute('class', 'mt-3');

        // create html element to display body
        const bodyEl = document.createElement('p');
        bodyEl.setAttribute('class', 'mt-1');

        // append the elements to the post box
        titleEl.textContent = data.title;
        bodyEl.textContent = data.body;

        postBox.appendChild(titleEl);
        postBox.appendChild(bodyEl);

        // hide spinner
        spinnerBox.classList.add('not-visible');
    },
    error: function(error){
        console.log(error)
    }
})