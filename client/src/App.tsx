import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import NavBar from './components/NavBar'
import Login from './pages/Login'
import Register from './pages/Register'
import AddCompany from './pages/AddCompany'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Navigate to="/add-company" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/add-company" element={<AddCompany />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App