
    async function fetchData() {
        try {
            let number = Math.floor(Math.random() * 999999) + 1; // Random number between 1 and 999999
            console.log(`ID: ${number}`);
            const response = await fetch(`https://api.themoviedb.org/3/movie/${number}?api_key=96628c0e6c6bba7100b21737333c56cf`); // Replace with your API endpoint
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json(); // Or .text(), .blob(), etc., depending on the API response type
            console.log(`Title: ${data.title}`);
            console.log(`Adult: ${data.adult}`);
            console.log(`Genres: ${data.genres.map(genre => genre.name).join(', ')}`); // Process the received data
            // Call a function to update the UI with this data
            if (data.adult === false) {
                updateUI(data);
            }
            else{
                fetchData(); // Retry fetching if the content is adult
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    fetchData(); // Call the function to initiate the request

        function updateUI(data) {
        const container = document.getElementById('data-container'); // An HTML element to display data
        const poster = document.getElementById('movie-poster'); // An HTML element to display the movie poster
        container.innerHTML = ''; // Clear previous content

            const element = document.createElement('h2');
            const plot = document.createElement('p');

            element.innerHTML = `<strong>${data.title}</strong> (${data.release_date})`; // Assuming 'title' is a property in your API data
            plot.innerHTML = `${data.overview}`; // Assuming 'overview' is a property in your API data
            container.appendChild(element);
            container.appendChild(plot);

            // Update the movie poster
            poster.src = data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : 'placeholder.jpg';
        }