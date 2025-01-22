import React from "react";
import FSK0 from "../../assets/images/agelimit/FSK_0.svg.png";
import FSK6 from "../../assets/images/agelimit/FSK_6.svg.png";
import FSK12 from "../../assets/images/agelimit/FSK_12.svg.png";
import FSK16 from "../../assets/images/agelimit/FSK_16.svg.png";
import FSK18 from "../../assets/images/agelimit/FSK_18.svg.png";
import "./Rated.css";
/**
 * Component that displays an age rating based on the provided age.
 * @param {number} age - The age for which the rating is displayed.
 * @returns JSX element displaying the appropriate age rating image.
 */
export default function Rated({ age }) {
  switch (age) {
    case "0":
      return (
        <div className="RatedContainer">
          <img src={FSK0}></img>
        </div>
      );
      break;
    case "6":
      return (
        <div className="RatedContainer">
          <img src={FSK6}></img>
        </div>
      );
      break;
    case "12":
      return (
        <div className="RatedContainer">
          <img src={FSK12}></img>
        </div>
      );
      break;
    case "16":
      return (
        <div className="RatedContainer">
          <img src={FSK16}></img>
        </div>
      );
      break;
    case "18":
      return (
        <div className="RatedContainer">
          <img src={FSK18}></img>
        </div>
      );
      break;
    default:
      return "error";
  }
}
