import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './TitleCards.css'

const TitleCards = ({title, category}) => {
const [apiData, setApiData] = useState([])
const cardsRef = useRef(null);
const hoverTimerRef = useRef(null);
const tmdbBearerToken = import.meta.env.VITE_TMDB_BEARER_TOKEN;
const navigate = useNavigate();

const handleWheel = (event) => {
  const cardsEl = cardsRef.current;
  if (!cardsEl) return;

  const isHorizontalGesture = Math.abs(event.deltaX) > Math.abs(event.deltaY);
  if (isHorizontalGesture) {
    return;
  }

  event.preventDefault();
  cardsEl.scrollLeft += event.deltaY;
};

const scrollCards = (direction) => {
  if (!cardsRef.current) return;

  const scrollAmount = cardsRef.current.clientWidth * 0.8;
  cardsRef.current.scrollBy({
    left: direction === 'left' ? -scrollAmount : scrollAmount,
    behavior: 'smooth',
  });
};

const revealCard = (cardEl) => {
  const cardsEl = cardsRef.current;
  if (!cardsEl || !cardEl) return;

  const rowRect = cardsEl.getBoundingClientRect();
  const cardRect = cardEl.getBoundingClientRect();
  const edgePadding = 24;

  if (cardRect.left < rowRect.left + edgePadding) {
    cardsEl.scrollBy({
      left: cardRect.left - rowRect.left - edgePadding,
      behavior: 'smooth',
    });
    return;
  }

  if (cardRect.right > rowRect.right - edgePadding) {
    cardsEl.scrollBy({
      left: cardRect.right - rowRect.right + edgePadding,
      behavior: 'smooth',
    });
  }
};

const handleCardEnter = (event) => {
  const cardEl = event.currentTarget;

  clearTimeout(hoverTimerRef.current);
  hoverTimerRef.current = setTimeout(() => {
    revealCard(cardEl);
  }, 240);
};

const handleCardLeave = () => {
  clearTimeout(hoverTimerRef.current);
};

// const handleWheel = (event) =>{
//       event.preventDefault();
//       cardsRef.current.scrollLeft += event.deltaY;
// }

useEffect(() => {
  if (!tmdbBearerToken) {
    console.error('Missing VITE_TMDB_BEARER_TOKEN');
    return;
  }

  fetch(`https://api.themoviedb.org/3/movie/${category ? category : "now_playing"}?language=en-US&page=1`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${tmdbBearerToken}`
    }
  })
  .then(res => res.json())
  .then(res => setApiData(res.results))
  .catch(error => console.error(error));

  const cardsEl = cardsRef.current;
  if (!cardsEl) return;

  cardsEl.addEventListener('wheel', handleWheel, { passive: false });

  return () => {
    clearTimeout(hoverTimerRef.current);
    cardsEl.removeEventListener('wheel', handleWheel);
  };
}, [category, tmdbBearerToken]);

const shouldReverse =
  !title || title === 'Featured Movies';

const displayData = shouldReverse ? [...apiData].reverse() : apiData;


  return (
    <div className='title__cards'>
      <h2> { title ? title : "Popular on Netflix" } </h2>
      <div className="title__cards-row">
        <button
          className="cards__arrow cards__arrow--left"
          type="button"
          aria-label="Scroll left"
          onClick={() => scrollCards('left')}
        >
          &#8249;
        </button>
        <div className="card__list" ref={cardsRef}>
          {displayData.map((card, index) => {
              return <div
                className="card"
                key={index}
                onMouseEnter={handleCardEnter}
                onMouseLeave={handleCardLeave}
                onClick={() =>
                  navigate(`/player/${card.id}`, {
                    state: {
                      title: card.title ?? card.original_title ?? 'Untitled Feature',
                      name: card.title ?? card.original_title ?? 'Untitled Feature',
                      overview: card.overview,
                      backdropPath: card.backdrop_path
                        ? `https://image.tmdb.org/t/p/original${card.backdrop_path}`
                        : undefined,
                    },
                  })
                }
              ><img src={`https://image.tmdb.org/t/p/w500`+card.backdrop_path} alt="" />
              <p>{card.original_title}</p></div>
          })}
        </div>
        <button
          className="cards__arrow cards__arrow--right"
          type="button"
          aria-label="Scroll right"
          onClick={() => scrollCards('right')}
        >
          &#8250;
        </button>
      </div>
    </div>
  )
}

export default TitleCards
