import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import './player.css'
import Navbar from '../../components/Navbar/Navbar'
import back_arrow_icon from '../../assets netflix/back_arrow_icon.png'
import spinner from '../../assets netflix/netflix_spinner.gif'
import play_icon from '../../assets netflix/play_icon.png'
import CountdownBadge from '../../components/CountdownBadge/CountdownBadge'
import useAutoplayCountdown from '../../hooks/useAutoplayCountdown'

const FALLBACK_VIDEO_KEY = '-IonP3Hworw'
const PLAYER_IDLE_DELAY_MS = 6000
const PLAYER_RETURN_MS = 420
const FALLBACK_DESCRIPTION =
  'A hidden protector rises from an ancient legacy and steps into a dangerous fight to defend the city from a powerful immortal enemy.'
const FALLBACK_BACKDROP = 'https://image.tmdb.org/t/p/original/wM0uVPMr4unF6J7i6XnV4fM5Z9P.jpg'

const fallbackPlayerData = {
  name: 'Fallback trailer',
  title: 'The Protector',
  key: FALLBACK_VIDEO_KEY,
  published_at: '',
  type: 'Trailer',
  overview: FALLBACK_DESCRIPTION,
  backdropPath: FALLBACK_BACKDROP,
}

function Player() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams()
  const tmdbBearerToken = import.meta.env.VITE_TMDB_BEARER_TOKEN
  const returnTimerRef = useRef(null)

  const seededPlayerData = useMemo(() => {
    if (!location.state?.videoKey && !location.state?.title && !location.state?.overview) {
      return null
    }

    return {
      key: location.state?.videoKey ?? FALLBACK_VIDEO_KEY,
      name: location.state?.name ?? location.state?.title ?? 'Trailer',
      title: location.state?.title ?? location.state?.name ?? 'Untitled Feature',
      type: location.state?.type ?? 'Trailer',
      published_at: location.state?.published_at ?? '',
      overview: location.state?.overview || FALLBACK_DESCRIPTION,
      backdropPath: location.state?.backdropPath || FALLBACK_BACKDROP,
    }
  }, [location.state])

  const [playerData, setPlayerData] = useState(seededPlayerData ?? fallbackPlayerData)
  const [showTrailer, setShowTrailer] = useState(false)
  const [manualPlayback, setManualPlayback] = useState(false)
  const [hideCinema, setHideCinema] = useState(false)
  const [contentReturning, setContentReturning] = useState(false)
  const { countdownSeconds, clearCountdown, startCountdown } = useAutoplayCountdown(PLAYER_IDLE_DELAY_MS)
  const isHeroPlayer = id === 'hero'

  useEffect(() => {
    if (!id) {
      return
    }

    if (seededPlayerData && id === 'hero') {
      return
    }

    if (!tmdbBearerToken) {
      console.error('Missing VITE_TMDB_BEARER_TOKEN')
      return
    }

    Promise.all([
      fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${tmdbBearerToken}`,
        },
      }).then(res => res.json()),
      fetch(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${tmdbBearerToken}`,
        },
      }).then(res => res.json()),
    ])
      .then(([detailsRes, videosRes]) => {
        const video = videosRes.results?.find(item => item.site === 'YouTube') || videosRes.results?.[0]

        setPlayerData({
          key: video?.key ?? FALLBACK_VIDEO_KEY,
          name: video?.name ?? detailsRes.title ?? 'Trailer',
          title: detailsRes.title ?? seededPlayerData?.title ?? 'Untitled Feature',
          type: video?.type ?? 'Trailer',
          published_at: video?.published_at ?? detailsRes.release_date ?? '',
          overview: detailsRes.overview || seededPlayerData?.overview || FALLBACK_DESCRIPTION,
          backdropPath: detailsRes.backdrop_path
            ? `https://image.tmdb.org/t/p/original${detailsRes.backdrop_path}`
            : seededPlayerData?.backdropPath || FALLBACK_BACKDROP,
        })
      })
      .catch(err => {
        console.error(err)
        setPlayerData(seededPlayerData ?? fallbackPlayerData)
      })
  }, [id, seededPlayerData, tmdbBearerToken])

  useEffect(() => {
    const clearTimers = () => {
      clearCountdown()
      clearTimeout(returnTimerRef.current)
    }

    const startTrailerTimer = () => {
      startCountdown(() => {
        setShowTrailer(true)
        setHideCinema(true)
      })
    }

    const showCinemaAgain = () => {
      setHideCinema(false)
      setContentReturning(true)
      clearTimeout(returnTimerRef.current)
      returnTimerRef.current = setTimeout(() => {
        setContentReturning(false)
      }, PLAYER_RETURN_MS)
    }

    const handleActivity = () => {
      if (manualPlayback) {
        return
      }

      clearCountdown()

      if (showTrailer || hideCinema) {
        showCinemaAgain()
      }

      setShowTrailer(false)
      setManualPlayback(false)

      startTrailerTimer()
    }

    startTrailerTimer()
    window.addEventListener('mousemove', handleActivity)
    window.addEventListener('scroll', handleActivity, { passive: true })

    return () => {
      clearTimers()
      window.removeEventListener('mousemove', handleActivity)
      window.removeEventListener('scroll', handleActivity)
    }
  }, [clearCountdown, hideCinema, manualPlayback, playerData.key, showTrailer, startCountdown])

  const startManualPlayback = () => {
    clearCountdown()
    clearTimeout(returnTimerRef.current)
    setManualPlayback(true)
    setShowTrailer(true)
    setHideCinema(true)
    setContentReturning(false)
  }

  const iframeSrc = `https://www.youtube.com/embed/${playerData.key}?autoplay=${showTrailer ? 1 : 0}&mute=${manualPlayback ? 0 : 1}&controls=${manualPlayback ? 1 : 0}&fs=${manualPlayback ? 1 : 0}&loop=1&playlist=${playerData.key}&playsinline=1&rel=0`

  return (
    <div className={`player ${hideCinema ? 'player--immersive' : ''} ${contentReturning ? 'player--content-return' : ''}`}>
      <Navbar className="player__cinema navbar--player" />

      <button
        className='player__back'
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
          navigate(-1)
        }}
        type='button'
        aria-label='Go back'
      >
        <img src={back_arrow_icon} alt="" />
      </button>

      <div className={`player__backdrop ${isHeroPlayer ? 'player__backdrop--hero' : ''}`}>
        <button
          className={`player__backdrop-trigger ${showTrailer ? 'player__backdrop-trigger--inactive' : ''}`}
          onClick={startManualPlayback}
          type='button'
          aria-label={`Play ${playerData.title} trailer`}
        />
        <img
          src={playerData.backdropPath}
          alt={playerData.title}
          className={`player__poster ${isHeroPlayer ? 'player__poster--hero' : ''}`}
        />
      </div>

      <div className={`player__trailer ${showTrailer ? 'player__trailer--visible' : ''}`} aria-hidden={!showTrailer}>
        <iframe
          key={`${playerData.key}-${manualPlayback ? 'manual' : 'preview'}-${showTrailer ? 'visible' : 'hidden'}`}
          className='player__iframe'
          src={iframeSrc}
          title={playerData.name}
          allow='autoplay; fullscreen'
          allowFullScreen
          frameBorder="0"
        />
      </div>

      <div className={`player__overlay ${isHeroPlayer ? 'player__overlay--hero' : ''}`} />

      {!showTrailer && !manualPlayback ? (
        <CountdownBadge
          className="player__cinema player__countdown"
          spinnerClassName="player__countdown-spinner"
          spinnerSrc={spinner}
          seconds={countdownSeconds}
        />
      ) : null}

      <div className="player__cinema player__content">
        <p className='player__eyebrow'>{playerData.type}</p>
        <h1>{playerData.title}</h1>
        <p className='player__description'>{playerData.overview || FALLBACK_DESCRIPTION}</p>
        <button className='player__play' onClick={startManualPlayback} type='button'>
          <img src={play_icon} alt="" />
          Play Trailer
        </button>
      </div>

      <div className="player__cinema player__info">
        <p>{playerData.published_at.slice(0, 10) || 'Trailer date unavailable'}</p>
        <p>{playerData.name}</p>
      </div>
    </div>
  )
}

export default Player
