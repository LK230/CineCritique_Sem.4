import React, { useEffect, useState, useRef, useCallback } from "react";
import { MovieService } from "../../assets/service/movie_service";
import Card from "../../components/card/Card";
import LeftArrow from "../../assets/images/ButtonSVG.svg";
import RightArrow from "../../assets/images/ButtonSVGClose.svg";
import "./Genres.css";
import {
  SkeletonGenreCard,
  SkeletonMovieCard,
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
 * Functional component for displaying genres and movies.
 * Uses state to manage genre and genreMovie data.
 * Utilizes useRef for scroll references.
 * Fetches genre data from MovieService and updates state accordingly.
 * Renders genre cards with movie information or skeleton cards if data is loading.
 * @returns JSX element for displaying genres and movies.
 */
export default function Genres() {
  const [genre, setGenre] = useState({});
  const [genreMovie, setGenreMovie] = useState({});
  const scrollRefs = useRef({});

  useEffect(() => {
    const fetchGenresAndMovies = async () => {
      const cachedGenres = getCachedData("genres");
      const cachedMovies = getCachedData("movies");

      if (cachedGenres && cachedMovies) {
        setGenre(cachedGenres);
        setGenreMovie(cachedMovies);
      } else {
        try {
          // Load genre data and movie data for each genre in parallel
          const genreDataPromise = new MovieService().getGenre();
          const genreMoviesPromises = Object.keys(await genreDataPromise).map((genreName) =>
            new MovieService().getGenreMovies(genreName)
          );

          const [genreData, genreMovies] = await Promise.all([genreDataPromise, Promise.all(genreMoviesPromises)]);

          setGenre(genreData);
          const genreMoviesMap = genreMovies.reduce((acc, movies, idx) => {
            acc[Object.keys(genreData)[idx]] = movies;
            return acc;
          }, {});

          setGenreMovie(genreMoviesMap);

          // Cache data
          setCachedData("genres", genreData);
          setCachedData("movies", genreMoviesMap);
        } catch (error) {
          console.error("Fehler beim Abrufen der Genres und Filme:", error);
        }
      }
    };

    fetchGenresAndMovies();
  }, []);

  const scrollLeft = useCallback((genreName) => {
    if (scrollRefs.current[genreName]) {
      scrollRefs.current[genreName].scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  }, []);

  const scrollRight = useCallback((genreName) => {
    if (scrollRefs.current[genreName]) {
      scrollRefs.current[genreName].scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  }, []);

  return (
    <div className="Genres">
      <div>
        {Object.keys(genre).length > 0
          ? Object.keys(genre).map((genreName) => (
              <div key={genreName}>
                <h2>
                  {genreName}
                  <span>.</span>
                </h2>
                <div>
                  <div className="img-view-container">
                    {genreMovie[genreName]?.length > 3 ? (
                      <button
                        className="arrow arrow-left"
                        onClick={() => scrollLeft(genreName)}>
                        <img src={LeftArrow} alt="Left Arrow" />
                      </button>
                    ) : (
                      <div className="arrow-margin"> </div>
                    )}

                    <div
                      className="backdrop-container"
                      ref={(el) => (scrollRefs.current[genreName] = el)}>
                      {genreMovie[genreName]?.length > 0
                        ? genreMovie[genreName].map((movie, index) => (
                            <Card
                              key={movie.imdbId}
                              id={movie.imdbId}
                              poster={movie.poster}
                              title={movie.title}
                            />
                          ))
                        : Array(5)
                            .fill(0)
                            .map((_, index) => (
                              <SkeletonMovieCard key={index} />
                            ))}
                    </div>
                    {genreMovie[genreName]?.length > 3 && (
                      <button
                        className="arrow arrow-right"
                        onClick={() => scrollRight(genreName)}>
                        <img src={RightArrow} alt="Right Arrow" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          : Array(5)
              .fill(0)
              .map((_, index) => <SkeletonGenreCard key={index} />)}
      </div>
    </div>
  );
}
