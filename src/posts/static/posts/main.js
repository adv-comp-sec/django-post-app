console.log('hello world');

const helloWorldBox = document.getElementById('hello-world');
const postsBox = document.getElementById('posts-box');  // div to display the posts
const spinnerBox = document.getElementById('spinner-box'); // get spinner div

// ajax call with DOM manipulation
$.ajax({
    type: 'GET',
    url: '/hello-world/',
    success: function(response) {
        console.log('success', response.text);
        helloWorldBox.textContent = response.text;
    },
    error: function(error) {
        console.log('error', error);
    },
})

// ajax call to get the data
$.ajax({
    type: 'GET',
    url: '/data/',
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
                    ${element.title} - <b>${element.body}</b><br>
            `
        });
        }, 100)      
    },
    error: function(error) {
        console.log(error);
    },

})