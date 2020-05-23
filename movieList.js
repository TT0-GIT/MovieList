const apiKey = `767a17491866d99d6e9e4da2bd8f8507`;
const baseUrl = `https://api.themoviedb.org`;
let movieContainer = document.getElementById("movieList");
let page = 1;
let prevBtn = document.getElementById("prev");
let nextBtn = document.getElementById("next");
let poster = document.getElementsByClassName("poster")
let likeIt = document.getElementsByClassName("top")
let likeListContent = document.getElementById("likeListContent");

getList = () => {
    let path = '/3/movie/popular'
    let language = 'en-US'
    let request = new XMLHttpRequest();
    request.open(`GET`,`${baseUrl}${path}?api_key=${apiKey}&language=${language}&page=${page}`);
    request.onload = () => {
       if (request.readyState == 4 && request.status == 200) {
           let myList = JSON.parse(request.responseText).results;
           renderList(myList)
       }
    };
    request.send();
};

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

renderList = (data) => {
     for (let i = 0; i < data.length; i++) {
         document.getElementById(`item-${i}`).src = `https://image.tmdb.org/t/p/w500${data[i].poster_path}`;
         document.getElementById(`item-${i}`).alt = `${data[i].title}`;
         document.getElementsByClassName(`posterTitle`)[i].innerHTML = `${data[i].title}` ;
         document.getElementsByClassName(`posterReleaseDate`)[i].innerHTML = `${data[i].release_date}`;

     }
}

getList();

nextBtn.addEventListener("click", () => {
    page += 1;
    prevBtn.innerHTML = `&lt;&lt;`;
    prevBtn.disabled = false;
    if (page == 500) {
        nextBtn.innerHTML = ``;
        nextBtn.disable = true;
        document.getElementById("pageInfo").innerHTML = `${page}`;
        getList();

    } else {
        document.getElementById("pageInfo").innerHTML = `${page}`;
        getList();

    }
} ) 

prevBtn.addEventListener("click", () => {
    page -= 1;
    if (page == 1) {
        prevBtn.innerHTML = ``;
        prevBtn.disabled = true;
        document.getElementById("pageInfo").innerHTML = `${page}`;
        getList();     
    } else {
        document.getElementById("pageInfo").innerHTML = `${page}`;
        getList();



    }
} ) 

getDetail = (movieId) => {
    let path = '/3/movie/'
    let language = 'en-US'
    let request = new XMLHttpRequest();
    request.open(`GET`,`${baseUrl}${path}${movieId}?api_key=${apiKey}&language=${language}`);
    request.onload = () => {
       if (request.readyState == 4 && request.status == 200) {
           let myDetail = JSON.parse(request.responseText);
           renderDetail(myDetail);
       }
    };
    request.send();
};

let colorArr = ['blue','lightseagreen','lightpink','darkgoldenrod','purple','black','red','goldenrod',
'violet','gold','darkgreen','orange','darkmagenta','pink','silver','lightskyblue',
'darkred','grey','brown']
let genresColor = {};
getGenres = (i) => {
    let path = '/3/genre/movie/list'
    let language = 'en-US'
    let request = new XMLHttpRequest();
    request.open(`GET`,`${baseUrl}${path}?api_key=${apiKey}&language=${language}`);
    request.onload = () => {
       if (request.readyState == 4 && request.status == 200) {
           let genresList = JSON.parse(request.responseText).genres;
           let name = genresList[i].name.replace(" ", ""); 
           genresColor = {name:name, backColor: colorArr[i]}
           document.querySelectorAll(`.${genresColor.name}`).forEach(n => n.style.backgroundColor=`${genresColor.backColor}`)
       }
    };
    request.send();
};

renderDetail = (data) => {
    document.getElementById('container').style.backgroundImage = `url(https://image.tmdb.org/t/p/w500${data.backdrop_path})`
    document.getElementById('detailPoster').src = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
    document.getElementById('detailPoster').alt = `"${data.title}"`;

    document.getElementById('movieTitle').innerHTML = `${data.title} (${data.release_date.slice(0,4)})`;
    
    let genres = document.getElementById('genres')
    let genresString = ``;
    for (let i = 0; i < data.genres.length; i++) {
        genresString += `<div class= "${data.genres[i].name.replace(" ","")}">${data.genres[i].name}</div>`;

    }
    genres.insertAdjacentHTML('beforeend',genresString);
    for (let i = 0; i<19; i++) {
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

let closeFunc = () => {
    document.getElementById('Detail').style.display = `none`;
    movieContainer.style.filter = ``;
}

getId = (i) => {
    let path = '/3/movie/popular'
    let language = 'en-US'
    let request = new XMLHttpRequest();
    request.open(`GET`,`${baseUrl}${path}?api_key=${apiKey}&language=${language}&page=${page}`);
    request.onload = () => {
       if (request.readyState == 4 && request.status == 200) {
           let myList = JSON.parse(request.responseText).results;
            getDetail(myList[i].id)
       }
    };
    request.send();
}

let modal = document.getElementById("Detail");
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = `none`;
        movieContainer.style.filter = ``;

    }
};

for (let i = 0; i<poster.length; i++) {
    poster[i].addEventListener("click", () => {
        movieContainer.style.filter = `blur(8px)`;
        document.getElementById('Detail').style.display = `block`;
        genres.querySelectorAll('*').forEach(n => n.remove());
        production.querySelectorAll('*').forEach(n => n.remove());
        getId(i);
    })
}

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
               likeObj = {title:myList[i].title, poster_path:myList[i].poster_path, release_date: myList[i].release_date}
               likeArr.push(likeObj);

               // likeListNav
               renderLikeButton();    
               
               //likeList--poster
               likeListContent.querySelectorAll('*').forEach(n => n.remove());
               renderLikePoster(likeArr);

               //config
               likeListTitleContent.querySelectorAll('*').forEach(n => n.remove());
               renderLikeTitle(likeArr);
            }
        }
    }
    request.send();
}

for (let i = 0; i<likeIt.length; i++) {
    likeIt[i].addEventListener("click", () => {
        getLike(i);
    })
}

let likeListButton = document.getElementById("likeListButton");
let likeList = document.getElementById("likeList")
let likeListTitle = document.getElementById("likeListTitle");
configFunc = () => {
    likeListTitle.style.display = 'block';
}

closeTitlefunc = () => {
    likeListTitle.style.display = 'none';
}
 
renderLikeButton = () => {
    document.getElementsByClassName("badge")[0].innerHTML = likeArr.length;
    document.getElementById("likeListButton").style.display = `block` 
}

renderLikePoster = (data) => {
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

const reorderArray = (oldIndex, newIndex, originalArray) => {
    const movedItem = originalArray.find((item, index) => index == oldIndex);
    const remainingItems = originalArray.filter((item, index) => index !== oldIndex);
  
    const reorderedItems = [
        ...remainingItems.slice(0, newIndex),
        movedItem,
        ...remainingItems.slice(newIndex)
    ];
  
    return reorderedItems;
}

function allowDrop(ev) {
    ev.preventDefault();
  }

  
  function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
      
  }

  let oldIndex;
  let newIndex;
  function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
    oldIndex = Number(data.slice(-1));
    newIndex = Number(ev.target.id.slice(-1));
    likeArr= reorderArray(oldIndex, newIndex, likeArr)
    likeListTitleContent.querySelectorAll('*').forEach(n => n.remove());
    renderLikeTitle(likeArr);
    likeListContent.querySelectorAll('*').forEach(n => n.remove());
    renderLikePoster(likeArr)
}
