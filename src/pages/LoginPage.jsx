import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import '../index.css'

const LOGIN_URL = 'https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/auth/signin'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const navigate = useNavigate()

  async function handleSignIn() {
    setErrorMsg('')
    try {
      const res = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const json = await res.json()
      if (res.ok && json.data && json.data.token) {
        Cookies.set('jwt_token', json.data.token)
        navigate('/')
      } else {
        setErrorMsg(json.message || 'Invalid email or password')
      }
    } catch (err) {
      setErrorMsg('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-brand">Go Business</h1>
        <p className="login-tagline">Sign in to open your referral dashboard.</p>

        <div className="form-group">
          <label className="form-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="form-input"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="form-input"
            placeholder="••••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <button className="btn-signin" onClick={handleSignIn}>
          Sign in
        </button>

        {errorMsg && <p className="login-error">{errorMsg}</p>}
      </div>
    </div>
  )
}

export default LoginPage
