import React from 'react'
import { Link } from 'react-router-dom'
import '../index.css'

function NotFoundPage() {
  return (
    <div className="notfound-page">
      <div className="notfound-number">404</div>
      <p className="notfound-text">Page not found</p>
      <Link to="/" className="notfound-link">
        Back to dashboard
      </Link>
    </div>
  )
}

export default NotFoundPage
