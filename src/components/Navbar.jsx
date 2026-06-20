import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import '../index.css'

function Navbar() {
  const navigate = useNavigate()

  function handleLogout() {
    Cookies.remove('jwt_token')
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand" aria-label="Go to dashboard home">
        Go Business
      </Link>
      <div className="navbar-right">
        <button className="btn-try-free">Try for free</button>
        <button className="btn-logout" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </nav>
  )
}

export default Navbar
