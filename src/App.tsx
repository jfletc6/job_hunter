import './App.css'
import { useState } from 'react'

type Company = {
  name: string
  url: string
  keywords: string
  notes: string
}

function App() {
  const [page, setPage] = useState('dashboard')
  const [companies, setCompanies] = useState<Company[]>([])
  const [form, setForm] = useState({ name: '', url: '', keywords: '', notes: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.url) return
    setCompanies([...companies, form])
    setForm({ name: '', url: '', keywords: '', notes: '' })
    setPage('my-companies')
  }

  return (
    <>
      <nav>
      <div className="logo">
        <img src="/darkmode_icon.png" alt="logo" />
        <h1>Fletch-Net.io</h1>
      </div>
      <div className="search-bar">
        <input type="text" placeholder="Search..." />
        <button type="button">
          <img src="/darkmode_question_rmbg.png" alt="logo" />
        </button>
      </div>
      </nav>

      <div className="tabs">
        <button
          className={page === 'dashboard' ? 'tab active' : 'tab'}
          onClick={() => setPage('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={page === 'my-companies' ? 'tab active' : 'tab'}
          onClick={() => setPage('my-companies')}
        >
          My Companies
        </button>
        <button
          className={page === 'add-company' ? 'tab active' : 'tab'}
          onClick={() => setPage('add-company')}
        >
          Add Company
        </button>
      </div>

      
      <main>
        <h1>Add a Company</h1>
        <form>
          <label htmlFor="company">Company Name</label>
          <input type="text" id="company" placeholder="e.g. Google" />

          <label htmlFor="url">Job Board URL</label>
          <input type="url" id="url" placeholder="e.g. https://careers.google.com" />

          <label htmlFor="keywords">Keywords</label>
          <input type="text" id="keywords" placeholder="e.g. Software Engineer, Python, Remote" />
          
          <label htmlFor="notes">Notes</label>
          <textarea id="notes" placeholder="e.g. Check every Monday..." />

          <button type="submit">Add Company</button>
        </form>
      </main>
    </>
  )
}

export default App