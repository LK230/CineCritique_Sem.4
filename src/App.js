import React, { useEffect, useState } from "react";
import Router from "./router/Router";
import { Helmet } from 'react-helmet';
import "./App.css";
import { KeycloakService } from "./assets/service/keycloak_service";


/**
 * Functional component representing the main App.
 * It renders a div with the class name "App" containing the Router component.
 * @returns JSX element representing the main App component.
 */
function App() {
  const [isKeycloakInitialized, setIsKeycloakInitialized] = useState(false);

  useEffect(() => {
    KeycloakService.initKeycloak(() => {
      setIsKeycloakInitialized(true); // Keycloak ist initialisiert
    });
  }, []);

  if (!isKeycloakInitialized) {
    // Ladeanzeige anzeigen, bis Keycloak initialisiert ist
    return <div>Lade...</div>;
  }

  return (
    <div className="App">
      <Helmet>
        <title>CineCritique</title>
      </Helmet>
      <Router/>
    </div>
  );
}

export default App;
