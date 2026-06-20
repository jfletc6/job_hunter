import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Register() {
  const [form, setForm] = useState({ email: '',  firstname: '', lastname: '', username: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirm) {
      setError('Passwords do not match')
      return
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          username: form.username,
          password: form.password,
          firstname: form.firstname,
          lastname: form.lastname,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || 'Registration failed')
        return
      }
      navigate('/login')
    } catch (err) {
      setError('Server error, please try again')
    }
  }

  return (
    <div className="auth-page">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Register</h2>

        {error && <p className="auth-error">{error}</p>}

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />

        <label htmlFor="firstname">First Name</label>
        <input
          type="text"
          id="firstname"
          placeholder="First Name"
          value={form.firstname}
          onChange={e => setForm({ ...form, firstname: e.target.value })}
        />

        <label htmlFor="lastname">Last Name</label>
        <input
          type="text"
          id="lastname"
          placeholder="Last Name"
          value={form.lastname}
          onChange={e => setForm({ ...form, lastname: e.target.value })}
        />

        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          placeholder="Username"
          value={form.username}
          onChange={e => setForm({ ...form, username: e.target.value })}
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          placeholder="••••••••"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
        />

        <label htmlFor="confirm">Confirm Password</label>
        <input
          type="password"
          id="confirm"
          placeholder="••••••••"
          value={form.confirm}
          onChange={e => setForm({ ...form, confirm: e.target.value })}
        />

        <button type="submit">Create Account</button>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  )
}