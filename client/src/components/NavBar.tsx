import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [dotsOpen, setDotsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
      if (dotsRef.current && !dotsRef.current.contains(e.target as Node)) {
        setDotsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setMenuOpen(false);
    setDotsOpen(false);
    logout();
    navigate("/login");
  };

  return (
    <nav>
      {/* ── Mobile search expanded state ── */}
      {searchOpen && (
        <div className="mobile-search-expanded">
          <button
            type="button"
            className="icon-button search-close-btn"
            onClick={() => setSearchOpen(false)}
            aria-label="Close search"
          >
            {/* Drop darkmode_backarrow.png into client/public/ and it will appear here */}
            <img src="/darkmode_backarrow.png" alt="backarrow" />
          </button>
          <div className="search-bar mobile-search-bar">
            <input type="text" placeholder="Search..." autoFocus />
            <button type="button">
              <img src="/darkmode_question_rmbg.png" alt="search" />
            </button>
          </div>
        </div>
      )}

      {/* ── Normal nav row (always rendered, hidden on mobile when search open) ── */}
      <div className={`nav-main-row${searchOpen ? " nav-hidden-mobile" : ""}`}>
        <div className="logo">
          <img src="/darkmode_icon_rmbg.png" alt="logo" />
          <h1>Fletch-Net.io</h1>
        </div>

        {/* Desktop search bar */}
        <div className="search-bar search-bar-desktop">
          <input type="text" placeholder="Search..." />
          <button type="button">
            <img src="/darkmode_question_rmbg.png" alt="search" />
          </button>
        </div>

        <div className="nav-right">
          {/* Desktop user menu */}
          {user ? (
            <div className="user-menu desktop-user-menu" ref={menuRef}>
              <button
                className="user-circle"
                onClick={() => setMenuOpen((prev) => !prev)}
                title={user.username}
              >
                {user.username.charAt(0).toUpperCase()}
              </button>
              {menuOpen && (
                <div className="user-dropdown">
                  <button className="dropdown-item" onClick={handleLogout}>
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="login-button desktop-user-menu">
              Login
            </Link>
          )}

          {/* Mobile icon triggers */}
          <button
            type="button"
            className="icon-button search-toggle"
            onClick={() => setSearchOpen(true)}
            aria-label="Open search"
          >
            <img src="/darkmode_question_rmbg.png" alt="search" />
          </button>

          <div className="user-menu dots-menu" ref={dotsRef}>
            <button
              type="button"
              className="icon-button dots-toggle"
              onClick={() => setDotsOpen((prev) => !prev)}
              aria-label="Open menu"
            >
              {/* Drop darkmode_dots.png into client/public/ and it will appear here */}
              <img src="/darkmode_dots.png" alt="menu" />
            </button>
            {dotsOpen && (
              <div className="user-dropdown">
                {user ? (
                  <button className="dropdown-item" onClick={handleLogout}>
                    Log out
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="dropdown-item"
                    onClick={() => setDotsOpen(false)}
                  >
                    Login
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
