const apiKey = `767a17491866d99d6e9e4da2bd8f8507`;
const baseUrl = `https://api.themoviedb.org`;
let page = 1;
let likeArr = [];
let likeId = [];

/* 1. movie list main page */
// render movie list func
let movieContainer = document.getElementById("movieList");
renderList = (data) => {
    let popList = data.results;
    let htmlString = ``;
    for (let i = 0; i < popList.length; i++) {
        document.getElementById("pageText").innerHTML = `Showing Page <i id = "pageInfo" style="text-decoration: underline;">${data.page}</i> / <i>${data.total_pages}</i> | Items <i>20</i> / <i>${data.total_results}</i>`
        if (likeId.find((item) => item == `${popList[i].id}` )) {
            htmlString += `<div class= "movie">
                              <div class = "poster">
                                 <img onclick = selectMovie(${popList[i].id}) src="https://image.tmdb.org/t/p/w500${popList[i].poster_path}" alt="${popList[i].title}">
                                 <p><b>${popList[i].title}</b></p>
                                 <p>${popList[i].release_date}</p>
                              </div>
                              <button id = "${popList[i].id}" class = "top" disabled style="color:grey">liked</button>
                          </div>`;
        } else {
            htmlString += `<div class= "movie">
                              <div class = "poster">
                                 <img onclick = selectMovie(${popList[i].id}) src="https://image.tmdb.org/t/p/w500${popList[i].poster_path}" alt="${popList[i].title}">
                                 <p><b>${popList[i].title}</b></p>
                                 <p>${popList[i].release_date}</p>
                              </div>
                              <button id = "${popList[i].id}" class = "top" 
                              onclick = "selectLike('${popList[i].id}','${popList[i].title.replace("'", "")}','${popList[i].poster_path}','${popList[i].release_date}')">like it!</button> 
                           </div>`;
        }
    }
    movieContainer.insertAdjacentHTML('beforeend', htmlString)
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
    page += 1;
    prevBtn.innerHTML = `&lt;&lt;`;
    prevBtn.disabled = false;
    movieContainer.querySelectorAll('*').forEach(n => n.remove());
    if (page == 500) {
        nextBtn.innerHTML = ``;
        nextBtn.disable = true;
        getList();
    } else {
        getList();
    }
})

prevBtn.addEventListener("click", () => {
    //movieIdArr.splice(0,20);
    page -= 1;
    movieContainer.querySelectorAll('*').forEach(n => n.remove());
    if (page == 1) {
        prevBtn.innerHTML = ``;
        prevBtn.disabled = true;
        getList();
    } else {
        getList();
    }
})

/* 2. click on poster for each movie's detail info */
// call genres get movie list API for 19 different movie genres then fetch in movie detail genres matched 
// with different background color (same genres has same background color) --- using Async ... await call
let colorArr = ['blue', 'lightseagreen', 'lightpink', 'darkgoldenrod', 'purple', 'black',
    'red', 'goldenrod', 'violet', 'gold', 'darkgreen', 'orange', 'darkmagenta',
    'pink', 'silver', 'lightskyblue', 'darkred', 'grey', 'brown'] // movie genres background color

let genresArr = []
async function getGenres() {
    let path = '/3/genre/movie/list'
    let language = 'en-US'
    const URL = `${baseUrl}${path}?api_key=${apiKey}&language=${language}`;
    const fetchResult = fetch(URL)
    const response = await fetchResult;
    if (response.ok) {
        const jsondata = await response.json();
        let genresList = jsondata.genres;
        for (let i = 0; i < genresList.length; i++) {
            genresArr.push(genresList[i].name.replace(" ", ""))
        }
    } else {
        throw Error(response.statusText);
    }
}
getGenres()


