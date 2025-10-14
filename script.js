
const container = document.getElementById('data-container'); // An HTML element to display data
const poster = document.getElementById('movie-poster');
const element = document.createElement('h2');
const genreDateIMDB = document.createElement('p');
const plot = document.createElement('p');
const genreOfChoice = document.getElementById('genres');
const genres = [28, 12, 16, 35, 80, 99, 18, 10751, 14, 36, 27, 10402, 9648, 10749, 878, 10770, 53, 10752, 37];


let countryOfFilm = "Unknown Country";
let genreOfFilm = "Unknown Genre";
let yearOfFilm = "Unknown Year";

/*
    Start by fetching data for a specific movie 'Spider-Man' (ID: 557) to ensure the page loads with content - then allow random fetches
*/
startPage();

async function startPage() {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/557?api_key=96628c0e6c6bba7100b21737333c56cf`); // Replace with your API endpoint

        if (response.status === 404) {
            console.error('Movie not found');
        }
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(`Title: ${data.title};\nGenres: ${data.genres[0].name};\nimdb_id: ${data.imdb_id};\nCountry: ${data.production_countries[0].name};\nRelease Date: ${data.release_date};\n \nAdult: ${data.adult};\n \n--- END OF LINE ---\n \n`);
        updateUI(data);
    }
    catch (error) {
        console.error('Error starting page:', error);
    }
}

async function fetchData() {
    let number = Math.floor(Math.random() * 1000000) + 1; // Random number between 1 and 1 million
    console.log(`ID: ${number}`);

    const response = await fetch(`https://api.themoviedb.org/3/movie/${number}?api_key=96628c0e6c6bba7100b21737333c56cf`); // Replace with your API endpoint

    if (response.ok === false) {
        fetchData();
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    if (response.status === 404) {
        console.error('Movie not found');
        alert("Movie Not Found. Please Try Again");
        fetchData();
    }

    const data = await response.json();
    const selectedGenre = parseInt(genreOfChoice.value);
    const matchesGenre = data.genres.some(genre => genre.id === selectedGenre);
    console.log(`Matches Selected Genre: ${matchesGenre}`);

    // Call a function to update the UI with this data
    if (data.adult === false) {
        try {
            if (selectedGenre === data.genres[0].id) // If the selected genre matches the movie's genre
            {
                console.log(`Title: ${data.title};\nGenres: ${data.genres[0].name};\nimdb_id: ${data.imdb_id};\nCountry: ${data.production_countries[0].name};\nRelease Date: ${data.release_date};\nVote Average: ${data.vote_average};\n \nAdult: ${data.adult};\n \n--- END OF LINE ---\n \n`);
                updateUI(data);
            }
            else if (selectedGenre === 0) // If 'All Genres' is selected, show any genre
            {
                console.log(`Title: ${data.title};\nGenres: ${data.genres[0].name};\nimdb_id: ${data.imdb_id};\nCountry: ${data.production_countries[0].name};\nRelease Date: ${data.release_date};\nVote Average: ${data.vote_average};\n \nAdult: ${data.adult};\n \n--- END OF LINE ---\n \n`);
                updateUI(data);

            }
            else {
                console.log("Genre does not match selected genre, fetching another movie.");

                container.innerHTML = ''; // Clear previous content
                element.innerHTML = `<strong>Searching Film</strong>`;
                plot.innerHTML = "Be with you in a moment...";
                genreDateIMDB.innerHTML = `A <strong>${genreOfChoice.options[genreOfChoice.selectedIndex].text}</strong> movie is coming right up!`;
                poster.src = 'Loading.gif';


                container.appendChild(element);
                container.appendChild(plot);
                container.appendChild(genreDateIMDB);

                fetchData(); // Retry fetching if the genre does not match
            }
        } catch (error) {
            console.error('Error updating UI:', error);
            fetchData(); // Retry fetching if there's an error updating the UI
        }
    }
    else {
        console.log("Adult content detected, fetching another movie.");
        fetchData(); // Retry fetching if the content is adult
    }

}

function updateUI(data) {
    // An HTML element to display the movie poster
    container.innerHTML = ''; // Clear previous content
    element.innerHTML = `<strong>${data.title}</strong>`;
    plot.innerHTML = data.overview ? `${data.overview}` : "I Dunno! No Plot Found.";
    countryOfFilm = data.production_countries && data.production_countries.length > 0
        ? data.production_countries[0].name
        : "Unknown Country";
    genreOfFilm = data.genres && data.genres.length > 0
        ? data.genres[0].name
        : "Unknown Genre";
    yearOfFilm = data.release_date ? data.release_date.split('-')[0] : "Unknown Year";

    genreDateIMDB.innerHTML = `${genreOfFilm} | ${yearOfFilm} | ${countryOfFilm} | <a href="https://www.imdb.com/title/${data.imdb_id}" target="_blank">IMDB</a>`;

    container.appendChild(element);
    container.appendChild(genreDateIMDB);
    container.appendChild(plot);

    // Update the movie poster
    poster.src = data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : 'NoPosterAvailable.png';
}
/*
    function genreSelected(){
    }
*/