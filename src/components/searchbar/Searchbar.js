import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import "./Searchbar.css";
import { FaSearch } from "react-icons/fa";
import FavoriteButton from "../button/FavoriteButton";
import UserService from "../../assets/service/user_service";
import { KeycloakService } from "../../assets/service/keycloak_service";

/**
 * Functional component representing a search bar with suggestions and favorite movie functionality.
 * @param {Object} movies - An array of movie objects to search through.
 * @param {Function} onSearch - A callback function to handle search submissions.
 * @returns JSX element representing the search bar component.
 */

export const Searchbar = ({ movies, onSearch }) => {
  const [inputValue, setInputValue] = useState("");
  const [placeholder, setPlaceholder] = useState("Suche");
  const [suggestions, setSuggestions] = useState([]);
  const [favoredMovies, setFavoredMovies] = useState(new Set());

  const isAuthenticated =  KeycloakService.isAuthenticated();

  useEffect(() => {
    const fetchFavorites = async () => {
      if (isAuthenticated) {
        try {
          const userMe = await UserService.getUserMe();
          const favoredMovies = await UserService.getFavorites(userMe);
          
            const favoriteIds = favoredMovies.map(
              (fav) => fav.imdbId
            );
            setFavoredMovies(new Set(favoriteIds));
          
        } catch (error) {
          console.error("Error fetching favorite movies:", error);
        }
      }
    };

    fetchFavorites();
  }, [isAuthenticated]);

  // Memoize the lowercase version of movies with original titles
  const lowerCaseMovies = useMemo(() => {
    return movies.map((movie) => ({
      ...movie,
      lowerCaseTitle: movie.title.toLowerCase(), // Hinzufügen eines Felds für lowercase-Vergleiche
    }));
  }, [movies]);

  // Debounced function to filter suggestions
  const handleInputChange = useCallback(
    (e) => {
      const value = e.target.value;
      setInputValue(value);

      // Clear previous debounce timeout
      if (window.debounceTimeout) {
        clearTimeout(window.debounceTimeout);
      }

      // Set new debounce timeout
      window.debounceTimeout = setTimeout(() => {
        if (value) {
          const filteredSuggestions = lowerCaseMovies
            .filter((movie) =>
              movie.lowerCaseTitle.includes(value.toLowerCase())
            )
            .map((movie) => ({
              ...movie,
              title: movie.title, // Zurück zur ursprünglichen Form
            }));

          setSuggestions(filteredSuggestions);
        } else {
          setSuggestions([]);
        }
      }, 300); // Wait 300ms after the user stops typing
    },
    [lowerCaseMovies]
  );

  /*
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    if (value) {
      const filteredSuggestions = movies.filter((movie) =>
        movie.title.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  }; */

  const handleInputClick = () => {
    if (placeholder === "Suche") {
      setPlaceholder("");
    }
  };

  const handleInputBlur = () => {
    if (inputValue === "") {
      setPlaceholder("Suche");
    }
  };

  const handleSearchSubmit = () => {
    if (inputValue) {
      onSearch(inputValue);
      setSuggestions([]);
    }
  };

  const handleFavorite = async (imdbId) => {
    if (favoredMovies.has(imdbId)) {
      await getDeleteFromFavorites(imdbId);
    } else {
      await getAddToFavorites(imdbId);
    }
  };

  const getAddToFavorites = async (imdbId) => {
    try {
      const response = await UserService.userAddToFavorite(imdbId);
      if (response === "Movie added to favorites successfully") {
        setFavoredMovies((prev) => new Set(prev).add(imdbId));
      }
    } catch (error) {
      console.error("Error adding to favorites:", error);
    }
  };

  const getDeleteFromFavorites = async (imdbId) => {
    try {
      const response = await UserService.userDeleteFromFavorite(imdbId);
      if (response === "Movie removed from favorites successfully") {
        setFavoredMovies((prev) => {
          const newSet = new Set(prev);
          newSet.delete(imdbId);
          return newSet;
        });
      }
    } catch (error) {
      console.error("Error deleting from favorites:", error);
    }
  };

  return (
    <div className="SearchbarContainer">
      <div className="Searchbar">
        <FaSearch id="search-icon" />
        <input
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onClick={handleInputClick}
          onBlur={handleInputBlur}
          onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
        />
      </div>
      {suggestions.length > 0 && (
        <div className="suggestions">
          {suggestions.map((movie) => (
            <div key={movie.imdbId} className="suggestion-item">
              <Link to={`/movies/${movie.imdbId}`}>
                <img src={movie.poster} alt={movie.title} />
                <span>{movie.title}</span>
              </Link>
              {isAuthenticated && (
                <div className="favoriteButton">
                  <FavoriteButton
                    onClick={() => handleFavorite(movie.imdbId)}
                    isActive={favoredMovies.has(movie.imdbId)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};