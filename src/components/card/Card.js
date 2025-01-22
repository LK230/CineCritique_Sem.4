import React from "react";
import "./Card.css";
import { Link } from "react-router-dom";

/**
 * Functional component for rendering a card with movie information.
 * @param {string} poster - The URL of the movie poster image.
 * @param {string} title - The title of the movie.
 * @param {number} id - The unique identifier of the movie.
 * @returns JSX element representing a card with movie information.
 */
export default function Card({ poster, title, id }) {
  return (
    <div className="Card">
      <Link to={`/movies/${id}`} className="link">
        <div>
          <img src={poster} alt="Movie Poster"></img>
          <hr />
        </div>
        <div className="title-container">
          <p>{title}</p>
        </div>
      </Link>
    </div>
  );
}
