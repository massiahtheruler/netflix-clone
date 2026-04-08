import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './Navbar.css'
import logo from '../../assets netflix/logo.png'
import search_icon from '../../assets netflix/search_icon.svg'
import bell_icon from '../../assets netflix/bell_icon.svg'
import profile_img from '../../assets netflix/profile_img.png' 
import caret_icon from '../../assets netflix/caret_icon.svg'
import { logout } from '../../firebase'

function Navbar({ className = '' }) {
const navRef = useRef()
const navigate = useNavigate()

const handleLogout = async () => {
    await logout()
    navigate('/login')
}

useEffect(() => {
const handleScroll = () => {
    if (!navRef.current) return

    const progress = Math.min(window.scrollY / 180, 1)
    navRef.current.style.setProperty('--nav-progress', progress)
}

handleScroll()
window.addEventListener('scroll', handleScroll)

return () => {
    window.removeEventListener('scroll', handleScroll)
}
},[])

  return (
    <div ref={navRef} className={`navbar ${className}`.trim()}>
      <div className="navbar-left">
        <img src={logo} alt="Netflix logo" />
        <ul>
          <li>Home</li>
          <li>
            <span className="navbar__label navbar__label--full">TV Shows</span>
            <span className="navbar__label navbar__label--short">Shows</span>
          </li>
          <li>Movies</li>
          <li>
            <span className="navbar__label navbar__label--full">New & Popular</span>
            <span className="navbar__label navbar__label--short">Popular</span>
          </li>
          <li>
            <span className="navbar__label navbar__label--full">My List</span>
            <span className="navbar__label navbar__label--short">List</span>
          </li>
          <li>
            <span className="navbar__label navbar__label--full">Browse by Language</span>
            <span className="navbar__label navbar__label--short">Language</span>
          </li>
        </ul>
      </div>
      <div className="navbar-right">
        <img src={search_icon} alt="Search" className='icons' cursor="not-allowed" />
        <p className='children' >Children</p>
        <img src={bell_icon} alt="Notifications" className="icons" />
        <div className="navbar__profile">
            <img src={profile_img} alt="" className="profile" />
    <img src={caret_icon} alt="" />
    <div className="navbar__dropdown">
        <p onClick={handleLogout}>Sign Out of Netflix</p>
    </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
