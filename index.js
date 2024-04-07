
// Your code here
document.addEventListener("DOMContentLoaded", () => {
    const baseUrl = "http://localhost:3000";
  
    // Function to fetch details of the first movie
    function fetchFirstMovieDetails() {
      fetch(`${baseUrl}/1`)
        .then(response => response.json())
        .then(movieData => {
          // Calculate the number of available tickets
          const availableTickets = movieData.capacity - movieData.tickets_sold;
  
          // Populate movie details on the page
          populateMovieDetails(movieData, availableTickets);
        })
        .catch(error => console.error("Error fetching movie details:", error));
    }
  
    // Function to populate movie details on the page
    function populateMovieDetails(movieData, availableTickets) {
      // Populate poster, title, runtime, showtime, and available tickets
      const moviePoster = document.getElementById("movie-poster");
      const movieTitle = document.getElementById("movie-title");
      const movieRuntime = document.getElementById("movie-runtime");
      const movieShowtime = document.getElementById("movie-showtime");
      const movieTickets = document.getElementById("movie-tickets");
  
      moviePoster.src = movieData.poster;
      movieTitle.textContent = movieData.title;
      movieRuntime.textContent = `Runtime: ${movieData.runtime} minutes`;
      movieShowtime.textContent = `Showtime: ${movieData.showtime}`;
      movieTickets.textContent = `Available Tickets: ${availableTickets}`;
    }
  
    // Function to fetch all movies and populate movie menu
    function fetchAllMovies() {
      fetch(`$films}`)
        .then(response => response.json())
        .then(movies => {
          // Populate movie menu
          const movieMenu = document.getElementById("films");
          movies.forEach(movie => {
            const movieItem = document.createElement("li");
            movieItem.textContent = movie.title;
            movieItem.classList.add("film-item");
            movieMenu.appendChild(movieItem);
          });
  
          // Add event listener to movie menu items
          movieMenu.addEventListener("click", event => {
            const selectedMovieTitle = event.target.textContent;
            fetchAndDisplayMovieDetails(selectedMovieTitle);
          });
        })
        .catch(error => console.error("Error fetching movies:", error));
    }
  
    // Function to fetch details of the selected movie and display on page
    function fetchAndDisplayMovieDetails(title) {
      fetch(`${films}?title=${title}`)
        .then(response => response.json())
        .then(movies => {
          if (movies.length > 0) {
            const selectedMovie = movies[0];
            const availableTickets = selectedMovie.capacity - selectedMovie.tickets_sold;
            populateMovieDetails(selectedMovie, availableTickets);
          } else {
            console.error("Movie not found");
          }
        })
        .catch(error => console.error("Error fetching movie details:", error));
    }
  
    // Function to handle buying ticket for a movie
    function buyTicket() {
      // Add event listener to Buy Ticket button
      const buyTicketButton = document.getElementById("buy-ticket");
      buyTicketButton.addEventListener("click", () => {
        // Check if tickets are available
        const availableTickets = parseInt(document.getElementById("movie-tickets").textContent.split(": ")[1]);
        if (availableTickets > 0) {
          const movieId = 1; // Assuming movie ID is 1 for the first movie
          // Update tickets sold on the server
          fetch(`${baseUrl}/films/${movieId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ tickets_sold: availableTickets - 1 })
          })
            .then(response => {
              if (!response.ok) {
                throw new Error("Failed to update tickets sold");
              }
              // Add new ticket to tickets endpoint
              fetch(`${baseUrl}/tickets`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({ film_id: movieId, num_of_tickets: 1 })
              })
                .then(() => {
                  // Update available tickets on the page
                  document.getElementById("movie-tickets").textContent = `Available Tickets: ${availableTickets - 1}`;
                })
                .catch(error => console.error("Error adding new ticket:", error));
            })
            .catch(error => console.error("Error updating tickets sold:", error));
        } else {
          console.log("Tickets sold out");
        }
      });
    }
  
    // Function to delete a movie
    function deleteMovie(movieId) {
      fetch(`${baseUrl}/films/${movieId}`, {
        method: "DELETE"
      })
        .then(resp => {
          if (!resp.ok) {
            throw new Error("Failed to delete movie");
          }
          // Remove movie from the movie menu
          const movieTitle = document.querySelector(`li.film-item[data-id="${movieId}"]`);
          if (movieTitle) {
            movieTitle.remove();
          }
        })
        .catch(error => console.error("Error deleting movie:", error));
    }
  
    // Fetch first movie details and populate on page
    fetchFirstMovieDetails();
  
    // Fetch all movies and populate movie menu
    fetchAllMovies();
  
    // Buy ticket for a movie
    buyTicket();
  });