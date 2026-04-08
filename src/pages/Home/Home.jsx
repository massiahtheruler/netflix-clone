import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Home.css'
import Navbar from '../../components/Navbar/Navbar'
import heroPlayerBackdrop from '../../assets netflix/black background jh logo.avif'
import hero_banner from '../../assets netflix/hero_banner.jpg'
import hero_title from '../../assets netflix/hero_title.png'
import spinner from '../../assets netflix/netflix_spinner.gif'
import play_icon from '../../assets netflix/play_icon.png'
import info_icon from '../../assets netflix/info_icon.png'
import CountdownBadge from '../../components/CountdownBadge/CountdownBadge'
import TitleCards from '../../components/TitleCards/TitleCards'
import Footer from '../../components/Footer/Footer'
import useAutoplayCountdown from '../../hooks/useAutoplayCountdown'

const HERO_TRAILER_KEY = '-IonP3Hworw'
const HERO_IDLE_DELAY_MS = 10000
const CONTENT_RETURN_MS = 420
const HERO_VISIBILITY_THRESHOLD = 0.6
const HERO_PLAYER_STATE = {
  videoKey: HERO_TRAILER_KEY,
  name: 'The Protector',
  title: 'The Protector',
  type: 'Trailer',
  published_at: '',
  overview: 'Discovering his ties to a secret ancient order, a young man living in modern Istanbul embarks on a quest to save the city from an immortal enemy.',
  backdropPath: heroPlayerBackdrop,
}

function Home() {
  const navigate = useNavigate()
  const heroRef = useRef(null)
  const returnTimerRef = useRef(null)
  const [heroMostlyVisible, setHeroMostlyVisible] = useState(true)
  const [showTrailer, setShowTrailer] = useState(false)
  const [immersiveMode, setImmersiveMode] = useState(false)
  const [contentReturning, setContentReturning] = useState(false)
  const { countdownSeconds, clearCountdown, resetCountdown, startCountdown } = useAutoplayCountdown(HERO_IDLE_DELAY_MS)

  useEffect(() => {
    if (!heroRef.current) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isMostlyVisible = entry.intersectionRatio >= HERO_VISIBILITY_THRESHOLD

        setHeroMostlyVisible(isMostlyVisible)

        if (!isMostlyVisible) {
          clearCountdown()
          clearTimeout(returnTimerRef.current)
          setShowTrailer(false)
          setImmersiveMode(false)
          setContentReturning(false)
          resetCountdown()
        }
      },
      {
        threshold: [0, HERO_VISIBILITY_THRESHOLD, 1],
      },
    )

    observer.observe(heroRef.current)

    return () => observer.disconnect()
  }, [clearCountdown, resetCountdown])

  useEffect(() => {
    const clearAllTimers = () => {
      clearCountdown()
      clearTimeout(returnTimerRef.current)
    }

    if (!heroMostlyVisible) {
      clearAllTimers()
      return
    }

    const startIdleTimer = () => {
      startCountdown(() => {
        setShowTrailer(true)
        setImmersiveMode(true)
      })
    }

    const handleActivity = () => {
      if (!heroMostlyVisible) {
        return
      }

      clearCountdown()

      if (immersiveMode || showTrailer) {
        setImmersiveMode(false)
        setShowTrailer(false)
        setContentReturning(true)
        clearTimeout(returnTimerRef.current)
        returnTimerRef.current = setTimeout(() => {
          setContentReturning(false)
        }, CONTENT_RETURN_MS)
      }

      startIdleTimer()
    }

    startIdleTimer()
    window.addEventListener('scroll', handleActivity, { passive: true })
    window.addEventListener('mousemove', handleActivity)

    return () => {
      clearAllTimers()
      window.removeEventListener('scroll', handleActivity)
      window.removeEventListener('mousemove', handleActivity)
    }
  }, [clearCountdown, heroMostlyVisible, immersiveMode, showTrailer, startCountdown])

  const openHeroPlayer = () => {
    if (!heroMostlyVisible) {
      return
    }

    clearCountdown()
    navigate('/player/hero', { state: HERO_PLAYER_STATE })
  }

  return (
    <div className={`home ${immersiveMode ? 'home--immersive' : ''} ${contentReturning ? 'home--content-return' : ''}`}>
      <Navbar className="home__cinema navbar--home" />

      <div ref={heroRef} className="hero">
        <button className='hero__media-trigger' type='button' onClick={openHeroPlayer} aria-label='Play The Protector trailer' />

        <img src={hero_banner} alt="The Protector backdrop" className='banner__img' />

        <div className={`hero__trailer ${showTrailer ? 'hero__trailer--visible' : ''}`} aria-hidden={!showTrailer}>
          <iframe
            className='hero__trailer-frame'
            src={`https://www.youtube.com/embed/${HERO_TRAILER_KEY}?autoplay=${showTrailer ? 1 : 0}&mute=1&controls=0&loop=1&playlist=${HERO_TRAILER_KEY}&playsinline=1&rel=0`}
            title='The Protector trailer'
            allow='autoplay; fullscreen'
            referrerPolicy='strict-origin-when-cross-origin'
          />
        </div>

        <div className="hero__overlay" />

        {!showTrailer && heroMostlyVisible ? (
          <CountdownBadge
            className="home__cinema hero__countdown"
            spinnerClassName="hero__countdown-spinner"
            spinnerSrc={spinner}
            seconds={countdownSeconds}
          />
        ) : null}

        <div className="home__cinema hero__caption">
          <img src={hero_title} alt="The Protector" className='caption__img' />
          <h2 className='caption__title'>The Protector</h2>
          <p>Discovering his ties to a secret ancient order,
             a young man living in modern Istanbul embarks
            on a quest to save the city from an immortal enemy
          </p>
          <div className="hero__btns">
            <button className='btn' onClick={openHeroPlayer} type='button'>
              <img src={play_icon} alt="" />
              Play
            </button>
            <button className='btn dark__btn' type='button'>
              <img src={info_icon} alt="" />
              More Info
            </button>
          </div>
        </div>
        <div className="home__cinema hero__cards">
          <TitleCards category={"top_rated"} />
        </div>
      </div>
      <div className="home__cinema more__cards">
        <TitleCards title={"Featured Movies"} category={"now_playing"} />
        <TitleCards title={"Only on Netflix"} category={"popular"} />
        <TitleCards title={"New Releases"} category={"upcoming"} />
        <TitleCards title={"Top Picks for You"} category={"now_playing"} />
      </div>
      <div className="home__cinema">
        <Footer />
      </div>
    </div>
  )
}

export default Home
