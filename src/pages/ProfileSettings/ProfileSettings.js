import React, { useEffect, useState } from "react";
import "./ProfileSettings.css";
import InputField from "../../components/inputfield/InputField";
import { KeycloakService } from "../../assets/service/keycloak_service"; // KeycloakService importieren
import Alert from "../../components/alert/Alert";
import { FaRegTrashAlt } from "react-icons/fa";
import ConfirmDeleteModal from "../../components/confirmDeleteModal/ConfirmDeleteModal";
import { useNavigate } from "react-router-dom";

/**
 * Functional component for Profile Settings page.
 * Manages state for name, email, editing status, alert messages, alert types,
 * delete modal visibility, and navigation.
 * @returns JSX element containing Profile Settings UI components.
 */
export default function ProfileSettings() {
  const [name, setName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [isEditing, setIsEditing] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");

  // Überprüfen, ob der Benutzer authentifiziert ist
  useEffect(() => {
    const fetchUserData = async () => {
      if (KeycloakService.isAuthenticated()) {
        const user = await KeycloakService.getUserProfile();
        setName(user.firstName + " " + user.lastName);
        setEmail(user.email);
        setUsername(user.username);
        setToken(KeycloakService.getToken());
      } else {
        navigate("/"); // Weiterleitung zur Startseite, falls nicht authentifiziert
      }
    };
    fetchUserData();
  }, [navigate]);

  const handleEdit = (field) => {
    setIsEditing(field);
  };

  const handleSave = () => {
    setIsEditing(null);
  };

  const handleKeyDown = async (event, field) => {
    if (event.key === "Enter") {
      try {
        if (field === "email") {
          // Email ändern
          await KeycloakService.updateEmail(email, token, newEmail);
          setEmail(newEmail);
          setAlertMessage("Email erfolgreich geändert.");
          setAlertType("success");
        }
        handleSave();
      } catch (error) {
        setAlertMessage(error.message || "Fehler beim Ändern der E-Mail Adresse");
        setAlertType("error");
      }
    }
  };

  const handleDeleteProfile = async () => {
    setAlertMessage("Du hast dein Profil erfolgreich gelöscht.");
    setAlertType("success");

    setTimeout(async () => {
      try {
        await KeycloakService.deleteUserProfile(token);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } catch (error) {
        setAlertMessage(error.message || "Fehler beim Löschen des Profils.");
        setAlertType("error");
      }
    }, 500);
  };

  return (
    <div className="profile-settings">
      <div>
        <h2>Profil Einstellungen</h2>
      </div>
      <div className="profile-settings-container">
        <div className="profileField">
          <label>Dein Name</label>
          <div>
            <InputField label={name} disabled={true} />
          </div>
        </div>
        <div className="profileField">
          <label>Dein Username</label>
          <div>
            <InputField label={username} disabled={true} />
          </div>
        </div>
        <div className="profileField">
          <label>Email Adresse</label>
          {isEditing === "email" ? (
            <InputField
              type="text"
              value={newEmail || email}
              onChange={(e) => setNewEmail(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, "email")}
            />
          ) : (
            <div>
              <InputField label={email} disabled={true} />
              <button onClick={() => handleEdit("email")}>ändern</button>
            </div>
          )}
        </div>
      </div>
      <div className="delete-profile-container">
        <button onClick={() => setShowDeleteModal(true)}>
          <div>
            <FaRegTrashAlt style={{ color: "#f04" }} />
          </div>

          <p>Profil löschen</p>
        </button>
      </div>

      <ConfirmDeleteModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteProfile}
      />

      <Alert message={alertMessage} type={alertType} />
    </div>
  );
}
