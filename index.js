// http://www.omdbapi.com/?i=tt3896198&apikey=ea1f98f7


// const onInput = async (e)=>{
//     const movies = await fetchData(e.target.value);
//     if(!movies.length){
//         dropdown.classList.remove('is-active');
//         return;
//     }
//     resultsWrapper.innerHTML='';//clear old list on every new entery
//     dropdown.classList.add('is-active')
//     for(let movie of movies){
//         const imgSRC = movie.Poster=='N/A'?'':movie.Poster;
//         const option = document.createElement('a');
//         option.classList.add('dropdown-item')
//         option.innerHTML=`
//         <img src="${imgSRC}">
//         ${movie.Title}
//         `;
//         option.addEventListener('click',()=>{
//             input.value = movie.Title;
//             dropdown.classList.remove('is-active');
//             onMovieSelect(movie);//fetch movie details 
//         })
//         resultsWrapper.appendChild(option);
//     } 
// }

// const root= document.querySelector('.autocomplete');
// root.innerHTML=`
// <label><b>Search for a movie</b></label>
// <input type="text" class="input">
//   <div class="dropdown">
//     <div class="dropdown-menu">
//       <div class="dropdown-content results"></div>
//     </div>
//   </div>
// `;
// document.addEventListener('click',(e)=>{
//     if(!root.contains(e.target)){
//         dropdown.classList.remove('is-active');
//     }
// });
// const input = document.querySelector('input');
// const dropdown=document.querySelector('.dropdown');
// const resultsWrapper = document.querySelector('.results');
// input.addEventListener('input',debounce(onInput,500));
const autoCompleteConfig={
  renderOption(movie){
  const imgSRC = movie.Poster=='N/A'?'':movie.Poster;
  return `
  <img src="${imgSRC}">
  ${movie.Title}(${movie.Year})
  `
},

inputValue(movie){
  return movie.Title;
},
async fetchData(searchTerm) {
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


}
createAutocomplete({
  ...autoCompleteConfig,
  root:document.querySelector("#left-autocomplete"),
  onOptionSelect(movie){
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie,document.querySelector('#left-summary'),'left')
  },
  
});
createAutocomplete({
  ...autoCompleteConfig,
  root:document.querySelector("#right-autocomplete"),
  onOptionSelect(movie){
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie,document.querySelector('#right-summary'),'right')
  }
  
});
let leftMovie;
let rightMovie;

const onMovieSelect=async(movie,summaryElement,side)=>{
    const response =  await axios.get('http://www.omdbapi.com',{
        params: {
            apikey: 'ea1f98f7',
            i: movie.imdbID,
        } 
    });
    summaryElement.innerHTML= movieTemplate(response.data);//inject html with details
    if(side === 'left'){
      leftMovie=response.data;
    }else{
      rightMovie=response.data;
    }
    if(leftMovie && rightMovie){
      runComparison();
    }
}
const runComparison=()=>{
 const leftSideStats= document.querySelectorAll('#left-summary .notification')
 const rightSideStats= document.querySelectorAll('#right-summary .notification')
 leftSideStats.forEach((leftStat,index)=>{
   const rightStat = rightSideStats[index];
   console.log(leftStat,rightStat);
   const leftSideValue = parseInt(leftStat.dataset.value);
   const rightSideValue = parseInt(rightStat.dataset.value);
   if(rightSideValue>leftSideValue){
     leftStat.classList.remove('is-primary');
     leftStat.classList.add('is-warning')
   }else{
    rightStat.classList.remove('is-primary');
    rightStat.classList.add('is-warning')
   }


 })
}
const movieTemplate= movieDetails =>{
  const dollors = parseInt(movieDetails.BoxOffice.replace(/\$/g,'').replace(/,/g,''));
  const metascore= parseInt(movieDetails.Metascore);
  const imdbRating=parseFloat(movieDetails.imdbRating);
  const imdbVotes= parseInt(movieDetails.imdbVotes.replace(/,/g,''));
  const awards=movieDetails.Awards.split('').reduce((prev,word) => {
    const value = parseInt(word);
    if(isNaN(value)){
      return prev;
    }else{
      return prev + value;
    }
  },0);

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
  <article data-value=${awards} class="notification is-primary">
    <p class="title">
      ${movieDetails.Awards}
    </p>
    <p class="subtitle">Awards</p>
  </article>
  <article data-value=${dollors} class="notification is-primary">
    <p class="title">
      ${movieDetails.BoxOffice}
    </p>
    <p class="subtitle">Box Office</p>
  </article>
  <article data-value=${metascore} class="notification is-primary">
    <p class="title">
      ${movieDetails.Metascore}
    </p>
    <p class="subtitle">Metascore</p>
  </article>
  <article data-value=${imdbRating} class="notification is-primary">
    <p class="title">
      ${movieDetails.imdbRating}
    </p>
    <p class="subtitle">IMDB Rating</p>
  </article>
  <article data-value=${imdbVotes} class="notification is-primary">
    <p class="title">
      ${movieDetails.imdbVotes}
    </p>
    <p class="subtitle">IMDB Votes</p>
  </article>
    `;
}

