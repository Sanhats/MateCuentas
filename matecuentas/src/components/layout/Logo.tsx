import React from 'react'

export default function Logo() {
  return (
    <svg width="50" height="50" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" stroke="#6E8B3D" strokeWidth="4"/>
      <path d="M30 70C30 55 40 40 50 40C60 40 70 55 70 70" stroke="#8B5A2B" strokeWidth="4" strokeLinecap="round"/>
      <line x1="50" y1="40" x2="50" y2="70" stroke="#8B5A2B" strokeWidth="4" strokeLinecap="round"/>
      <circle cx="50" cy="30" r="5" fill="#6E8B3D"/>
    </svg>
  )
}

