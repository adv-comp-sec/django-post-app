const testEl = document.getElementById('test-el');

testEl.textContent = 'bye bye';

testEl.addEventListener('click', ()=>{
    console.log('clicked');
    testEl.innerHTML = "<b>clicked</b>"
})

testEl.addEventListener('mouseover', ()=>{
    console.log('on');
})

testEl.addEventListener('mouseout', ()=>{
    console.log('off');
})

document.addEventListener('scroll', ()=>{
    const positionY = window.scrollY;
    console.log(positionY);
})

// Get the data with ajax
const url = 'https://swapi.dev/api/people/'

// 1. jquery ajax method

$.ajax({
    type: 'GET',
    url: url,
    sucess: function(response){
        console.log('jquery ajax', response)
    },
    error: function(error){
        console.log(error)
    }
})

// 2. XMLHttpRequest

const req = new XMLHttpRequest();

req.addEventListener('readystatechange', ()=>{
    // check if the request is complete and the response is ready
    if (req.readyState === 4){
        console.log('xhttp', JSON.parse(req.responseText));

    }
})

req.open('GET', url);
req.send();

// 3.  fetch method

fetch(url)
.then(resp=>resp.json()).then(data=>console.log('fetch', data))
.catch(err=>console.log(err))

