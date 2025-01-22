import React, { useEffect } from "react";
import "./Sidebar.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoHomeOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { GrLogin, GrLogout } from "react-icons/gr";
import { IoLibraryOutline } from "react-icons/io5";
import { MdOutlineFavoriteBorder } from "react-icons/md";
import { KeycloakService } from "../../assets/service/keycloak_service"; // KeycloakService importieren
import Logo from "../../assets/images/Logo.svg";
import LogoSmall from "../../assets/images/LogoSmall.svg";
import ButtonSVG from "../../assets/images/ButtonSVG.svg";
import ButtonSVGClose from "../../assets/images/ButtonSVGClose.svg";

/**
 * Functional component for the sidebar of the application.
 * @param {boolean} showSidebar - Flag to determine if the sidebar is shown or hidden.
 * @param {function} setShowSidebar - Function to toggle the visibility of the sidebar.
 * @returns JSX element representing the sidebar with navigation links and logout functionality.
 */
export default function Sidebar({ showSidebar, setShowSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Überprüfen, ob der Benutzer authentifiziert ist
  const isAuthenticated = KeycloakService.isAuthenticated(); 

  useEffect(() => {
    const handleResize = () => {
      setShowSidebar(window.innerWidth > 1100);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setShowSidebar]);

  const handleLogout = () => {
    KeycloakService.logout(); // Keycloak logout
    navigate("/login");
  };

  return (
    <div className={`Sidebar ${showSidebar ? "open" : "close"}`}>
      {showSidebar ? (
        <div className="sidebar-container">
          <div className="logo">
            <img src={Logo} alt="CineCritique Logo"></img>
          </div>
          <div className="items-container open">
            <div className="pages-container">
              <ul>
                <li
                  className={`li-btn ${
                    location.pathname === "/" ? "active" : ""
                  }`}>
                  <div>
                    <Link to="/" className="link-btn">
                      <IoHomeOutline />
                      <p>Home</p>
                    </Link>
                  </div>
                </li>
                <li
                  className={`li-btn ${
                    location.pathname === "/genres" ? "active" : ""
                  }`}>
                  <div>
                    <Link to="/genres" className="link-btn">
                      <IoLibraryOutline />
                      <p>Genres</p>
                    </Link>
                  </div>
                </li>
                {isAuthenticated && (
                  <>
                    <li
                      className={`li-btn ${
                        location.pathname === "/favorites" ? "active" : ""
                      }`}>
                      <div>
                        <Link to="/favorites" className="link-btn">
                          <MdOutlineFavoriteBorder />
                          <p>Favoriten</p>
                        </Link>
                      </div>
                    </li>
                    <li
                      className={`li-btn ${
                        location.pathname === "/ratings" ? "active" : ""
                      }`}>
                      <div>
                        <Link to="/ratings" className="link-btn">
                          <MdOutlineFavoriteBorder />
                          <p>Reviews</p>
                        </Link>
                      </div>
                    </li>
                    <li
                      className={`li-btn ${
                        location.pathname === "/recommendations" ? "active" : ""
                      }`}>
                      <div>
                        <Link to="/recommendations" className="link-btn">
                          <MdOutlineFavoriteBorder />
                          <p>Empfehlungen</p>
                        </Link>
                      </div>
                    </li>
                    <li
                      className={`li-btn ${
                        location.pathname === "/profile" ? "active" : ""
                      }`}>
                      <div>
                        <Link to="/profile" className="link-btn">
                          <CgProfile />
                          <p>Profil</p>
                        </Link>
                      </div>
                    </li>
                  </>
                )}
              </ul>
            </div>
            <div className="logout-container">
              <div>
                <ul>
                  <li>
                    <div>
                      {isAuthenticated ? (
                        <button onClick={handleLogout} className="link-btn">
                          <GrLogout />
                          <p>Abmelden</p>
                        </button>
                      ) : (
                        <Link to="/login" className="link-btn">
                          <GrLogin />
                          <p>Anmelden</p>
                        </Link>
                      )}
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="sidebar-container">
          <div className="logo">
            <img src={LogoSmall} alt="CineCritique Logo"></img>
          </div>
          <div className="items-container close">
            <div className="pages-container">
              <ul>
                <li
                  className={`li-btn ${
                    location.pathname === "/" ? "active" : ""
                  }`}>
                  <div>
                    <Link to="/" className="link-btn">
                      <IoHomeOutline />
                    </Link>
                  </div>
                </li>
                <li
                  className={`li-btn ${
                    location.pathname === "/genres" ? "active" : ""
                  }`}>
                  <div>
                    <Link to="/genres" className="link-btn">
                      <IoLibraryOutline />
                    </Link>
                  </div>
                </li>
                {isAuthenticated && (
                  <>
                    <li
                      className={`li-btn ${
                        location.pathname === "/favorites" ? "active" : ""
                      }`}>
                      <div>
                        <Link to="/favorites" className="link-btn">
                          <MdOutlineFavoriteBorder />
                        </Link>
                      </div>
                    </li>
                    <li
                      className={`li-btn ${
                        location.pathname === "/profile" ? "active" : ""
                      }`}>
                      <div>
                        <Link to="/profile" className="link-btn">
                          <CgProfile />
                        </Link>
                      </div>
                    </li>
                  </>
                )}
              </ul>
            </div>
            <div className="logout-container">
              <div>
                <ul>
                  <li>
                    <div>
                      {isAuthenticated ? (
                        <button onClick={handleLogout} className="link-btn">
                          <GrLogout />
                        </button>
                      ) : (
                        <Link to="/login" className="link-btn">
                          <GrLogin />
                        </Link>
                      )}
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="open-close-btn">
        <button onClick={() => setShowSidebar(!showSidebar)}>
          <img
            src={showSidebar ? ButtonSVG : ButtonSVGClose}
            alt="open-close Button"
          />
        </button>
      </div>
    </div>
  );
}

