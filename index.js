// http://www.omdbapi.com/?i=tt3896198&apikey=ea1f98f7


const fetchData = async (searchTerm) => {
    const response = await axios.get('http://www.omdbapi.com',{
        params: {
            apikey: 'ea1f98f7',
            s: searchTerm,

        }
    })
    if(response.data.Error){
        return [];
    }
  return response.data.Search;  
}

const onInput = async (e)=>{
    const movies = await fetchData(e.target.value);
    if(!movies.length){
        dropdown.classList.remove('is-active');
        return;
    }
    resultsWrapper.innerHTML='';//clear old list on every new entery
    dropdown.classList.add('is-active')
    for(let movie of movies){
        const imgSRC = movie.Poster=='N/A'?'':movie.Poster;
        const option = document.createElement('a');
        option.classList.add('dropdown-item')
        option.innerHTML=`
        <img src="${imgSRC}">
        ${movie.Title}
        `;
        option.addEventListener('click',()=>{
            input.value = movie.Title;
            dropdown.classList.remove('is-active');
            onMovieSelect(movie);//fetch movie details 
        })
        resultsWrapper.appendChild(option);
    } 
}

const root= document.querySelector('.autocomplete');
root.innerHTML=`
<label><b>Search for a movie</b></label>
<input type="text" class="input">
  <div class="dropdown">
    <div class="dropdown-menu">
      <div class="dropdown-content results"></div>
    </div>
  </div>
`;
document.addEventListener('click',(e)=>{
    if(!root.contains(e.target)){
        dropdown.classList.remove('is-active');
    }
});
const input = document.querySelector('input');
const dropdown=document.querySelector('.dropdown');
const resultsWrapper = document.querySelector('.results');
input.addEventListener('input',debounce(onInput,500));

const onMovieSelect=async(movie)=>{
    const response =  await axios.get('http://www.omdbapi.com',{
        params: {
            apikey: 'ea1f98f7',
            i: movie.imdbID,
        } 
    });
    document.querySelector('#summary').innerHTML= movieTemplate(response.data);//inject html with details
    
}

const movieTemplate= movieDetails =>{
    return `
    <article class="media">
    <figure class="media-left">
      <p class="image">
        <img src="${movieDetails.Poster}"/>
      </p>
    </figure>
    <div class="media-content">
      <div class="content">
        <h1>${movieDetails.Title}</h1>
        <h4>${movieDetails.Genre}</h4>
        <p>${movieDetails.Plot}</p>
      </div>
    </div>
  </article>
  <article class="notification is-primary">
    <p class="title">
      ${movieDetails.Awards}
    </p>
    <p class="subtitle">Awards</p>
  </article>
  <article class="notification is-primary">
    <p class="title">
      ${movieDetails.BoxOffice}
    </p>
    <p class="subtitle">Box Office</p>
  </article>
  <article class="notification is-primary">
    <p class="title">
      ${movieDetails.Metascore}
    </p>
    <p class="subtitle">Metascore</p>
  </article>
  <article class="notification is-primary">
    <p class="title">
      ${movieDetails.imdbRating}
    </p>
    <p class="subtitle">IMDB Rating</p>
  </article>
  <article class="notification is-primary">
    <p class="title">
      ${movieDetails.imdbVotes}
    </p>
    <p class="subtitle">IMDB Votes</p>
  </article>
    `;
}

