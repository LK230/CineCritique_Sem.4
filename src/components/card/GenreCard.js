import React from "react";
import "./GenreCard.css";
import { Link } from "react-router-dom";

/**
 * Functional component for displaying a genre card.
 * @param {string} genre - The genre to display on the card.
 * @returns JSX element representing the genre card.
 */
export default function GenreCard({ genre }) {
  return (
   
      <Link to={`/movies/genreview/${genre}`} className="link">
         <div className="GenreCard">
        <div className="title-container">
          <p>{genre}</p>
        </div>
        </div>
      </Link>
    
  );
}
