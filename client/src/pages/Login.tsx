import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [form, setForm] = useState({ identifier: '', password: '' })
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || 'Login failed')
        return
      }
      login(data.token, data.user)
      navigate('/')
    } catch (err) {
      setError('Server error, please try again')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-logo">
        <img src="/darkmode_icon_rmbg.png" alt="logo" />
        <h1>Fletch-Net.io</h1>
      </div>
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Login</h2>

        {error && <p className="auth-error">{error}</p>}

        <label htmlFor="identifier">Username/Email</label>
        <input
          type="text"
          id="identifier"
          value={form.identifier}
          onChange={e => setForm({ ...form, identifier: e.target.value })}
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
        />

        <button type="submit">Login</button>
        <p className="auth-switch">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  )
}