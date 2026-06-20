import { Link } from 'react-router-dom'

export default function NavBar() {
  return (
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
  )
}