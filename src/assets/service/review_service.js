import { deleteReviewEndpoint, getCreateReviewEndpoint } from "./api_endpoints";
import UserService from "../../assets/service/user_service";

// Service class for handling review-related operations
export class ReviewService {

  // Creates a new review for a movie
  async getCreateReview(reviewBody, rating, imdbId) {
    try {
      // Constructs the review object with provided details
      const review = {
        body: reviewBody,
        rating: rating,
        imdbId: imdbId
      }
      
      // Retrieves the current user information
      const userMe = await UserService.getUserMe();

      // Sends the review to the API endpoint for review creation
      const response = await getCreateReviewEndpoint(userMe, review);
      return response;
    } catch (error) {
      console.error(error); // Logs any error encountered during the API call
    }
  }

  // Deletes an existing review for a movie based on IMDb ID
  async deleteReview(imdbId) {
    try {
      // Retrieves the current user information
      const userMe = await UserService.getUserMe();

      // Calls the API endpoint to delete the review
      const review = await deleteReviewEndpoint(userMe, imdbId);
      return review;
    } catch (error) {
      console.error(error); // Logs any error encountered during the API call
    }
  }
}

// Exports a singleton instance of ReviewService for easy reuse
export default new ReviewService();
