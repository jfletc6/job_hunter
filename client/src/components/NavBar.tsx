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

  // Close dropdowns when clicking outside of them
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
    <nav className={searchOpen ? "mobile-search-active" : ""}>
      <div className="logo">
        <img src="/darkmode_icon_rmbg.png" alt="logo" />
        <h1>Fletch-Net.io</h1>
      </div>

      {/* Original desktop search bar — hidden on mobile via CSS */}
      <div className="search-bar">
        <input type="text" placeholder="Search..." />
        <button type="button">
          <img src="/darkmode_question_rmbg.png" alt="logo" />
        </button>
      </div>

      {/* Mobile-only expanded search bar — shown only when searchOpen */}
      {searchOpen && (
        <div className="search-bar mobile-search-bar">
          <input type="text" placeholder="Search..." autoFocus />
          <button type="button">
            <img src="/darkmode_question_rmbg.png" alt="search" />
          </button>
          <button
            type="button"
            className="search-close"
            onClick={() => setSearchOpen(false)}
            aria-label="Close search"
          >
            ✕
          </button>
        </div>
      )}

      <div className="nav-right">
        {/* Original desktop user menu / login */}
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

        {/* Mobile-only icon triggers */}
        <button
          type="button"
          className="icon-button search-toggle"
          onClick={() => setSearchOpen(true)}
          aria-label="Open search"
        >
          <img src="/darkmode_question_rmbg.png" alt="" />
        </button>

        <div className="user-menu dots-menu" ref={dotsRef}>
          <button
            type="button"
            className="icon-button dots-toggle"
            onClick={() => setDotsOpen((prev) => !prev)}
            aria-label="Open menu"
          >
            <img src="/darkmode_dots.png" alt="" />
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
    </nav>
  );
}
