const APIURL = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=1e35095c9d23be155d2528d03736a9a7"
const IMGPATH = 'https://image.tmdb.org/t/p/w500/'
const SEARCHAPI = 'https://api.themoviedb.org/3/search/movie?api_key=1e35095c9d23be155d2528d03736a9a7&query='
const GENREAPI = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=1e35095c9d23be155d2528d03736a9a7'
const BASEURL = 'https://api.themoviedb.org/3/'
const APIKEY = 'api_key=1e35095c9d23be155d2528d03736a9a7'
const GENRES = 	[
       {
          "id":28,
          "name":"Action"
       },
       {
          "id":12,
          "name":"Adventure"
       },
       {
          "id":16,
          "name":"Animation"
       },
       {
          "id":35,
          "name":"Comedy"
       },
       {
          "id":80,
          "name":"Crime"
       },
       {
          "id":99,
          "name":"Documentary"
       },
       {
          "id":18,
          "name":"Drama"
       },
       {
          "id":10751,
          "name":"Family"
       },
       {
          "id":14,
          "name":"Fantasy"
       },
       {
          "id":36,
          "name":"History"
       },
       {
          "id":27,
          "name":"Horror"
       },
       {
          "id":10402,
          "name":"Music"
       },
       {
          "id":9648,
          "name":"Mystery"
       },
       {
          "id":10749,
          "name":"Romance"
       },
       {
          "id":878,
          "name":"Science Fiction"
       },
       {
          "id":10770,
          "name":"TV Movie"
       },
       {
          "id":53,
          "name":"Thriller"
       },
       {
          "id":10752,
          "name":"War"
       },
       {
          "id":37,
          "name":"Western"
       }
    ]
 
const main = document.getElementById('main');
const from = document.getElementById('from');
const search = document.getElementById('search');
const tagsEl = document.getElementById('tags');

const prev = document.getElementById('prev');
const current = document.getElementById('current');
const next = document.getElementById('next');

var currentPage = 1;
var nextPage = 3;
var prevPage = 3;
var lasturl = '';
var totalPages= 100;

var selectedGenre = [];
    setGenre();
    function setGenre(){
        tagsEl.innerHTML = '';
        GENRES.forEach(genre=>{
            const t = document.createElement('div');
            t.classList.add('tag')
            t.id = genre.id;
            t.innerText = genre.name;
            t.addEventListener("click",()=>{
                if(selectedGenre.length == 0){
                    selectedGenre.push(genre.id);
                }else {
                    if(selectedGenre.includes(genre.id)){
                    selectedGenre.forEach((id,index)=>{
                        if(id=genre.id){
                            selectedGenre.splice(index,1);

                        }
                    })
                }else{
                    selectedGenre.push(genre.id);
                }
             }
            console.log(selectedGenre);
            getMovies(GENREAPI + '&with_genres='+encodeURI(selectedGenre.join(',')));
            highLightSelected();
            });
        
            tagsEl.appendChild(t)
        })
    }

    function highLightSelected(){
       const tags= document.querySelectorAll('.tag');
        tags.forEach(tag=>{
            tag.classList.remove('highlight')
        })
        if(selectedGenre !=0){
        selectedGenre.forEach(id=>{
            const highlightedT = document.getElementById(id);
            highlightedT.classList.add('highlight');
        });
    }
    }
//initailly Get movies
getMovies(APIURL);

async function getMovies(url){
             lasturl = url;
            const resp = await fetch(url);
            const respData = await resp.json();
            console.log(respData);
        if(respData.results.length !== 0){
            showMovies(respData.results);
            currentPage = respData.page;
            nextPage = currentPage +1;
            prevPage = currentPage -1;
            totalPages = respData.total_pages;
            current.innerHTML = currentPage;

        if(currentPage <=1){
            prev.classList.add('disable');
            next.classList.remove('disable');
        }else if(currentPage >=totalPages){;
            prev.classList.remove('disable');
            next.classList.add('disable');
        }else{
            prev.classList.remove('disable');
            next.classList.remove('disable');
        }
        tagsEl.scrollIntoView({behavior:"smooth"})
        }else{
            main.innerHTML = `<h1>No Result Found</h1>`
        }
}

