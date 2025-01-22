import React, { useEffect, useRef, useState, useCallback } from "react";
import Card from "../../components/card/Card";
import "./Home.css";
import { Link } from "react-router-dom";
import { Searchbar } from "../../components/searchbar/Searchbar";
import GenreCard from "../../components/card/GenreCard";
import { MovieService } from "../../assets/service/movie_service";
import LeftArrow from "../../assets/images/ButtonSVG.svg";
import RightArrow from "../../assets/images/ButtonSVGClose.svg";
import {
  SkeletonGenreCard,
  SkeletonMovieCard,
  SkeletonRandomMovie,
} from "../../components/skeletonLoader/SkeletonLoader";

// Helper functions for caching
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 Stunden

const getCachedData = (key) => {
  const cached = JSON.parse(localStorage.getItem(key));
  if (cached && new Date().getTime() - cached.timestamp < CACHE_EXPIRY) {
    return cached.data;
  }
  return null;
};

const setCachedData = (key, data) => {
  localStorage.setItem(key, JSON.stringify({ data, timestamp: new Date().getTime() }));
};

/**
 * Die Home-Komponente zeigt eine Liste von Filmen, die besten Filme, Genres und einen zufälligen Film.
 * @returns None
 */
export default function Home() {
  // State zum Speichern der Filme, besten Filme, Genres und gefilterte Filme
  const [movies, setMovies] = useState([]);
  const [bestRatedMovies, setBestRatedMovies] = useState([]);
  const [genre, setGenre] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [randomMovie, setRandomMovie] = useState(null); // Zufällig ausgewählter Film
  const scrollRef = useRef({}); // Referenz für das Scrollen in verschiedenen Containern

  // Fetch-Daten mit Cache-Überprüfung
  useEffect(() => {
    const fetchData = async () => {
      const cachedMovies = getCachedData("movies");
      const cachedGenres = getCachedData("genres");

      if (cachedMovies && cachedGenres) {
        setMovies(cachedMovies);
        setFilteredMovies(cachedMovies);
        setRandomMovie(cachedMovies[Math.floor(Math.random() * cachedMovies.length)]);
        setGenre(cachedGenres);
      } else {
        try {
          const [movies, genres, bestRatedMovies] = await Promise.all([
            new MovieService().getMovies(),
            new MovieService().getGenre(),
            new MovieService().getBestRatedMovie(),
          ]);

          setMovies(movies);
          setFilteredMovies(movies);
          setRandomMovie(movies[Math.floor(Math.random() * movies.length)]);
          setGenre(genres);
          setBestRatedMovies(bestRatedMovies);

          // Cache Daten
          setCachedData("movies", movies);
          setCachedData("genres", genres);
        } catch (error) {
          console.error("Fehler beim Laden der Daten:", error);
        }
      }
    };

    fetchData();
  }, []);

  // Ändert den zufälligen Film alle 10 Sekunden
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (movies.length > 0) {
        setRandomMovie(movies[Math.floor(Math.random() * movies.length)]);
      }
    }, 10000);

    return () => clearInterval(intervalId); // Intervall beim Unmounten löschen
  }, [movies]);

  // Scrollen nach links in den angegebenen Container
  const scrollLeft = useCallback((key) => {
    if (scrollRef.current[key]) {
      scrollRef.current[key].scrollBy({ left: -300, behavior: "smooth" });
    }
  }, []);

  // Scrollen nach rechts in den angegebenen Container
  const scrollRight = useCallback((key) => {
    if (scrollRef.current[key]) {
      scrollRef.current[key].scrollBy({ left: 300, behavior: "smooth" });
    }
  }, []);

  // Handle die Suchabfrage und filtere die angezeigten Filme
  const handleSearch = (query) => {
    const filtered = movies.filter((movie) =>
      movie.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredMovies(filtered); // Update die gefilterten Filme mit den Suchergebnissen
  };

  // Memoisierte GenreCard und Card-Komponenten zur Performanceverbesserung
  const GenreCardMemo = React.memo(GenreCard);
  const CardMemo = React.memo(Card);

  return (
    <div className="Home">
      <div>
        {/* Suchleisten-Komponente */}
        <Searchbar movies={movies} onSearch={handleSearch} />
      </div>

      <div className="home-layout">
        {/* Links: Genre Cards */}
        <div className="genres">
          <div className="img-view-container">
            <button
              className="arrow arrow-left"
              onClick={() => scrollLeft("genres")}
            >
              <img src={LeftArrow} alt="Left Arrow" />
            </button>
            <div
              className="backdrop-container"
              ref={(el) => (scrollRef.current["genres"] = el)}
            >
              {Object.keys(genre).length > 0
                ? Object.keys(genre).map((obj) => (
                    <GenreCardMemo key={obj} genre={obj} />
                  ))
                : Array(5)
                    .fill(0)
                    .map((_, index) => <SkeletonGenreCard key={index} />)}
            </div>
            <button
              className="arrow arrow-right"
              onClick={() => scrollRight("genres")}
            >
              <img src={RightArrow} alt="Right Arrow" />
            </button>
          </div>
        </div>

        {/* Mitte: Zufälliger Film-Poster */}
        <div className="random-movie">
          {randomMovie ? (
            <Link to={`/movies/${randomMovie.imdbId}`}>
              <img
                src={randomMovie.backdrops && randomMovie.backdrops.length > 0
                  ? randomMovie.backdrops[Math.floor(Math.random() * randomMovie.backdrops.length)]
                  : randomMovie.poster}  // Fallback zu Poster, falls keine Backdrops vorhanden
                alt={randomMovie.title}
                loading="lazy"  // Lazy loading des Bildes
                style={{ cursor: "pointer" }}
              />
            </Link>
          ) : (
            <SkeletonRandomMovie />
          )}
        </div>

        {/* Rechts: Bestbewertete Filme */}
        <div className="best-rated">
          <h2>
            Beliebte Filme<span>.</span>
          </h2>
          <div className="img-view-container">
            <button
              className="arrow arrow-left"
              onClick={() => scrollLeft("movies")}
            >
              <img src={LeftArrow} alt="Left Arrow" />
            </button>
            <div
              className="backdrop-container"
              ref={(el) => (scrollRef.current["movies"] = el)}
            >
              {bestRatedMovies.length > 0
                ? bestRatedMovies.map((obj) => (
                    <CardMemo
                      key={obj.imdbId}
                      id={obj.imdbId}
                      poster={obj.poster}
                      title={obj.title}
                    />
                  ))
                : Array(5)
                    .fill(0)
                    .map((_, index) => <SkeletonMovieCard key={index} />)}
            </div>
            <button
              className="arrow arrow-right"
              onClick={() => scrollRight("movies")}
            >
              <img src={RightArrow} alt="Right Arrow" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

