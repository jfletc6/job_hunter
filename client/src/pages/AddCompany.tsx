import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

type Company = {
  name: string
  url: string
  keywords: string
  notes: string
}

export default function AddCompany() {
  const navigate = useNavigate()
  const [companies, setCompanies] = useState<Company[]>([])
  const [form, setForm] = useState({ name: '', url: '', keywords: '', notes: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.url) return
    setCompanies([...companies, form])
    setForm({ name: '', url: '', keywords: '', notes: '' })
  }

  return (
    <>
      <div className="tabs">
        <button className="tab" onClick={() => navigate('/')}>Dashboard</button>
        <button className="tab" onClick={() => navigate('/companies')}>My Companies</button>
        <button className="tab active">Add Company</button>
      </div>
      <main>
        <h1>Add a Company</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="company">Company Name</label>
          <input
            type="text"
            id="company"
            placeholder="e.g. Google"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />

          <label htmlFor="url">Job Board URL</label>
          <input
            type="url"
            id="url"
            placeholder="e.g. https://careers.google.com"
            value={form.url}
            onChange={e => setForm({ ...form, url: e.target.value })}
          />

          <label htmlFor="keywords">Keywords</label>
          <input
            type="text"
            id="keywords"
            placeholder="e.g. Software Engineer, Python, Remote"
            value={form.keywords}
            onChange={e => setForm({ ...form, keywords: e.target.value })}
          />

          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            placeholder="e.g. Check every Monday..."
            value={form.notes}
            onChange={e => setForm({ ...form, notes: e.target.value })}
          />

          <button type="submit">Add Company</button>
        </form>
      </main>
    </>
  )
}