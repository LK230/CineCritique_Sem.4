import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "../pages/Home/Home";
import Genres from "../pages/Genres/Genres";
import MovieView from "../pages/MovieView/MovieView";
import Sidebar from "../components/sidebar/Sidebar";
import Login from "../pages/Login/LoginSignup";
import ProfileSettings from "../pages/ProfileSettings/ProfileSettings";
import FavoritePage from "../pages/FavoritePage/FavoritePage";
import RecommendationPage from "../pages/RecommendationPage/RecommendationPage";
import RatingsPage from "../pages/RatingsPage/RatingsPage";
import { GenreView } from "../pages/Genres/GenreView";
import Header from "../components/header/Header";
import checkBackend from "../assets/service/backendCheck";
import BackendErrorPage from "../pages/BackendErrorPage/BackendErrorPage";

/**
 * Functional component for the Router of the application.
 * Manages the state of various components based on window width and location path.
 * @returns JSX element representing the Router component.
 */
export default function Router() {
  const [backendAvailable, setBackendAvailable] = useState(true);
  const shouldBeOpen = () => window.innerWidth > 1100;
  const [showSmallSidebar, setShowSmallSidebar] = useState(shouldBeOpen);
  const [showSidebar, setShowSidebar] = useState(window.innerWidth > 900);
  const [showHeader, setShowHeader] = useState(window.innerWidth <= 900);
  const path = useLocation();

  const contentStyle = {
    marginLeft: showHeader ? "0" : showSmallSidebar ? "260px" : "90px",
    transition: "margin 0.2s ease",
    borderRadius: "30px",
    paddingTop: showHeader ? "50px" : "0",
  };

  useEffect(() => {
    const verifyBackend = async () => {
      const isAvailable = await checkBackend();
      setBackendAvailable(isAvailable);
    };

    verifyBackend();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setShowSmallSidebar(shouldBeOpen());
      setShowHeader(window.innerWidth <= 900);
      if (window.innerWidth <= 900) {
        setShowSidebar(false);
      } else {
        setShowSidebar(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isLoginPage = path.pathname === "/login";

  if (!backendAvailable) {
    return <BackendErrorPage />;
  }

  return (
    <div>
      {!isLoginPage && showSidebar && (
        <Sidebar
          showSidebar={showSmallSidebar}
          setShowSidebar={setShowSmallSidebar}
        />
      )}
      {!isLoginPage && showHeader && !showSidebar && <Header />}

      <main style={isLoginPage ? {} : contentStyle}>
        <Routes>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/" element={<Home />}></Route>
          <Route path="/genres" element={<Genres />}></Route>
          <Route
            path="/movies/genreview/:genre"
            element={<GenreView />}></Route>
          <Route path="/movies/:imdbId" element={<MovieView />}></Route>
          <Route path="/profile" element={<ProfileSettings />}></Route>
          <Route path="/favorites" element={<FavoritePage />}></Route>
          <Route path="/recommendations" element={<RecommendationPage />}></Route>
          <Route path="/ratings" element={<RatingsPage />}></Route>
        </Routes>
      </main>
    </div>
  );
}
