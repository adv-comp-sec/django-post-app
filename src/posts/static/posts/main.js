console.log('hello world');

const postsBox = document.getElementById('posts-box');  // div to display the posts
const spinnerBox = document.getElementById('spinner-box'); // get spinner div
const loadBtn = document.getElementById('load-btn');
const endBox = document.getElementById('end-box');

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
                                        <a href="#" class="btn btn-primary">Details</a>
                                    </div>
                                    <div class="col-2">
                                        <a href="#" class="btn btn-primary">${element.liked ? `Unlike (${element.count})`: `Like (${element.count})`}</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `
                });
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

loadBtn.addEventListener('click', ()=>{
    spinnerBox.classList.remove('not-visible');
    visible += 3;
    getData();
})

getData();