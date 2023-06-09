// Function to fetch movie info
function searchMovie() {
  const input = document.getElementById('searchInput');
  const query = input.value;

  // fetch through omdb api
  fetch(`https://www.omdbapi.com/?apikey=f26b11a3&t=${query}`)
    .then(response => response.json())
    .then(data => {
      if (data.Response === "True") {
        const imdbId = data.imdbID;

        // Call the getSources function with the IMDB ID
        getSources(imdbId);

        // Call the getTrailer function with the movie title
        getTrailer(data.Title);

        // Rest of your code for displaying movie info
        const movieInfo = document.getElementById('movieInfo');
        let ratingsHTML = "";
        data.Ratings.forEach(rating => {
          ratingsHTML += `<p>${rating.Source}: ${rating.Value}</p>`;
        });
        movieInfo.innerHTML = `
          <h2>${data.Title}</h2>
          <p>Year: ${data.Year}</p>
          <p>Rating: ${data.Rated}</p>
          <p>Director: ${data.Director}</p>
          <p>Starring: ${data.Actors}</p>
          <p>Plot Synopsis: ${data.Plot}</p>
          ${ratingsHTML}
          <img src="${data.Poster}" alt="${data.Title} Poster">
        `;
      } else {
        const movieInfo = document.getElementById('movieInfo');
        movieInfo.innerHTML = `<p>Movie not found!</p>`;
      }
    })
    .catch(error => {
      console.log(error);
    });
}

  // Function to fetch sources using Watchmode API
  function getSources(titleId) {
    // puts the imdb titleID into a fetch request
    fetch(`https://api.watchmode.com/v1/title/${titleId}/details/?apiKey=WPmG7Zz5vHjq40wGf0WSfvoq2z6F38BSqO3r9xPe&append_to_response=sources`)
    // parses resopnse as JSON object
      .then(response => response.json())
      // runs that JSON response object as data
      .then(data => {
        console.log(data); // Logs the response data to the console
  
        // if conditional to check that there are more than zero sources fetched
        if (data.sources && data.sources.length > 0) {
          // assigns array of streaming sources from data to variable "sources"
          const sources = data.sources;
          console.log(sources); // Log the sources to the console
  
          // Remove duplicates from the sources array based on name
          // extracts all source names into an array with sources.map(source => source.name)
          // that array passes through "new Set()" to remove duplicate names
          // then uses Array.from() to create another array and puts the non duplicated names into it
          const uniqueSources = Array.from(new Set(sources.map(source => source.name)))
         
          // uses sources.find() to invoke a callback function on each element in the sources array
          // each "name" property of the element "source" is compared to the current name being mapped and returns the element if a match is found
            .map(name => sources.find(source => source.name === name));
  
          // grabs the sourcesList div and makes into variable
          const sourcesList = document.getElementById('sourcesList');
          // maps an array of each source.name property with list item tags then joins them together into a single string
          const sourcesHTML = uniqueSources.map(source => `<li>${source.name}</li>`).join('');
          // takes the list items from sourcesHTML and puts them into a unordered list at the sourcesList <div>
          sourcesList.innerHTML = `<ul>${sourcesHTML}</ul>`;
        } else {
          // if there number of sources is 0, displays "No sources found" message
          const sourcesList = document.getElementById('sourcesList');
          sourcesList.innerHTML = `<p>No sources found for this title ID.</p>`;
        }
      })
      // if an error is caught log it to the console and displays error on page
      .catch(error => {
        console.log(error);
        const sourcesList = document.getElementById('sourcesList');
        sourcesList.innerHTML = `<p>Error: ${error.message}</p>`;
      });
  }


// Function to fetch YouTube video
function getTrailer(title) {
  fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(title)}%20trailer&type=video&key=AIzaSyBjlHZovY7E-pNRbyj040cVvcy0jPcF1PI`, {
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101 Safari/537.36'
    },
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch trailer from YouTube API.');
      }
      return response.json();
    })
    .then(data => {
      if (data.items && data.items.length > 0) {
        const trailerContainer = document.getElementById('trailerContainer');
        const videoId = data.items[0].id.videoId; // Assuming the first video is the trailer

        trailerContainer.innerHTML = `
          <iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        `;
      } else {
        const trailerContainer = document.getElementById('trailerContainer');
        trailerContainer.innerHTML = `<p>No trailer found for this title.</p>`;
      }
    })
    .catch(error => {
      console.log(error);
      const trailerContainer = document.getElementById('trailerContainer');
      trailerContainer.innerHTML = `<p>Error: ${error.message}</p>`;
    });
}

// Event listener for search button
document.addEventListener('DOMContentLoaded', function() {
  const searchButton = document.getElementById('searchButton');
  searchButton.addEventListener('click', searchMovie);
});

// Event listener for search input enter key press
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('keyup', function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      searchMovie();
    }
  });
});