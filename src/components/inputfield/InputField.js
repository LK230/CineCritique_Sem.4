import React from "react";
import "./InputField.css";

/**
 * Functional component for an input field.
 * @param {string} label - The label for the input field.
 * @param {string} value - The value of the input field.
 * @param {string} type - The type of input field (e.g., text, password).
 * @param {function} onChange - The function to handle onChange event.
 * @param {function} onKeyDown - The function to handle onKeyDown event.
 * @param {boolean} disabled - Indicates if the input field is disabled.
 * @returns JSX element representing an input field.
 */
export default function InputField({ label, value, type, onChange, onKeyDown, disabled }) {
  return (
    <div className="InputFieldContainer">
      <input
        type={type}
        placeholder={label}
        value={value}
        required
        onChange={onChange}
        onKeyDown={onKeyDown}
        disabled={disabled}
      >
        </input>
    </div>
  );
}
