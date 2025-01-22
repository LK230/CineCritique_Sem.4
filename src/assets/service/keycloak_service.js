import Keycloak from "keycloak-js";
import kc_params from "../api/keycloakConfig";
import keycloakAxiosInstance from "../api/keycloakAxios";

class KeycloakService {
  static keycloakInstance = null; // Singleton instance of Keycloak
  static isInitialized = false; // New state to track initialization status

  constructor() {
    // Check if Keycloak instance is already created; if not, initialize it with configuration
    if (!KeycloakService.keycloakInstance) {
      KeycloakService.keycloakInstance = new Keycloak({
        url: kc_params.URL,
        realm: kc_params.Realm,
        clientId: kc_params.Client,
      });
    }
    this.keycloak = KeycloakService.keycloakInstance;
  }

  // Initializes Keycloak only once and sets the callback upon successful authentication
  initKeycloak(onAuthenticatedCallback) {
    if (!KeycloakService.isInitialized) {
      this.keycloak
        .init({
          onLoad: "login-required", // Ensures login is required on load
          checkLoginIframe: false, // Disables iframe login check
        })
        .then((authenticated) => {
          KeycloakService.isInitialized = true; // Marks Keycloak as initialized
          if (authenticated) {
            onAuthenticatedCallback(); // Calls the callback function if authenticated
          } else {
            this.login(); // Redirects to login if not authenticated
          }
        })
        .catch((error) => {
          console.error("Failed to initialize Keycloak:", error);
        });
    }
  }

  // Retrieves the username of the authenticated user
  getUsername() {
    // Checks if the user is authenticated
    if (this.keycloak.authenticated) {
      return this.keycloak.tokenParsed?.preferred_username || "Unknown User";
    }
    return "User is not authenticated";
  }

  // Redirects to the Keycloak login page
  login() {
    this.keycloak.login();
  }

  // Logs the user out of Keycloak
  logout() {
    this.keycloak.logout();
  }

  // Checks if the user is currently authenticated
  isAuthenticated() {
    return this.keycloak.authenticated;
  }

  // Retrieves the current token (useful for API requests)
  getToken() {
    return this.keycloak.token;
  }

  // Refreshes the token if it's close to expiration and returns the updated token
  async updateToken(minValidity = 5) {
    try {
      await this.keycloak.updateToken(minValidity);
      return this.keycloak.token;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      this.login(); // Redirects to login if token refresh fails
    }
  }

  // Fetches the user profile details from Keycloak
  getUserProfile() {
    return this.keycloak.loadUserProfile();
  }

  // Updates the user's email address in Keycloak
  async updateEmail(oldEmail, token, newEmail) {
    try {
      const response = await keycloakAxiosInstance.put(
        "/users",
        {
          email: newEmail,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          params: {
            // Verifies email to ensure the correct user is being updated
            email: oldEmail,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating email:", error);
      throw error;
    }
  }

  // Deletes the user profile from Keycloak
  async deleteUserProfile(token) {
    try {
      const response = await keycloakAxiosInstance.delete("/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting user profile:", error);
      throw error;
    }
  }
}

// Exporting a singleton instance of KeycloakService
const keycloakService = new KeycloakService();
export { keycloakService as KeycloakService };
