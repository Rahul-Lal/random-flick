
const container = document.getElementById('data-container'); // An HTML element to display data
const poster = document.getElementById('movie-poster');
const element = document.createElement('h2');
const genreDateIMDB = document.createElement('p');
const plot = document.createElement('p');
const genreOfChoice = document.getElementById('genres');
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
    const selectedGenres = Array.from(
        document.querySelectorAll('#genres input[type="checkbox"]:checked')
    ).map(checkbox => parseInt(checkbox.value));

    const matchesGenre = selectedGenres.length === 0 ||
        data.genres.some(genre => selectedGenres.includes(genre.id));


    console.log(`Selected Genres: ${selectedGenres}`);
    console.log(`Matches Genre: ${matchesGenre}`);

    yearOfFilm = data.release_date ? data.release_date.split('-')[0] : "Unknown Year";
    const startYear = startingYear.value ? parseInt(startingYear.value) : 1920;
    const endYear = endingYear.value ? parseInt(endingYear.value) : new Date().getFullYear();

    // Call a function to update the UI with this data
    if (data.adult === false) {
        try {
            if (selectedGenres.includes(data.genres[0].id)) // If the selected genre matches the movie's genre
            {
                document.title = `Random Flick | ${data.title}`;
                selectYearsOfFilm();
            }
            else if (selectedGenres.length === 0) // If 'All Genres' is selected, show any genre
            {
                document.title = `Random Flick | ${data.title}`;
                selectYearsOfFilm();
            }
            else {
                loadingFunction();
                console.log("Genre does not match selected genre, fetching another movie.");
                fetchData(); // Retry fetching if the genre does not match
            }
        } catch (error) {
            console.error('Error updating UI:', error);
            fetchData(); // Retry fetching if there's an error updating the UI
        }
    }
    else {
        console.log("Adult content detected, fetching another movie.");
        loadingFunction();
        fetchData(); // Retry fetching if the content is adult
    }


    function selectYearsOfFilm() {
        if (yearOfFilm === "Unknown Year" && (yearOfFilm < startYear || yearOfFilm > endYear)) {
            console.log("Year does not match selected range, fetching another movie.");
            fetchData(); // Retry fetching if the year does not match
        }
        else {
            document.title = `Random Flick | ${data.title}`;
            filmSelectedviaConsole(data);
            updateUI(data);
        }
    }

    function countryOfFilmCheck() {
        countryOfFilm = data.production_countries && data.production_countries.length > 0
            ? data.production_countries[0].name
            : "Unknown Country";
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