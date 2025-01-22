import React from "react";
import "./ConfirmDeleteModal.css";

/**
 * Functional component for a confirmation modal to delete a profile.
 * @param {boolean} show - Flag to display or hide the modal.
 * @param {function} onClose - Function to close the modal.
 * @param {function} onConfirm - Function to confirm the deletion of the profile.
 * @returns {JSX.Element} A modal component to confirm profile deletion.
 */
export default function ConfirmDeleteModal({ show, onClose, onConfirm }) {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Bist du dir sicher, dass Du dein Profil löschen möchtest?</h2>
        <div className="modal-buttons">
          <button className="confirm-button" onClick={onConfirm}>
            Bestätigen
          </button>
          <button className="cancel-button" onClick={onClose}>
            Abbrechen
          </button>
        </div>
      </div>
    </div>
  );
}
