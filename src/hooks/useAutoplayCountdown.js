import { useCallback, useEffect, useRef, useState } from 'react'

const COUNTDOWN_TICK_MS = 250

const getCountdownSeconds = (delayMs) => Math.ceil(delayMs / 1000)

function useAutoplayCountdown(delayMs) {
  const timeoutRef = useRef(null)
  const intervalRef = useRef(null)
  const [countdownSeconds, setCountdownSeconds] = useState(getCountdownSeconds(delayMs))

  const clearCountdown = useCallback(() => {
    clearTimeout(timeoutRef.current)
    clearInterval(intervalRef.current)
  }, [])

  const resetCountdown = useCallback(() => {
    setCountdownSeconds(getCountdownSeconds(delayMs))
  }, [delayMs])

  const startCountdown = useCallback((onComplete) => {
    const startTime = Date.now()

    clearCountdown()
    resetCountdown()

    intervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime
      const remainingMs = Math.max(delayMs - elapsed, 0)
      setCountdownSeconds(Math.ceil(remainingMs / 1000))

      if (remainingMs <= 0) {
        clearInterval(intervalRef.current)
      }
    }, COUNTDOWN_TICK_MS)

    timeoutRef.current = window.setTimeout(() => {
      clearInterval(intervalRef.current)
      onComplete?.()
    }, delayMs)
  }, [clearCountdown, delayMs, resetCountdown])

  useEffect(() => clearCountdown, [clearCountdown])

  return {
    countdownSeconds,
    clearCountdown,
    resetCountdown,
    startCountdown,
  }
}

export default useAutoplayCountdown
