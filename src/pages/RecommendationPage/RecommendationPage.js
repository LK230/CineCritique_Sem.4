import React, { useEffect, useState } from "react";
import Card from "../../components/card/Card";
import UserService from "../../assets/service/user_service";
import "./FavoritePage.css";

/**
 * Functional component for the FavoritePage.
 * This component fetches the user's favorite movies and displays them.
 * @returns JSX element displaying the user's favorite movies or a message if there are none.
 */
export default function RecommendationPage() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const userMe = await UserService.getUserMe();
        const recommendations = await UserService.getRecommendations(userMe);
        setMovies(recommendations.data);
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
        <h3>...Empfehlungen werden geladen</h3>
      )}
    </div>
  );
}