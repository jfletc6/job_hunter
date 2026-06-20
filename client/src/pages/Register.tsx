import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Register() {
  const [form, setForm] = useState({ email: '', password: '', confirm: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm) return
    // TODO: connect to backend auth
  }

  return (
    <div className="auth-page">
      <div className="auth-logo">
        <img src="/darkmode_icon.png" alt="logo" />
        <h1>Fletch-Net.io</h1>
      </div>
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Register</h2>

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
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