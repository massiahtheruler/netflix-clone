import React from 'react'
import './Footer.css'
import youtube_icon from '../../assets netflix/youtube_icon.png'
import twitter_icon from '../../assets netflix/twitter_icon.png'
import instagram_icon from '../../assets netflix/instagram_icon.png'
import facebook_icon from '../../assets netflix/facebook_icon.png'

function Footer() {
  return (
    <div className='footer'>
      <div className="footer__icons">
        <img src={youtube_icon} alt="" />
        <img src={twitter_icon} alt="" />
        <img src={instagram_icon} alt="" />
        <img src={facebook_icon} alt="" />
      </div>
      <ul>
        <li>Audio Description</li>
        <li>Help Center</li>
        <li>Gift Cards</li>
        <li>Media</li>
        <li>Investment Opportunities</li>
        <li>Jobs</li>
        <li>Terms of Use</li>
        <li>Privacy</li>
        <li>Legal Notices</li>
        <li>Cookie Preferences</li>
        <li>Corporate Info</li>
        <li>Contact Us</li>
      </ul>
      <p className='copyright__text'>&copy 1997-2026 Netflix, Inc.</p>
    </div>
  )
}

export default Footer
