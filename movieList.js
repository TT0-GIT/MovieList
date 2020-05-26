const apiKey = `767a17491866d99d6e9e4da2bd8f8507`;
const baseUrl = `https://api.themoviedb.org`;
let page = 1;

/* 1. movie list main page */
// htmlString: structure for movielist
let movieContainer = document.getElementById("movieList");
let htmlString = ``;
for (let i = 0; i < 20; i++) {
    htmlString += `<div class= "movie">
                      <div class = "poster">
                        <img id = "item-${i}" src="" alt="">
                        <p><b class="posterTitle"></b></p>
                        <p class="posterReleaseDate"></p>
                     </div>
                  <p class = "top">like it!</p>
                  </div>`;
}
movieContainer.insertAdjacentHTML('beforeend',htmlString)

//render movie list function and save movieId for each page
let movieIdArr = [];
renderList = (data) => {
    for (let i = 0; i < data.results.length; i++) {
        document.getElementById("pageText").innerHTML = `Showing Page <i id = "pageInfo" style="text-decoration: underline;">${data.page}</i> / <i>${data.total_pages}</i> | Items <i>20</i> / <i>${data.total_results}</i>`
        document.getElementById(`item-${i}`).src = `https://image.tmdb.org/t/p/w500${data.results[i].poster_path}`;
        document.getElementById(`item-${i}`).alt = `${data.results[i].title}`;
        document.getElementsByClassName(`posterTitle`)[i].innerHTML = `${data.results[i].title}` ;
        document.getElementsByClassName(`posterReleaseDate`)[i].innerHTML = `${data.results[i].release_date}`;
        movieIdArr.push(data.results[i].id)
    }
}
// call popular movie API, fetch movie list -- using fetch API


getList = () => {
    let path = '/3/movie/popular'
    let language = 'en-US'
    fetch(`${baseUrl}${path}?api_key=${apiKey}&language=${language}&page=${page}`)
       .then((response) => response.json())
       .then((movielist) => renderList(movielist))
}
getList();

// nextButton, prevButton
let prevBtn = document.getElementById("prev");
let nextBtn = document.getElementById("next");
nextBtn.addEventListener("click", () => {
    movieIdArr.splice(0,20);
    page += 1;
    prevBtn.innerHTML = `&lt;&lt;`;
    prevBtn.disabled = false;
    if (page == 500) {
        nextBtn.innerHTML = ``;
        nextBtn.disable = true;
        getList();
    } else {
        getList();
    }
} ) 

prevBtn.addEventListener("click", () => {
    movieIdArr.splice(0,20);
    page -= 1;
    if (page == 1) {
        prevBtn.innerHTML = ``;
        prevBtn.disabled = true;
        getList();     
    } else {
        getList();
    }
} ) 

/* 2. click on poster for each movie's detail info */
// call genres get movie list API for 19 different movie genres then fetch in movie detail genres matched 
// with different background color (same genres has same background color) --- using Async ... await call
let colorArr = ['blue','lightseagreen','lightpink','darkgoldenrod','purple','black',
                'red','goldenrod','violet','gold','darkgreen','orange','darkmagenta',
                'pink','silver','lightskyblue','darkred','grey','brown'] // movie genres background color

async function getGenres(i) {
    let path = '/3/genre/movie/list'
    let language = 'en-US'
    const URL = `${baseUrl}${path}?api_key=${apiKey}&language=${language}`;
    const fetchResult = fetch(URL)
    const response = await fetchResult;
    if (response.ok) {
        const jsondata = await response.json();
        let genresList = jsondata.genres;
        let name = genresList[i].name.replace(" ", ""); 
        let genresColor = {name:name, backColor: colorArr[i]} // match color with genres
        document.querySelectorAll(`.${genresColor.name}`).forEach(n => n.style.backgroundColor=`${genresColor.backColor}`)
    } else {
        throw Error(response.statusText);
    }
}

// render movie detail function
renderDetail = (data) => {
    document.getElementById('container').style.backgroundImage = `url(https://image.tmdb.org/t/p/w500${data.backdrop_path})` 
   
    document.getElementById('detailPoster').src = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
    document.getElementById('detailPoster').alt = `"${data.title}"`;
    
    document.getElementById('movieTitle').innerHTML = `${data.title} (${data.release_date.slice(0,4)})`;
    
    // genres and matched background color
    let genres = document.getElementById('genres')
    let genresString = ``;
    for (let i = 0; i < data.genres.length; i++) {
        genresString += `<div class= "${data.genres[i].name.replace(" ","")}">${data.genres[i].name}</div>`;
    }
    genres.insertAdjacentHTML('beforeend',genresString);
    for (let i = 0; i<colorArr.length; i++) {
        getGenres(i);
    }
    
    document.getElementById('overview').innerHTML = `<span style="font-weight:bold;color:#fff;">Overview:</span> ${data.overview}`;

    let pdtString = ``;
    for (let i = 0; i < data.production_companies.length; i++) {
        if (data.production_companies[i].logo_path) {
            pdtString += `<img src=https://image.tmdb.org/t/p/w500${data.production_companies[i].logo_path} alt="${data.production_companies[i].name}" style="height:100px;width: auto;">`
        } else {
            pdtString += `<span>${data.production_companies[i].name}</span>`
        }
    }
    production.insertAdjacentHTML('beforeend',pdtString)

    document.getElementsByClassName("close")[0].innerHTML = "CLOSE";
}

// movie detail modal close function (click close or anywhere outside modal)
closeFunc = () => {
    document.getElementById('Detail').style.display = `none`;
    movieContainer.style.filter = ``;
}

