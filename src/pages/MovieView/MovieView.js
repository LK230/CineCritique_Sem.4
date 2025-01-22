import React, { useEffect, useRef, useState } from "react";
import { MovieService } from "../../assets/service/movie_service";
import { useParams, Link } from "react-router-dom";
import "./MovieView.css";
import FavoriteButton from "../../components/button/FavoriteButton";
import BackdropCard from "../../components/card/BackdropCard";
import LeftArrow from "../../assets/images/ButtonSVG.svg";
import RightArrow from "../../assets/images/ButtonSVGClose.svg";
import Tags from "../../components/tags/Tags";
import {
  SkeletonMovieCard,
  SkeletonTitle,
} from "../../components/skeletonLoader/SkeletonLoader";
import RatingView from "../../components/showRatingView/RatingView";
import UserService from "../../assets/service/user_service";
import Rated from "../../components/rated/Rated";
import RatingComponent from "../../components/ratingComponent/RatingComponent";
import RatingStars from "../../components/showRatingView/RatingStars";
import ReviewService from "../../assets/service/review_service";
import Alert from "../../components/alert/Alert";
import { KeycloakService } from "../../assets/service/keycloak_service";

/**
 * Functional component for displaying details of a movie.
 * Retrieves movie details based on the imdbId parameter.
 * Manages state for movie details, background image, favorite status, and alert messages.
 * Checks if the user is authenticated using KeycloakService.
 * @returns JSX element for displaying movie details.
 */
