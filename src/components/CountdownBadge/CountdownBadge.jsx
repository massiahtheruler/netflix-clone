import React from 'react'

function CountdownBadge({ className, spinnerClassName, spinnerSrc, seconds }) {
  return (
    <div className={className} aria-live="polite">
      <img src={spinnerSrc} alt="" className={spinnerClassName} />
      <span>{seconds}s</span>
    </div>
  )
}

export default CountdownBadge
