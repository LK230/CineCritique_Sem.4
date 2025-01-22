import React from "react";
import "./BackdropCard.css";

/**
 * Functional component for a backdrop card.
 * @param {string} img - The image source for the backdrop card.
 * @param {function} onClick - The function to be called when the card is clicked.
 * @returns JSX element representing the backdrop card.
 */
export default function BackdropCard({ img, onClick }) {
    return (
        <div className="BackdropCard-container" onClick={onClick}>
            <img src={img} alt=""/>
        </div>
    );
}