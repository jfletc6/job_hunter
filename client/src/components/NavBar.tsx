import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function NavBar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close the dropdown when clicking outside of it
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    setMenuOpen(false)
    logout()
    navigate('/login')
  }

  return (
    <nav>
      <div className="logo">
        <img src="/darkmode_icon_rmbg.png" alt="logo" />
        <h1>Fletch-Net.io</h1>
      </div>

      <div className="search-bar">
        <input type="text" placeholder="Search..." />
        <button type="button">
          <img src="/darkmode_question_rmbg.png" alt="logo" />
        </button>
      </div>

      <div className="nav-right">
        {user ? (
          <div className="user-menu" ref={menuRef}>
            <button
              className="user-circle"
              onClick={() => setMenuOpen(prev => !prev)}
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
          <Link to="/login" className="login-button">
            Login
          </Link>
        )}
      </div>
    </nav>
  )
}