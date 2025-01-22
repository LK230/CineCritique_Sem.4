import React, { useEffect, useState } from "react";
import Card from "../../components/card/Card";
import UserService from "../../assets/service/user_service";
import { MovieService } from "../../assets/service/movie_service";
import "./RatingsPage.css";

/**
 * Functional component for the RatingsPage.
 * This component fetches the user's favorite movies and displays them.
 * @returns JSX element displaying the user's favorite movies or a message if there are none.
 */
export default function RatingsPage() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const userMe = await UserService.getUserMe();
        const ratedMovies = await UserService.getRatedMovies(userMe);

        // Erstelle eine Instanz von MovieService
        const movieService = new MovieService();

          // Alle Filme parallel abfragen
        const moviesData = await Promise.all(
          ratedMovies.data.map(imdbId => movieService.getMovie(imdbId))
        );
        
        // Filme in der neuen Liste speichern
        setMovies(moviesData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="FavoritePage">
      {movies.length > 0 ? (
        movies.map((movie) => (
          <Card
            key={movie.imdbId}
            id={movie.imdbId}
            poster={movie.poster}
            title={movie.title}
          />
        ))
      ) : (
        <h3>...bisher hast du noch keine Reviews geschrieben</h3>
      )}
    </div>
  );
}
