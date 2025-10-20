
const container = document.getElementById('data-container'); // An HTML element to display data
const poster = document.getElementById('movie-poster');
const element = document.createElement('h2');
const genreDateIMDB = document.createElement('p');
const plot = document.createElement('p');
const genres = [28, 12, 16, 35, 80, 99, 18, 10751, 14, 36, 27, 10402, 9648, 10749, 878, 10770, 53, 10752, 37];
const startingYear = document.getElementById('startingYear');
const endingYear = document.getElementById('endingYear');


let countryOfFilm = "Unknown Country";
let genreOfFilm = "Unknown Genre";
let yearOfFilm = "Unknown Year";

/*
    Start by fetching data for a specific movie 'Spider-Man' (ID: 557) to ensure the page loads with content - then allow random fetches
*/

// Refresh the page every 2.5 seconds (2500 milliseconds)
// setInterval(function () {
//     window.location.reload();
// }, 2500);

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
    loadingFunction();

    document.querySelectorAll("input").forEach(input => input.style.visibility = "hidden");
    // Collect filter inputs
    const selectedGenres = Array.from(document.querySelectorAll('#genres input[type="checkbox"]:checked')).map(checkbox => parseInt(checkbox.value));

    const startYear = parseInt(startingYear.value) || 1920;
    const endYear = parseInt(endingYear.value) || new Date().getFullYear();

    // If you have a country dropdown (optional)
    const selectedCountries = Array.from(document.querySelectorAll('#countries input[type="checkbox"]:checked')).map(checkbox => checkbox.value);

    // ✅ TMDB supports multiple origin countries (production countries)
    let countryParam = selectedCountries.length > 0
        ? `&with_origin_country=${selectedCountries.join(',')}`
        : '';


    // Build base query parameters
    let genreParam = selectedGenres.length ? `&with_genres=${selectedGenres.join(',')}` : '';
    let yearParam = `&primary_release_date.gte=${startYear}-01-01&primary_release_date.lte=${endYear}-12-31`;

    // Synthetic randomness: if no filters chosen, randomize one or two for flavor
    if (selectedGenres.length === 0 && !startingYear.value && !endingYear.value && selectedCountries.length === 0) {
        const randomGenre = genres[Math.floor(Math.random() * genres.length)];
        const randomYear = Math.floor(Math.random() * (2024 - 1950 + 1)) + 1950;
        genreParam = `&with_genres=${randomGenre}`;
        yearParam = `&primary_release_year=${randomYear}`;
        console.log(`Synthetic Randomized Filters → Genre: ${randomGenre}, Year: ${randomYear}`);
    }

    // Random page number within TMDB’s 500-page cap
    const randomPage = Math.floor(Math.random() * 500) + 1;

    console.log(`Fetching Discover Page: ${randomPage}`);

    try {
        // Fetch random results using Discover API
        const discoverUrl = `https://api.themoviedb.org/3/discover/movie?api_key=96628c0e6c6bba7100b21737333c56cf&page=${randomPage}${genreParam}${yearParam}${countryParam}`;
        const response = await fetch(discoverUrl);

        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            return fetchData();
        }

        const data = await response.json();

        if (!data.results?.length) {
            console.warn("No movies found on this page, retrying...");
            return fetchData();
        }

        // Randomly pick one movie from the page
        const randomMovie = data.results[Math.floor(Math.random() * data.results.length)];

        // Fetch full movie details for richer info
        const detailsResponse = await fetch(
            `https://api.themoviedb.org/3/movie/${randomMovie.id}?api_key=96628c0e6c6bba7100b21737333c56cf`
        );
        const fullData = await detailsResponse.json();

        // Update UI
        document.title = `${fullData.title} | Random Flick`;
        filmSelectedviaConsole(fullData);
        updateUI(fullData);

    } catch (error) {
        console.error("Error fetching movie:", error);
        fetchData();
    }
}

function updateUI(data) {
    container.innerHTML = ''; // Clear previous content

    // Title and overview
    element.innerHTML = `<strong>${data.title}</strong>`;
    plot.innerHTML = data.overview || "I Dunno! No Plot Found.";

    // Fallbacks
    countryOfFilm = data.production_countries?.[0]?.name || "Unknown Country";
    genreOfFilm = data.genres?.[0]?.name || "Unknown Genre";
    yearOfFilm = data.release_date ? data.release_date.split('-')[0] : "Unknown Year";

    // Details line
    genreDateIMDB.innerHTML = `${genreOfFilm} | ${yearOfFilm} | ${countryOfFilm} | <a href="https://www.imdb.com/title/${data.imdb_id}" target="_blank">IMDB</a>`;

    // Append elements
    container.appendChild(element);
    container.appendChild(genreDateIMDB);
    container.appendChild(plot);

    // Poster handling
    poster.src = data.poster_path
        ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
        : 'NoPosterAvailable.png';


    document.querySelectorAll("input").forEach(input => input.style.visibility = "visible");
}

function filmSelectedviaConsole(data) {
    console.log(`Title: ${data.title};\nGenres: ${data.genres[0].name};\nimdb_id: ${data.imdb_id};\nCountry: ${data.production_countries[0].name};\nRelease Date: ${data.release_date};\nVote Average: ${data.vote_average};\n \nAdult: ${data.adult};\n \n--- END OF LINE ---\n \n`);
}

function loadingFunction() {
    container.innerHTML = ''; // Clear previous content
    element.innerHTML = `<strong>Searching Film</strong>`;
    plot.innerHTML = "Be with you in a moment...";

    genreDateIMDB.innerHTML = `--- LOADING ---`;


    container.appendChild(element);
    container.appendChild(plot);
    container.appendChild(genreDateIMDB);

    poster.src = 'Loading.gif';
}