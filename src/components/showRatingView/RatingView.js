import React from "react";
import RatingStars from "./RatingStars";
import { FaRegTrashAlt } from "react-icons/fa";
import "./RatingView.css";

/**
 * Functional component that displays a rating view with user information, comment, rating stars,
 * and a delete button if the user is logged in.
 * @param {object} user - The user object containing user information.
 * @param {string} comment - The comment associated with the rating.
 * @param {number} rating - The rating value.
 * @param {function} onClick - The function to handle the click event on the delete button.
 * @param {boolean} loggedIn - A flag indicating if the user is logged in.
 * @returns JSX element representing the rating view.
 */
export default function RatingView({
  user,
  comment,
  rating,
  onClick,
  loggedIn,
}) {
  return (
    <div className="RatingView">
      <div className="top-container">
        <div className="user-container">
          <p>{user}</p>
        </div>
        <div className="rating-container">
          <div>
            <RatingStars rating={rating} />
          </div>
        </div>
      </div>
      <div className="comment-container">
        <p>{comment}</p>
      </div>
      {loggedIn && (
        <div className="trash-container">
          <button onClick={onClick}>
            <FaRegTrashAlt />
          </button>
        </div>
      )}
    </div>
  );
}