// render movie detail function
renderDetail = (data) => {
    document.getElementById('container').style.backgroundImage = `url(https://image.tmdb.org/t/p/w500${data.backdrop_path})`

    document.getElementById('detailPoster').src = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
    document.getElementById('detailPoster').alt = `"${data.title}"`;

    document.getElementById('movieTitle').innerHTML = `${data.title} (${data.release_date.slice(0, 4)})`;

    // genres and matched background color
    let genres = document.getElementById('genres')
    let genresString = ``;
    for (let i = 0; i < data.genres.length; i++) {
        genresString += `<div class= "${data.genres[i].name.replace(" ", "")}">${data.genres[i].name}</div>`;
    }
    genres.insertAdjacentHTML('beforeend', genresString);
    for (let i = 0; i < genresArr.length; i++) {
        document.querySelectorAll(`.${genresArr[i]}`).forEach(n => n.style.backgroundColor = `${colorArr[i]}`)
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
    production.insertAdjacentHTML('beforeend', pdtString)

    document.getElementsByClassName("close")[0].innerHTML = "CLOSE";
}

// movie detail modal close function (click close or anywhere outside modal)
closeFunc = () => {
    document.getElementById('Detail').style.display = `none`;
    movieContainer.style.filter = ``;
}

window.onclick = function (event) {
    let modal = document.getElementsByClassName("modal");
    for (let i = 0; i < modal.length; i++) {
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

// function for click poster to show movie detail
selectMovie = (movieId) => {
    movieContainer.style.filter = `blur(8px)`;
    document.getElementById('Detail').style.display = `block`;
    genres.querySelectorAll('*').forEach(n => n.remove());
    production.querySelectorAll('*').forEach(n => n.remove());
    getDetail(movieId);
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
    for (let i = 0; i < data.length; i++) {
        likeString += `<div class = "likePoster">
                          <img src=https://image.tmdb.org/t/p/w500${data[i].poster_path} alt="${data[i].title}" style="height:auto;width:100%;">
                          <p><b>${data[i].title}</b></p>
                          <p>${data[i].release_date}</p>
                       </div>`
    }
    likeListContent.insertAdjacentHTML('beforeend', likeString)
}

// function for render like list title
renderLikeTitle = (data) => {
    let likeListTitleContent = document.getElementById("likeListTitleContent");
    let likeTitleString = ``;
    for (let i = 0; i < data.length; i++) {
        likeTitleString += `<div id = "divlike-${i}" ondrop="drop(event)" ondragover="allowDrop(event)">
                                 <p id = "like-${i}" draggable="true" ondragstart="drag(event)">${data[i].title}
                                 <span class="delete" onclick = likeRemove(${i})>&times;</span>
                                 </p>
                            </div>`
    }
    likeListTitleContent.insertAdjacentHTML('beforeend', likeTitleString)
}

// function for click "like it" to load likelist 
selectLike = (movieId, title, poster_path, release_date) => {
    // if (likeSet.has(movieId) == false) {
    //     likeSet.add(movieId);
        let likeObj = { id:movieId, title: title, poster_path: poster_path, release_date: release_date }
        likeArr.push(likeObj);
        likeId.push(movieId)
        console.log(likeId)

        // present like List menu in Navbar
        renderLikeButton(likeArr);

        // poster of like list
        likeListContent.querySelectorAll('*').forEach(n => n.remove());
        renderLikePoster(likeArr);

        // title of like list after click config
        likeListTitleContent.querySelectorAll('*').forEach(n => n.remove());
        renderLikeTitle(likeArr);

        document.getElementById(movieId).innerHTML = `liked`;
        document.getElementById(movieId).style.color = `grey`;
        document.getElementById(movieId).disabled = true;

    // }
}

likeRemove = (index) => {
    let removedItem = likeArr.splice(index,1);
    let removedId = likeId.splice(index,1);

    (likeArr.length>0) ?
    renderLikeButton(likeArr):
    (document.getElementById("likeListButton").style.display = `none`)

    // poster of like list
    likeListContent.querySelectorAll('*').forEach(n => n.remove());
    renderLikePoster(likeArr);

    // title of like list after click config
    likeListTitleContent.querySelectorAll('*').forEach(n => n.remove());
    renderLikeTitle(likeArr);
}

let movieListButton = document.getElementById("movieListButton");
movieListButton.addEventListener("click",() => {
    movieContainer.querySelectorAll('*').forEach(n => n.remove());
    getList();
})

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
    likeId = newArray(oldIndex, newIndex, likeId) 
    likeListTitleContent.querySelectorAll('*').forEach(n => n.remove());
    renderLikeTitle(likeArr);
    likeListContent.querySelectorAll('*').forEach(n => n.remove());
    renderLikePoster(likeArr)
}

/* 5. loading page*/
document.onreadystatechange = function () {
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
