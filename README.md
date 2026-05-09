# Netflix-Inspired Streaming UI

A front-end streaming platform build focused on motion, interface polish, and interaction design without leaning on animation libraries or prebuilt templates.

This project started as a Netflix-inspired experience, but the real goal became building the details myself: custom autoplay behavior, layered cinematic transitions, route protection, interactive content rows, and responsive layout tuning across a wide range of screen sizes.

Instead of relying on GSAP, Framer Motion, or drag-and-drop UI kits, I built the motion and effects directly with React state, CSS transitions, transforms, overlays, masks, timers, and browser APIs. The result is a UI that feels animated and intentional while staying lightweight and understandable.

## Live Demo

[https://netflix-clone-delta-indol.vercel.app](https://netflix-clone-delta-indol.vercel.app)

## Core Features

- Firebase email/password authentication with sign up, login, logout, and protected routes
- Cinematic homepage hero with timed autoplay trailer behavior
- Interactive title-card rows powered by live TMDB data
- Wheel-scrollable horizontal content rails with hover reveal behavior
- Dedicated player pages with trailer playback, countdown states, and dynamic movie details
- Responsive navbar, footer, hero, and card-row behavior across desktop, tablet, and mobile
- Custom countdown spinner and state-driven loading behavior
- Hand-built visual effects using CSS masks, overlays, gradients, transforms, and timing logic

## Architecture Snapshot

Frontend:
- React 19
- Vite
- React Router 7
- CSS plus component-scoped styles

Auth and Data:
- Firebase Authentication
- Firestore for user profile data
- TMDB API for movie, backdrop, and trailer content

Experience Layer:
- Custom autoplay countdown hook in `src/hooks/useAutoplayCountdown.js`
- Reusable navbar, footer, countdown badge, and title-card components
- State-driven trailer, hover, and player transitions without animation libraries

## What I Built

### 1. Authentication Flow

I implemented a complete account flow using Firebase Authentication and Firestore.

That includes:

- create account
- sign in
- sign out
- protect private routes
- redirect authenticated users away from the login page

This gave the app real account handling and real routing behavior behind the UI.

### 2. Cinematic Hero Experience

The homepage hero is designed to feel more like a streaming platform landing experience than a standard banner.

Features include:

- autoplay countdown before the trailer starts
- custom Netflix-style spinner countdown UI
- idle-based video reveal
- still image restoration when activity returns
- click-to-play behavior that opens the dedicated player page
- masked hero image blending for a softer, more cinematic background fade

The transitions here were built from scratch with CSS gradients, masking, overlays, timing logic, and React state management.

### 3. Interactive Video Card Rows

The content rows are live, scrollable rails driven by TMDB data.

That includes:

- horizontally scrolling video cards
- wheel-to-scroll interaction
- hover-triggered reveal logic
- custom left/right navigation arrows
- dynamic routing into a dedicated player page

I wanted the rows to feel active and responsive, closer to a real streaming product than a basic card grid.

### 4. Full Player Page Behavior

Each title card routes into its own player page with movie-specific trailer and metadata handling.

That experience includes:

- autoplay preview mode
- manual trailer playback mode
- fade-out cinematic UI states
- text and interface restoration on activity
- reusable countdown logic
- hero-specific and movie-specific backdrop handling

The hero trailer route and the card-based player routes were handled separately so the experience could feel curated while still supporting dynamic content.

### 5. Responsive UI Tuning

I spent a lot of time tuning layout behavior across screen sizes instead of leaving responsiveness at the default stack-everything level.

That includes:

- large-screen hero caption repositioning
- ultra-wide row scaling
- mobile navbar label shortening
- mobile-safe countdown resizing
- preserving the profile avatar shape at smaller breakpoints
- tightening layout overflow and horizontal centering issues

The goal was to keep the interface feeling intentional at different sizes.

## Tech Stack

- React 19
- Vite
- React Router 7
- Firebase Auth
- Firestore
- TMDB API
- `react-firebase-hooks`
- `react-toastify`
- CSS

## Project Structure

```text
src/
  components/
    CountdownBadge/
    Footer/
    Navbar/
    TitleCards/
  hooks/
  pages/
    Home/
    Login/
    Player/
  firebase.jsx
```

- `src/pages/` contains the main application views.
- `src/components/` holds the reusable UI building blocks for navigation, footer, countdown, and content rails.
- `src/hooks/` contains the autoplay timing logic.
- `src/firebase.jsx` sets up the Firebase connection and auth usage.

## Running Locally

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

For a production build:

```bash
npm run build
```

## Current Scope

This project is strongest right now in:

- motion-heavy frontend work
- authenticated UI flow
- interactive content browsing
- responsive polish
- custom-built presentation details

It is not trying to be:

- a full streaming backend
- a subscription platform
- a watch-history and recommendation engine
- a content management system

That is intentional. The value here is in the interaction design, account flow, and product-style frontend behavior.

## Why This Project Stands Out

A lot of streaming clones stop at visual similarity. This one focuses on behavior: timed autoplay states, protected routes, interactive rails, responsive tuning, and motion built directly from state and CSS instead of delegated to animation libraries.

## Future Improvements

- code-splitting the larger client bundle
- richer account features like saved lists or watch history
- stronger error and loading states for API failures
- expanded player controls and metadata views

## Closing

This project reflects the kind of front-end work I enjoy most: interaction-heavy UI, motion with intent, product-level polish, and solving the details directly instead of covering them up with libraries.
