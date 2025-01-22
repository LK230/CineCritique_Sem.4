import api from "../api/axiosConfig";

// Retrieves a list of all available movies.
export async function getMoviesEndpoint() {
  try {
    const response = await api.get("/movies/paginated");
    return response.data;
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw error.response.data;
  }
}

// Fetches details of a specific movie by its IMDb ID.
export async function getMovieEndpoint(imdbId) {
  try {
    const response = await api.get("/movies/" + imdbId);
    return response.data;
  } catch (error) {
    console.error("Error fetching movie:", error);
    throw error.response.data;
  }
}

// Retrieves a list of the best-rated movies.
export async function getBestRatedMoviesEndpoint() {
  try {
    const response = await api.get("/movies/bestrated/paginated");
    return response.data;
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw error.response.data;
  }
}

// Fetches a list of available movie genres.
export async function getGenreEndpoint() {
  try {
    const response = await api.get("/movies/genre");
    return response.data;
  } catch (error) {
    console.error("Error fetching genre:", error);
    throw error.response.data;
  }
}

// Fetches movies that belong to a specific genre.
export async function getGenreMoviesEndpoint(genre) {
  try {
    const response = await api.get("/movies/genre/" + genre);
    return response.data;
  } catch (error) {
    console.error("Error fetching movie:", error);
    throw error.response.data;
  }
}

// Gets favorites list of a user
export async function getFavoritesEndpoint(token) {
  try {
    const favorites = await api.get("/users/favorites/all", {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return favorites;
  } catch (error) {
    console.error("Error loading favorites:", error);
    throw error.response.data;
  }
}

// Gets recommendations list of a user
export async function getRecommendationsEndpoint(token) {
  try {
    const recommendations = await api.get("/ai/recommendation", {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return recommendations;
  } catch (error) {
    console.error("Error loading favorites:", error);
    throw error.response.data;
  }
}

// Gets recommendations list of a user
export async function getRatedMoviesEndpoint(token) {
  try {
    const ratedMovies = await api.get("/users/rated-movies", {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return ratedMovies;
  } catch (error) {
    console.error("Error loading rated movies:", error);
    throw error.response.data;
  }
}

// Adds a movie to the user's list of favorites.
export async function getAddFavoritesEndpoint(token, imdbId) {
  try {
    const response = await api.post(
      `/users/favorites/add?imdbId=${imdbId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
      }
  });
    return response.data;
  } catch (error) {
    console.error("Error adding to favorites:", error);
    throw error.response.data;
  }
}

// Removes a movie from the user's list of favorites.
export async function getDeleteFromFavoritesEndpoint(token, imdbId) {
  try {
    const response = await api.delete(
      `/users/favorites/remove?imdbId=${imdbId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
      }
    });
    console.log(response)
    return response.data;
  } catch (error) {
    console.error("Error deleting from favorites:", error);
    throw error.response.data;
  }
}

// Creates a new review for a movie.
export async function getCreateReviewEndpoint(userMe, review) {
  try {
    console.log(review);
    const response = await api.post(
      "/reviews/create", review, {
        headers: {
          Authorization: `Bearer ${userMe}`,
        }
      });
    console.log(response)
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error.response.data;
  }
}

// Deletes a user's review of a movie by username and IMDb ID.
export async function deleteReviewEndpoint(userMe, imdbId) {
  try {
    const response = await api.delete(
      `/reviews/remove?imdbId=${imdbId}`,{
        headers: {
          Authorization: `Bearer ${userMe}`,
        }
      });
    return response.data;
  } catch (error) {
    console.error("Error fetching movie:", error);
    throw error.response.data;
  }
}
