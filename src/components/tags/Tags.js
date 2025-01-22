import React from "react";
import "./Tags.css";

/**
 * Functional component that displays a tag with the given name.
 * @param {string} name - The name of the tag to display.
 * @returns JSX element representing the tag.
 */
export default function Tags({ name }) {
  return (
    <div className="Tag-container">
      <p>{name}</p>
    </div>
  );
}
