import React from "react";
import Router from "./router/Router";
import { Helmet } from 'react-helmet';
import "./App.css";

/**
 * Functional component representing the main App.
 * It renders a div with the class name "App" containing the Router component.
 * @returns JSX element representing the main App component.
 */
function App() {
  return (
    <div className="App">
      <Helmet>
        <title>CineCritique</title>
      </Helmet>
      <Router />
    </div>
  );
}

export default App;
