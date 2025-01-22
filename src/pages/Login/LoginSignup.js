import React, { useState, useEffect } from "react";
import "./LoginSignup.css";
import ButtonComponent from "../../components/buttonComponent/ButtonComponent";
import { useNavigate } from "react-router-dom";
import Alert from "../../components/alert/Alert";
import { KeycloakService } from "../../assets/service/keycloak_service.js";

/**
 * Functional component for the login/signup page.
 * Manages alert messages, loading state, and navigation.
 * @returns JSX element for the login/signup page.
 */
const LoginSignup = () => {
  const [alertMessage, setAlertMessage] = useState(""); // State for alert message to notify the user
  const [alertType, setAlertType] = useState(""); // State for alert type (e.g., success, error)
  const [isLoading, setIsLoading] = useState(true); // Loading state to manage component initialization
  const navigate = useNavigate(); // Navigation hook for redirecting users

  // Initialize Keycloak and handle authentication on component mount
  useEffect(() => {
    KeycloakService.initKeycloak(() => {
      if (KeycloakService.isAuthenticated()) {
        // If the user is authenticated, navigate directly to the homepage
        navigate("/");
      } else {
        // If not authenticated, redirect to Keycloak login page
        KeycloakService.login();
      }
      setIsLoading(false); // Set loading state to false once initialization completes
    });
  }, [navigate]); // Add `navigate` as a dependency

  // Function to handle user logout
  const handleLogout = () => {
    KeycloakService.logout(); // Log the user out via Keycloak
    setAlertMessage("You have successfully logged out."); // Set alert message for logout confirmation
    setAlertType("success"); // Set alert type to success
    navigate("/"); // Redirect to the homepage
  };

  // Render nothing while loading
  if (isLoading) {
    return null;
  }

  return (
    <div className="LoginContainer">
      <div className="content-wrapper">
        <div className="form-container">
          <div className="form-content">
            <h1 className="header">Welcome back!</h1> {/* Welcome message */}
            <div className="form-button">
              <ButtonComponent label="Logout" onClick={handleLogout} /> {/* Logout button */}
              <ButtonComponent label="Home" onClick={() => navigate("/")} /> {/* Button to navigate home */}
            </div>
          </div>
        </div>
      </div>
      <Alert message={alertMessage} type={alertType} /> {/* Display alert based on actions */}
    </div>
  );
};

export default LoginSignup;


