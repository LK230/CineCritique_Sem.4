import {
  getBestRatedMoviesEndpoint,
  getGenreEndpoint,
  getGenreMoviesEndpoint,
  getMovieEndpoint,
  getMoviesEndpoint,
} from "./api_endpoints";

// Service class to interact with movie-related API endpoints
export class MovieService {
  
  // Retrieves a list of all movies
  async getMovies() {
    try {
      const movies = await getMoviesEndpoint(); // Calls the API endpoint for movies
      return movies;
    } catch (error) {
      console.error(error); // Logs any error encountered during the API call
    }
  }

  // Retrieves details of a single movie using its IMDb ID
  async getMovie(imdbId) {
    try {
      const movie = await getMovieEndpoint(imdbId); // Calls the API endpoint for a specific movie
      return movie;
    } catch (error) {
      console.error(error); // Logs any error encountered during the API call
    }
  }

  // Retrieves the best-rated movie
  async getBestRatedMovie() {
    try {
      const movie = await getBestRatedMoviesEndpoint(); // Calls the API endpoint for best-rated movie
      return movie;
    } catch (error) {
      console.error(error); // Logs any error encountered during the API call
    }
  }

  // Retrieves a list of available genres
  async getGenre() {
    try {
      const genre = await getGenreEndpoint(); // Calls the API endpoint for genres
      return genre;
    } catch (error) {
      console.error(error); // Logs any error encountered during the API call
    }
  }

  // Retrieves movies based on a specific genre
  async getGenreMovies(genre) {
    try {
      const genreMovies = await getGenreMoviesEndpoint(genre); // Calls the API endpoint for movies in a specific genre
      return genreMovies;
    } catch (error) {
      console.error(error); // Logs any error encountered during the API call
    }
  }
}

