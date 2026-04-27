# React + Vite


## Get Started ##<a name="get-started"></a>

" https://netflix-clone-delta-indol.vercel.app "
- Live Vercel Deployed URL -


-- Table Of Contents --</br>
 [#Get Started](#-get-started)</br>
 [#TLDR Summary](#-tldr)</br>
 [#Highlights](#-highlights)</br>
 [#Tech Stack](#-tech-stack)</br>
 [#Closing](#-closing)</br>
 


*** Netflix-Inspired Streaming UI ***

## Summary ## <a name="summary"></a>

A front-end streaming platform build focused on motion, interface polish, and interaction design without leaning on animation libraries or prebuilt templates.

I built a Netflix-inspired streaming front end in React with Firebase authentication, protected routes, TMDB-powered content rows, cinematic autoplay trailer behavior. All major motion and UI effects were built from scratch with React, CSS, timers, overlays, and browser APIs rather than GSAP, Framer Motion, or templates.

This project started as a Netflix-inspired experience, but the real goal became building the details myself: custom autoplay behavior, layered cinematic transitions, route protection, interactive content rows, and responsive layout tuning across a wide range of screen sizes.

Instead of relying on GSAP, Framer Motion, or drag-and-drop UI kits, I built the motion and effects directly with React state, CSS transitions, transforms, overlays, masks, timers, and browser APIs. The result is a UI that feels animated and intentional while staying lightweight and understandable.


Future Improvements
code-splitting the larger client bundle
richer account features like saved lists or watch history
stronger error/loading states for API failures
expanding player controls and metadata views
This project reflects the kind of front-end work I enjoy most: interaction-heavy UI, motion with intent, product-level polish, and solving the details directly instead of covering them up with libraries.

## Highlights ##<a name="-highlights"></a>

Custom cinematic hero with timed autoplay trailer behavior
Firebase email/password authentication with sign up, login, logout, and protected routes
Interactive title-card rows powered by live TMDB data
Scrollable horizontal card marquee with wheel-based row scrolling and hover reveal behavior
Full player pages with trailer playback, countdown states, and dynamic movie details
Responsive navbar and footer behavior tuned across desktop, tablet, and mobile breakpoints
Countdown spinner states for autoplay and auth loading
Masked hero artwork and layered overlays built by hand in CSS
Built with React + Vite and deployed as a polished portfolio-ready front-end project
What I Built
1. Authentication Flow
I implemented a complete account flow using Firebase Authentication and Firestore:

create account
sign in
sign out
protect private routes
redirect authenticated users away from the login page
This means the app is not just a static mockup. It has real account handling and real routing behavior behind the UI.

2. Cinematic Hero Experience
The homepage hero is designed to feel more like a streaming platform landing experience than a standard banner.

## Features include: 

autoplay countdown before the trailer starts
custom Netflix-style spinner countdown UI
idle-based video reveal
still image restoration when activity returns
click-to-play behavior that opens the dedicated player page
masked hero image blending for a softer, more cinematic background fade
The transitions here were created from scratch with CSS gradients, masking, overlays, timing logic, and React state management rather than animation packages.

3. Interactive Video Card Rows
The content rows are not static screenshots. They are live, scrollable rows driven by TMDB data.

Each row includes:

horizontally scrolling video cards
wheel-to-scroll interaction
hover-triggered reveal logic
custom left/right navigation arrows
dynamic routing into a dedicated player page
I wanted the rows to feel active and responsive, closer to a real streaming product than a basic card grid.

4. Full Player Page Behavior
Each title card routes into its own player page with movie-specific trailer and metadata handling.

That player experience includes:

autoplay preview mode
manual trailer playback mode
fade-out cinematic UI states
text and interface restoration on activity
reusable countdown logic
hero-specific and movie-specific backdrop handling
The hero trailer route and the card-based player routes were handled separately so the experience could feel curated while still supporting dynamic content.

5. Responsive UI Tuning
I spent a lot of time tuning layout behavior across screen sizes instead of leaving responsiveness at the default “stack everything” level.

That includes:

large-screen hero caption repositioning
ultra-wide row scaling
mobile navbar label shortening
mobile-safe countdown resizing
preserving the profile avatar shape at smaller breakpoints
tightening layout overflow and horizontal centering issues
The goal was not just mobile compatibility. It was to keep the interface feeling intentional at different sizes.

Technical Notes
Built Without Animation Libraries
One of the main engineering decisions in this project was to avoid using GSAP, Framer Motion, or off-the-shelf motion templates.

All major interaction work was built with:

## Tech Stack ##<a name="-tech-stack"></a>


React hooks
component state
timers
IntersectionObserver
CSS transforms
CSS transitions
blur, opacity, scale, and overlay layering
mask-image and gradient composition
That mattered to me because I wanted to understand and control the behavior directly rather than outsourcing the feel of the product to a library.

Data + Services
Firebase for authentication and user account management
Firestore for storing user profile data
TMDB API for movie data, backdrops, and trailer content
Stack
React
Vite
React Router
Firebase Auth
Firestore
TMDB API
CSS
Why This Project Stands Out
This project is strongest in the details.


## Closing ##<a name="-closing"></a>


A lot of front-end clones stop at visual similarity. I wanted this one to behave like a product:

protected user flows instead of a static page
interaction-rich content rows instead of flat cards
timed autoplay states instead of a fixed hero image
custom motion built from first principles instead of library presets
responsive adjustments that were actively tuned rather than left generic
From an engineering perspective, the value here is not just that it looks good. It is that the UI behavior was built deliberately.






This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
# netflix-clone