window.onclick = function(event) {
    let modal = document.getElementsByClassName("modal");
    for (let i=0;i<modal.length;i++) {
        if (event.target == modal[i]) {
            modal[i].style.display = `none`;
            movieContainer.style.filter = ``;
        }
    }
};

// call get detail API, fetch movie detail  
getDetail = (movieId) => {
    let path = '/3/movie/'
    let language = 'en-US'
    fetch(`${baseUrl}${path}${movieId}?api_key=${apiKey}&language=${language}`)
       .then((response) => response.json())
       .then(myDetail => renderDetail(myDetail));
};

// fetch movie detail modal when click specific movie poster
let poster = document.getElementsByClassName("poster")
for (let i = 0; i<poster.length; i++) {
    poster[i].addEventListener("click", () => {
        movieContainer.style.filter = `blur(8px)`;
        document.getElementById('Detail').style.display = `block`;
        genres.querySelectorAll('*').forEach(n => n.remove());
        production.querySelectorAll('*').forEach(n => n.remove());
        getDetail(movieIdArr[i]);
    })
}

/* 3. click "like it" to get like list and render like list */
// function for present like List menu in Navbar 
renderLikeButton = (data) => {
    let likeListButton = document.getElementById("likeListButton");
    document.getElementsByClassName("badge")[0].innerHTML = data.length;
    document.getElementById("likeListButton").style.display = `block` 
}

// function for render like list poster
renderLikePoster = (data) => {
    document.getElementById("likeListHeading").innerHTML = `Liked List`;
    document.getElementById("config").innerHTML = `CONFIG`;
    let likeString = ``;
    for (let i = 0; i <data.length; i++) {
        likeString += `<div class = "likePoster">
                          <img src=https://image.tmdb.org/t/p/w500${data[i].poster_path} alt="${data[i].title}" style="height:auto;width:100%;">
                          <p><b>${data[i].title}</b></p>
                          <p>${data[i].release_date}</p>
                       </div>`
    }
    likeListContent.insertAdjacentHTML('beforeend',likeString)
}

// function for render like list title
renderLikeTitle = (data) => {
    let likeListTitleContent = document.getElementById("likeListTitleContent");
    let likeTitleString = ``;
    for (let i = 0; i < data.length; i++) {
        likeTitleString += `<div id = "divlike-${i}" ondrop="drop(event)" ondragover="allowDrop(event)">
                                 <p id = "like-${i}" draggable="true" ondragstart="drag(event)">${data[i].title}</p>
                            </div>`
    }
    likeListTitleContent.insertAdjacentHTML('beforeend',likeTitleString)
}

// call get popular API to get like list info (title poster and release date)
let likeArr = [];
let likeSet = new Set();
getLike = (i) => {
    let path = '/3/movie/popular'
    let language = 'en-US'
    let request = new XMLHttpRequest();
    request.open(`GET`,`${baseUrl}${path}?api_key=${apiKey}&language=${language}&page=${page}`);
    request.onload = () => {
       if (request.readyState == 4 && request.status == 200) {
           let myList = JSON.parse(request.responseText).results;
           if (likeSet.has(myList[i].id)==false) {
               likeSet.add(myList[i].id);
               let likeObj = {title:myList[i].title, poster_path:myList[i].poster_path, release_date: myList[i].release_date}
               likeArr.push(likeObj);

               // present like List menu in Navbar
               renderLikeButton(likeArr);    
               
               // poster of like list
               likeListContent.querySelectorAll('*').forEach(n => n.remove());
               renderLikePoster(likeArr);

               // title of like list after click config
               likeListTitleContent.querySelectorAll('*').forEach(n => n.remove());
               renderLikeTitle(likeArr);
            }
        }
    }
    request.send();
}

// present like List menu in Navbar load like list page when click "like it" 
let likeIt = document.getElementsByClassName("top")
for (let i = 0; i<likeIt.length; i++) {
    likeIt[i].addEventListener("click", () => {
        getLike(i);
    })
}

// function for click config to show like list title
let likeListTitle = document.getElementById("likeListTitle");
configFunc = () => {
    likeListTitle.style.display = 'block';
}

// function for close like list title page
closeTitlefunc = () => {
    likeListTitle.style.display = 'none';
}

/* 4. order like list title by drag and drop, also show in like list poster*/
// function of reorder an array
newArray = (oldIndex, newIndex, oldArray) => {
    const movedItem = oldArray.find((item, index) => index == oldIndex);
    const remainingItems = oldArray.filter((item, index) => index !== oldIndex);
  
    const newItems = [
        ...remainingItems.slice(0, newIndex),
        movedItem,
        ...remainingItems.slice(newIndex)
    ];
  
    return newItems;
}

// allowDrop func
allowDrop = (ev) => {
    ev.preventDefault();
}

// drag func  
drag = (ev) => {
    ev.dataTransfer.setData("text", ev.target.id);   
}

// drop func
drop = (ev) => {
    ev.preventDefault();
    let data = ev.dataTransfer.getData("text");
    let oldIndex = Number(data.split("-")[1]);
    let newIndex = Number(ev.target.id.split("-")[1]);
    likeArr = newArray(oldIndex, newIndex, likeArr)
    likeListTitleContent.querySelectorAll('*').forEach(n => n.remove());
    renderLikeTitle(likeArr);
    likeListContent.querySelectorAll('*').forEach(n => n.remove());
    renderLikePoster(likeArr)
}

/* 5. loading page*/
document.onreadystatechange = function() { 
    if (document.readyState !== "complete") { 
        document.querySelector( 
          "body").style.visibility = "hidden"; 
        document.querySelector( 
          "#loader").style.visibility = "visible"; 
    } else { 
        document.querySelector( 
          "#loader").style.display = "none"; 
        document.querySelector( 
          "body").style.visibility = "visible"; 
    } 
}; 
