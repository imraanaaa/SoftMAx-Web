function IconBase({ children, className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export function SearchIcon(props) {
  return (
    <IconBase {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </IconBase>
  )
}

export function BellIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M6.5 9.5a5.5 5.5 0 1 1 11 0c0 6 2 7.5 2 7.5h-15s2-1.5 2-7.5" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </IconBase>
  )
}

export function ImageIcon(props) {
  return (
    <IconBase {...props}>
      <rect x="3.5" y="4.5" width="17" height="15" rx="3" />
      <circle cx="9" cy="10" r="1.2" />
      <path d="m6.5 16 4-4 2.8 2.8 2.2-2.2 2 2.4" />
    </IconBase>
  )
}

export function CommentIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M6 18.5 3.5 20V6.5A2.5 2.5 0 0 1 6 4h12a2.5 2.5 0 0 1 2.5 2.5v8A2.5 2.5 0 0 1 18 17H8Z" />
    </IconBase>
  )
}

export function HeartIcon(props) {
  return (
    <IconBase {...props}>
      <path d="m12 20-1.1-1C5.1 13.8 2 11 2 7.5A4.5 4.5 0 0 1 6.5 3c1.7 0 3.4.8 4.5 2.1A5.95 5.95 0 0 1 15.5 3 4.5 4.5 0 0 1 20 7.5c0 3.5-3.1 6.3-8.9 11.5Z" />
    </IconBase>
  )
}

export function RankIcon(props) {
  return (
    <IconBase {...props}>
      <path d="m6 18 6-12 6 12" />
      <path d="M8.5 13h7" />
    </IconBase>
  )
}

export function ShareIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M14 5h6v6" />
      <path d="M10 14 20 4" />
      <path d="M20 13.5V18A2 2 0 0 1 18 20H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h4.5" />
    </IconBase>
  )
}

export function HomeIcon(props) {
  return (
    <IconBase {...props}>
      <path d="m4 10 8-6 8 6" />
      <path d="M6 9.5V20h12V9.5" />
    </IconBase>
  )
}

export function GridIcon(props) {
  return (
    <IconBase {...props}>
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="3" width="8" height="8" rx="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" />
      <rect x="13" y="13" width="8" height="8" rx="1.5" />
    </IconBase>
  )
}

export function MessageIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M5.5 18.5 3 20V6.5A2.5 2.5 0 0 1 5.5 4h13A2.5 2.5 0 0 1 21 6.5V15a2.5 2.5 0 0 1-2.5 2.5Z" />
    </IconBase>
  )
}

export function StarIcon(props) {
  return (
    <IconBase {...props}>
      <path d="m12 3 2.8 5.6 6.2.9-4.5 4.4 1 6.1L12 17l-5.5 3 1-6.1L3 9.5l6.2-.9Z" />
    </IconBase>
  )
}

export function XLogoIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.78 3h2.98l-6.52 7.45L22 21h-6.08l-4.76-6.23L5.7 21H2.7l6.97-7.97L2 3h6.23l4.3 5.68L17.78 3Zm-1.04 16.2h1.65L7.33 4.7H5.55Z" />
    </svg>
  )
}

export function InstagramLogoIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="3.9" />
      <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function GoldBadgeIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="m12 1.9 2.25 1.3 2.59-.42 1.08 2.38 2.38 1.08-.42 2.59L22.1 12l-1.3 2.25.42 2.59-2.38 1.08-1.08 2.38-2.59-.42L12 22.1l-2.25-1.3-2.59.42-1.08-2.38-2.38-1.08.42-2.59L1.9 12l1.3-2.25-.42-2.59 2.38-1.08 1.08-2.38 2.59.42Z"
      />
      <path
        d="m8.4 12.2 2.2 2.15 5.05-4.95"
        fill="none"
        stroke="#080604"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
