import { useEffect, useState } from 'react'
import { Route, BrowserRouter as Router, Routes, useNavigate } from 'react-router-dom'
import './App.css'

// common
import Home from './components/common/Home'
import Login from './components/common/Login'
import Profile from './components/common/Profile'
// admin
import Admin_Navbar from './components/admin/Navbar'
import Manage_Durable from './pages/admin/Manage_Durable'
import Manage_User from './pages/admin/Manage_User'
// samo
import Samo_Navbar from './components/samo/Navbar'
import Manage_Supply from './pages/samo/Manage_Supply'
import Samo_Package from './pages/samo/Samo_Package'
import History_all from './pages/samo/history_all'
import Outstanding from './pages/samo/outstanding'
// rally
import Rally_Navbar from './components/rally/Navbar'
import Rally_Durable from './pages/rally/Rally_Durable'
import Rally_Package from './pages/rally/Rally_Package'
// user
import User_Navbar from './components/user/Navbar'
import User_Package from './pages/user/User_Package'

function AppWrapper() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  // โหลด user จาก token ใน localStorage เมื่อ component mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const userData = JSON.parse(localStorage.getItem('user'))
      if (userData) setUser(userData)
    }
  }, [])

  // handleLogin รับ userData แล้ว set user, navigate
  const handleLogin = (userData) => {
    setUser(userData)
    if (userData.token) localStorage.setItem('token', userData.token)
    localStorage.setItem('user', JSON.stringify(userData))
    navigate('/')
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  // ถ้ายังไม่ได้ login ให้แสดง Login
  if (!user) {
    return <Login onLogin={handleLogin} />
  }

  // เลือก Navbar ตาม role
  let Navbar = null
  if (user.role === 'admin') Navbar = <Admin_Navbar role={user.role} onLogout={handleLogout} />
  else if (user.role === 'samo') Navbar = <Samo_Navbar role={user.role} onLogout={handleLogout} />
  else if (user.role === 'rally') Navbar = <Rally_Navbar role={user.role} onLogout={handleLogout} />
  else if (user.role === 'user') Navbar = <User_Navbar role={user.role} onLogout={handleLogout} />

  return (
    <div>
      {Navbar}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        {/* User routes */}
        {user.role === 'user' && <Route path="/borrow" element={<User_Package user={user} />} />}
        {/* Rally routes */}
        {user.role === 'rally' && <Route path="/borrow" element={<Rally_Package user={user} />} />}
        {user.role === 'rally' && <Route path="/rally_durable" element={<Rally_Durable user={user} />} />}
        {/* Samo routes */}
        {user.role === 'samo' && <Route path="/navbar_request" element={<Samo_Package user={user} />} />}
        {user.role === 'samo' && <Route path="/manage_supply" element={<Manage_Supply user={user} />} />}
        {user.role === 'samo' && <Route path="/history_all" element={<History_all user={user} />} />}
        {user.role === 'samo' && <Route path="/outstanding" element={<Outstanding user={user} />} />}
        {/* Admin routes */}
        {user.role === 'admin' && <Route path="/manage_durable" element={<Manage_Durable user={user} />} />}
        {user.role === 'admin' && <Route path="/manage_user" element={<Manage_User user={user} />} />}
      </Routes>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  )
}

export default App