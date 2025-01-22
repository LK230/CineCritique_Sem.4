/**
 * A functional React component that represents a button with an optional label and icon.
 * @param {string} label - The text to display on the button.
 * @param {function} onClick - The function to call when the button is clicked.
 * @param {boolean} disabled - A flag indicating if the button is disabled.
 * @returns A button component with the specified label, onClick function, and disabled state.
 */
import React from "react";
import ButtonSVGClose from "../../assets/images/ButtonSVGClose.svg";
import ButtonDisabled from "../../assets/images/ButtonDisabled.svg";

import "./ButtonComponent.css";

export default function ButtonComponent({ label, onClick, disabled }) {
  return (
    <div className="ButtonComponentContainer">
      <button onClick={onClick} disabled={disabled}>
        <div className="ButtonComponent">
          <p>{label}</p>
          {disabled ? (
            <img src={ButtonDisabled} alt="open-close Button" />
          ) : (
            <img src={ButtonSVGClose} alt="open-close Button" />
          )}
        </div>
      </button>
    </div>
  );
}
