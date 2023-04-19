console.log('hello world detail')


// variables
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

        spinnerBox.classList.add('not-visible');
    },
    error: function(error){
        console.log(error)
    }
})