export default function MovieView() {
  const { imdbId } = useParams(); // Extract IMDb ID from URL parameters
  const [movie, setMovie] = useState({ backdrops: [] }); // Movie state with initial empty backdrops
  const scrollRef = useRef(null); // Reference to enable scrolling in backdrop carousel
  const [backgroundImage, setBackgroundImage] = useState(""); // State for selected background image
  const [isFavored, setIsFavored] = useState(false); // State to track if the movie is favorited
  const [alertMessage, setAlertMessage] = useState(""); // Alert message for user feedback
  const [alertType, setAlertType] = useState(""); // Type of alert (e.g., success, error)
  const isAuthenticated = KeycloakService.isAuthenticated(); // Check if the user is authenticated

  // Function to add a movie to user's favorites
  const getAddToFavorites = async () => {
    try {
      const response = await UserService.userAddToFavorite(imdbId); // Adds movie to favorites
      if (response === "Movie added to favorites successfully.") {
        setIsFavored(true); // Set favorited state if addition was successful
      }
    } catch (error) {
      console.error("Error adding to favorites:", error);
      throw error;
    }
  };

  // Function to remove a movie from user's favorites
  const getDeleteFromFavorites = async () => {
    try {
      const response = await UserService.userDeleteFromFavorite(imdbId); // Removes movie from favorites
      if (response === "Movie removed from favorites and user deleted." || response === "Movie removed from favorites successfully.") {
        setIsFavored(false); // Update favorited state if removal was successful
      }
    } catch (error) {
      console.error("Error deleting from favorites:", error);
      throw error;
    }
  };

  // Fetch user's favorite movies when component mounts or IMDb ID changes
  useEffect(() => {
    const fetchUserFavorites = async () => {
      if (isAuthenticated) {
        try {
          const userMe = await UserService.getUserMe(); // Get current user's token
          const userFavorites = await UserService.getFavorites(userMe); // Fetch user's favorite movies
          if (userFavorites.data.some((obj) => obj.imdbId === imdbId)) {
            setIsFavored(true); // Set favorited state if movie is in favorites
          } else {
            setIsFavored(false); // Unfavorited state if movie is not in favorites
          }
        } catch (error) {
          console.error("Error fetching user favorites:", error);
        }
      }
    };
    fetchUserFavorites();
  }, [imdbId, isAuthenticated]);

  // Fetch movie data when component mounts or IMDb ID changes
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const movieData = await new MovieService().getMovie(imdbId); // Fetch movie data
        setMovie(movieData);
        if (movieData.backdrops && movieData.backdrops.length > 0) {
          setBackgroundImage(movieData.backdrops[0]); // Set the initial background image
        }
      } catch (error) {
        console.error("Error fetching movie data:", error);
      }
    };
    if (imdbId) {
      fetchMovie();
    }
  }, [imdbId]);

  // Sets the selected background image
  const handleBackdropClick = (img) => {
    setBackgroundImage(img);
  };

  // Scrolls the backdrop carousel to the left
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  // Scrolls the backdrop carousel to the right
  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  // Handles adding or removing a movie from favorites based on current state
  const handleFavMovie = async () => {
    const userMe = await UserService.getUserMe();
    const userMeFavorites = await UserService.getFavorites(userMe);
    if (userMeFavorites.data.some((obj) => obj.imdbId === imdbId)) {
      getDeleteFromFavorites(); // Remove from favorites if already favorited
    } else {
      getAddToFavorites(); // Add to favorites if not already favorited
    }
  };

  // Deletes a review for the movie and updates the alert message
  const handleDeleteReview = async (imdbId) => {
    try {
      await ReviewService.deleteReview(imdbId);
      setAlertMessage("Review deleted successfully!");
      setAlertType("success");
    } catch (error) {
      setAlertMessage("Error deleting review!");
      setAlertType("error");
      console.log(error);
    }
  };

  return (
    <div
      className="MovieContainer"
      style={{
        backgroundImage: movie
          ? `linear-gradient(to bottom, rgb(6 15 23 / 33%), rgb(6 14 22 / 82%)), url(${backgroundImage})`
          : "none",
        width: "100%",
      }}>
      <div className="content-container">
        <div className="play-container">
          {movie ? <h1>{movie.title}</h1> : <SkeletonTitle />} {/* Display movie title */}
          <div className="right-side">
            <Rated age={movie.rated} />
            <a href={movie.trailerLink} target="_blank" rel="noopener noreferrer">
              <button className="play-icon">
                <p>Watch</p>
              </button>
            </a>
            {isAuthenticated && (
              <FavoriteButton onClick={handleFavMovie} isActive={isFavored} />
            )}
          </div>
        </div>

        {/* Movie rating and genres */}
        <div className="show-rate-content">
          <p>{movie.rating?.toFixed(1).replace(".", ",")}</p>
          <RatingStars rating={movie.rating} />
        </div>
        <div className="text-container">
          <hr />
          <div className="tags-container">
            {movie.genres?.map((genre) => (
              <Link key={genre} to={`/movies/genreview/${genre}`} className="link">
                <Tags name={genre} />
              </Link>
            ))}
          </div>

          {/* Backdrop carousel with scrolling controls */}
          <div className="img-view-container">
            {movie.backdrops?.length > 3 && (
              <button className="arrow arrow-left" onClick={scrollLeft}>
                <img src={LeftArrow} alt="" />
              </button>
            )}

            <div className="backdrop-container" ref={scrollRef}>
              {movie
                ? movie.backdrops?.map((img, index) => (
                    <BackdropCard
                      key={index}
                      img={img}
                      className="backdrop-card"
                      onClick={() => handleBackdropClick(img)}
                    />
                  ))
                : Array(5).fill(0).map((_, index) => (
                    <div key={index} className="backdrop-card">
                      <SkeletonMovieCard />
                    </div>
                  ))}
            </div>
            {movie.backdrops?.length > 3 && (
              <button className="arrow arrow-right" onClick={scrollRight}>
                <img src={RightArrow} alt="" />
              </button>
            )}
          </div>

          {/* Movie information: plot, director, cast, and release date */}
          <div className="info-content-container">
            <div className="plot">
              <p>{movie.plot}</p>
            </div>
            <div>
              <table>
                <tbody>
                  <tr>
                    <th><p>Directed by</p></th>
                    <td><p>{movie.director}</p></td>
                  </tr>
                  <tr>
                    <th><p>Cast</p></th>
                    <td>
                      <ul>
                        {movie.actors?.map((actor) => <li key={actor}>{actor}</li>)}
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <th><p>Released on</p></th>
                    <td>{new Date(movie.releaseDate).toLocaleDateString("de-DE", {
                      day: "2-digit", month: "long", year: "numeric"
                    })}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Review section with review components and alerts */}
      <div className="review-container">
        <div className="RaitingComponentContainer">
          {isAuthenticated && <RatingComponent imdbId={imdbId} />}
        </div>
        <div className="ReviewsContainer">
          <h2>Reviews by other users</h2>
          {movie.reviewIds?.length > 0 ? (
            movie.reviewIds?.map((review, index) => (
              <RatingView
                key={index}
                user={review.createdBy}
                comment={review.body}
                rating={review.rating}
                onClick={() => handleDeleteReview(review.imdbId)}
                loggedIn={isAuthenticated}
              />
            ))
          ) : (
            <h3>No reviews yet</h3>
          )}
        </div>
      </div>
      <Alert message={alertMessage} type={alertType} />
    </div>
  );
}

