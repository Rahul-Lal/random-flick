
async function fetchData() {
    try {
        let number = Math.floor(Math.random() * 7500) + 1; // Random number between 1 and 5000
        console.log(`ID: ${number}`);

        const response = await fetch(`https://api.themoviedb.org/3/movie/${number}?api_key=96628c0e6c6bba7100b21737333c56cf`); // Replace with your API endpoint
        if (response.status === 404) {
            console.error('Movie not found');
        }
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(`Title: ${data.title}`);
        console.log(`Adult: ${data.adult}`);
        console.log(`Genres: ${data.genres.map(genre => genre.name).join(', ')}`);
        // Call a function to update the UI with this data
        if (data.adult === false) {
            updateUI(data);
        }
        else {
            fetchData(); // Retry fetching if the content is adult
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        fetchData(); // Retry fetching if the movie is not found
    }
}

fetchData();

function updateUI(data) {
    const container = document.getElementById('data-container'); // An HTML element to display data
    const poster = document.getElementById('movie-poster'); // An HTML element to display the movie poster
    container.innerHTML = ''; // Clear previous content

    const element = document.createElement('h2');
    const genreAndReleaseDate = document.createElement('p');
    const plot = document.createElement('p');

    element.innerHTML = `<strong>${data.title}</strong>`; 
    plot.innerHTML = `${data.overview}`;
    genreAndReleaseDate.innerHTML = `${data.genres.map(g => g.name).join(', ')} | ${data.release_date}`;
    
    container.appendChild(element);
    container.appendChild(genreAndReleaseDate);
    container.appendChild(plot);

    // Update the movie poster
    poster.src = data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : 'placeholder.jpg';
}
