import {
  getAddFavoritesEndpoint,
  getDeleteFromFavoritesEndpoint,
  getFavoritesEndpoint,
  getRecommendationsEndpoint,
  getRatedMoviesEndpoint,
} from "./api_endpoints";
import { KeycloakService } from "./keycloak_service";

// Service class to manage user-related actions, such as retrieving the user's favorites or updating them
export class UserService {

  // Retrieves the user's authentication token from Keycloak
  async getUserMe() {
    try {
      const token = await KeycloakService.getToken(); // Gets the Keycloak token for the current user
      return token;
    } catch (error) {
      console.error("Error getting UserMe:", error); // Logs an error if token retrieval fails
      throw error;
    }
  }

  // Fetches the user's list of favorite movies using their token
  async getFavorites(token) {
    try {
      const favorites = await getFavoritesEndpoint(token); // Calls API to get favorite movies list
      return favorites;
    } catch (error) {
      console.error("Error getting favorites:", error); // Logs an error if fetching favorites fails
      throw error;
    }
  }

    // Fetches the user's list of recommendation movies using their token
    async getRecommendations(token) {
      try {
        const recommendations = await getRecommendationsEndpoint(token); // Calls API to get favorite movies list
        return recommendations;
      } catch (error) {
        console.error("Error getting recommendations:", error); // Logs an error if fetching favorites fails
        throw error;
      }
    }

    // Fetches the user's list of rated movies using their token
    async getRatedMovies(token) {
      try {
        const ratedMovies = await getRatedMoviesEndpoint(token); // Calls API to get favorite movies list
        return ratedMovies;
      } catch (error) {
        console.error("Error getting rated movies:", error); // Logs an error if fetching favorites fails
        throw error;
      }
    }

  // Adds a movie to the user's favorites based on IMDb ID
  async userAddToFavorite(imdbId) {
    try {
      const userMe = await this.getUserMe(); // Retrieves user token for authentication
      const addFav = await getAddFavoritesEndpoint(userMe, imdbId); // Calls API to add movie to favorites
      return addFav;
    } catch (error) {
      console.error(error); // Logs any error encountered during the API call
      throw error;
    }
  }

  // Removes a movie from the user's favorites based on IMDb ID
  async userDeleteFromFavorite(imdbId) {
    try {
      const userMe = await this.getUserMe(); // Retrieves user token for authentication
      const deleteFav = await getDeleteFromFavoritesEndpoint(userMe, imdbId); // Calls API to remove movie from favorites
      return deleteFav;
    } catch (error) {
      console.error(error); // Logs any error encountered during the API call
      throw error;
    }
  }
}

// Exports a singleton instance of UserService for easy reuse
export default new UserService();
