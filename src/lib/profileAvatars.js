const createAvatarDataUri = (label, topColor, bottomColor) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">
      <defs>
        <linearGradient id="bg" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stop-color="${topColor}" />
          <stop offset="100%" stop-color="${bottomColor}" />
        </linearGradient>
      </defs>
      <rect width="96" height="96" rx="18" fill="url(#bg)" />
      <circle cx="48" cy="36" r="16" fill="rgba(255,255,255,0.92)" />
      <path d="M21 78c4-15 18-22 27-22s23 7 27 22" fill="rgba(255,255,255,0.92)" />
      <text x="48" y="88" text-anchor="middle" fill="rgba(0,0,0,0.48)" font-family="Arial, sans-serif" font-size="10" font-weight="700">${label}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const PROFILE_AVATARS = [
  {
    id: "crimson",
    label: "Crimson",
    src: createAvatarDataUri("A1", "#ff6a88", "#aa1d37"),
  },
  {
    id: "gold",
    label: "Gold",
    src: createAvatarDataUri("A2", "#f9d976", "#f39f02"),
  },
  {
    id: "ocean",
    label: "Ocean",
    src: createAvatarDataUri("A3", "#73c8ff", "#2455d6"),
  },
  {
    id: "violet",
    label: "Violet",
    src: createAvatarDataUri("A4", "#c084fc", "#5b21b6"),
  },
];

export default PROFILE_AVATARS;
