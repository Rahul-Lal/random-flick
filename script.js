
const container = document.getElementById('data-container'); // An HTML element to display data
const poster = document.getElementById('movie-poster');
const element = document.createElement('h2');
const genreReleaseDateIMDB = document.createElement('p');
const plot = document.createElement('p');

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
        console.log(`Title: ${data.title};\nGenres: ${data.genres[0].name};\nimdb_id: ${data.imdb_id};\nCountry: ${data.production_countries[0].name};\nRelease Date: ${data.release_date};\nAdult: ${data.adult};\n--- END OF LINE ---\n \n`);
        updateUI(data);
    }
    catch (error) {
        console.error('Error starting page:', error);
    }
}

async function fetchData() {
    let number = Math.floor(Math.random() * 1000000) + 1; // Random number between 1 and 10000
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

    if (data.genres.length !== 0) {
        if(data.production_countries.length !== 0){
        console.log(`Title: ${data.title};
            \nGenres: ${data.genres[0].name};
            \nimdb_id: ${data.imdb_id};
            \nCountry: ${data.production_countries[0].name};
            \nRelease Date: ${data.release_date};
            \nAdult: ${data.adult};
            \n--- END OF LINE ---\n \n`);
        }
        else {
            fetchData();
        }
    }
    else {
        fetchData();
    }

    // Call a function to update the UI with this data
    if (data.adult === false) {
        if (
            (data.production_countries[0].name === "United States of America")
            || (data.production_countries[0].name === "United Kingdom")
            || (data.production_countries[0].name === "New Zealand")) {
            updateUI(data);
            // Do something specific for movies from the US, UK or New Zealand
        }
        else {
            fetchData(); // Retry fetching if the movie is not from the US, UK or New Zealand
        }
    }
    else {
        fetchData(); // Retry fetching if the content is adult
    }
}

function updateUI(data) {// An HTML element to display the movie poster
    container.innerHTML = ''; // Clear previous content
    element.innerHTML = `<strong>${data.title}</strong>`;
    plot.innerHTML = `${data.overview}`;
    genreReleaseDateIMDB.innerHTML = `${data.genres[0].name} | ${data.release_date} | <a href="https://www.imdb.com/title/${data.imdb_id}" target="_blank">IMDB</a>`;

    container.appendChild(element);
    container.appendChild(genreReleaseDateIMDB);
    container.appendChild(plot);

    // Update the movie poster
    poster.src = data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : 'placeholder.jpg';
}


// function choseGenre() {
//     const genreType = document.getElementById('genres');
//     const selectedGenre = genreType.value;

//     // You can now use the selectedGenre variable to filter or fetch data based on the chosen genre
//     console.log(`Selected genre: ${selectedGenre}`);


//     if (genreType === 0) {
//         try {
//             fetchData();
//         }
//         catch (error) {
//             console.error('Error fetching data:', error);
//             fetchData(); // Retry fetching if the movie is not found
//         }
//     }
//     else if (data.genres[0].id == genreType) { }
//     else { }
// }
