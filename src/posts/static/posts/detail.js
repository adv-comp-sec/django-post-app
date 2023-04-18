console.log('hello world detail')


// variables
const backBtn = document.getElementById('back-btn');
const url = window.location.href + "data/"
const spinnerBox = document.getElementById('spinner-box')

// back button
backBtn.addEventListener('click', () => {
    history.back()
})

//
$.ajax({
    type: 'GET',
    url: url,
    success: function(response){
        console.log(response)
        spinnerBox.classList.add('not-visible');
    },
    error: function(error){
        console.log(error)
    }
})