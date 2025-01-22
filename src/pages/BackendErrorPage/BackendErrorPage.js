import React from "react";
import "./BackendErrorPage.css";

const BackendErrorPage = () => {
  return (
    <div className="backend-error-container">
      <h1>Error</h1>
      <p>
        Bitte starte erst das Backend, damit die Daten geladen werden können.
      </p>
    </div>
  );
};

export default BackendErrorPage;