function showMovies(movies){
    //clear main
    main.innerHTML = '';
    movies.forEach(movie => {
        const {poster_path,title,vote_average,overview,release_date,id} =movie;
        const movieEl =  document.createElement('div');
       
        movieEl.classList.add('movie');
        movieEl.innerHTML = `
            <img 
            src="${poster_path ? IMGPATH +poster_path : "https://www.lavalamp.com/wp-content/uploads/2016/07/placeholder-600x300.png"}" alt="${title}">
            <div class="movie_info">
                    <h3>${title}</h3>
                    <span class="${getClassByRate(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview">
                <h4>Overveiw:
                <br><h4 class="release">Release Date:<br>${release_date}</h4><br>
                </h4>${overview} <br>
                <button class="know_more" id="${id}">Learn More..</button>
            </div>
            
            
        `

        main.appendChild(movieEl)
        document.getElementById(id).addEventListener("click",()=>{
            console.log(id);
            openNav(movie);
        })
    });
}
const overlayContent = document.getElementById('overlay_content');
function openNav(movie) {
    let id = movie.id;
    fetch(BASEURL + 'movie/' + id+'/videos?'+APIKEY).then(res=>{res.json()
        .then(videoData=>{
            console.log(videoData);
            if(videoData){
                document.getElementById("myNav").style.width = "100%";
                if(videoData.results.length>0){
                    var embed =[];
                    videoData.results.forEach(video=>{
                        let {name,key,site} = video;
                        if(site== 'YouTube'){
                        embed.push(`
                            <iframe width="560" height="315" src="https://www.youtube.com/embed/${key}" title="${name}" class="embed hide" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                            `)}
                        
                    })
                    
                    overlayContent.innerHTML = embed.join('');
                    activeSlide=0;
                    showVideos();
                }else{
                    overlayContent.innerHTML = `<h1>No Result Found</h1>`

                }
            }
        })
    })
  }
  
  /* Close when someone clicks on the "x" symbol inside the overlay */
  function closeNav() {
    document.getElementById("myNav").style.width = "0%";
  } 

  var activeSlide = 0;
  var totalVideo = 0;
function showVideos(){
    let embedClasses = document.querySelectorAll('.embed');
    totalVideo = embedClasses.length;
    embedClasses.forEach((embedTags,idx) =>{
        if(activeSlide==idx){
            embedTags.classList.add('show')
            embedTags.classList.remove('hide')
        }else{
            embedTags.classList.add('hide')
            embedTags.classList.remove('show')
        }
    })
}

const leftArrow = document.getElementById('left_arrow');
const rightArrow = document.getElementById('right_arrow');

leftArrow.addEventListener("click",()=>{
    if(activeSlide>0){
        activeSlide --;
    }else{
        activeSlide = totalVideo - 1;
    }
    showVideos();
})
rightArrow.addEventListener("click",()=>{
    if(activeSlide<(totalVideo - 1)){
        activeSlide++;
    }else{
        activeSlide = 0;
    }
    showVideos();
})


function getClassByRate(vote){
    if(vote>=8){
        return 'green';
    }else if(vote>=5){
        return 'orange';
    }else{
        return 'red';
    }
}


  form.addEventListener("submit",(e)=>{
    e.preventDefault();

    const searchTerm = search.value;
    if(searchTerm){
        getMovies(SEARCHAPI + searchTerm)

        search.value = '';
    }
})


prev.addEventListener("click",()=>{
    if(prevPage<= totalPages){
        pagecall(prevPage);
    }
});

 next.addEventListener("click",()=>{
    if(nextPage > 0){
        pagecall(nextPage);
    }
});
function pagecall(page){
    let urlSplit =lasturl.split('?');
    let querryParam =urlSplit[1].split('&');
    let key = querryParam[querryParam.length - 1].split('=');
    if(key[0]!=page){
        let url = lasturl + '&page=' + page;
        getMovies(url);
    }else{
        key[1] = page.toString();
        let a = key.join('=');
        let querryParam =urlSplit[1].split('&') = a;
        let b = querryParam.join('&');
        let url = urlSplit[0]+`?`+ b;
        getMovies(url);

    }
}