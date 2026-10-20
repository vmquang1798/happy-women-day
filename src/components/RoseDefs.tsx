import React from 'react';

export const RoseDefs: React.FC = () => (
  <svg width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }} aria-hidden="true">
    <defs>
      <radialGradient id="pg" cx="50%" cy="60%" r="60%">
        <stop offset="0%" stopColor="#e3577b" />
        <stop offset="100%" stopColor="#9c2346" />
      </radialGradient>
      <radialGradient id="pg2" cx="50%" cy="40%" r="70%">
        <stop offset="0%" stopColor="#f48aa2" />
        <stop offset="100%" stopColor="#c2375b" />
      </radialGradient>
      <symbol id="rose" viewBox="0 0 200 260">
        <path
          d="M100 120 C 98 170, 104 210, 100 258"
          stroke="#5f8a5a"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M101 185 C 125 170, 150 172, 165 160 C 150 190, 120 195, 101 190 Z"
          fill="#7aa66f"
        />
        <path
          d="M99 210 C 75 196, 52 198, 38 186 C 52 214, 80 218, 99 215 Z"
          fill="#6c9862"
        />
        <path
          d="M100 30 C 150 30, 165 80, 150 110 C 138 135, 62 135, 50 110 C 35 80, 50 30, 100 30 Z"
          fill="url(#pg)"
        />
        <path
          d="M100 48 C 135 50, 142 85, 128 104 C 116 120, 84 120, 72 104 C 58 85, 65 50, 100 48 Z"
          fill="url(#pg2)"
        />
        <path
          d="M100 62 C 122 66, 124 90, 112 98 C 104 104, 92 102, 88 94 C 82 82, 92 72, 104 78 C 110 82, 106 90, 100 88"
          stroke="#8e1f3f"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M58 70 C 40 95, 55 128, 100 134 C 145 128, 160 95, 142 70 C 150 110, 120 124, 100 124 C 80 124, 50 110, 58 70 Z"
          fill="#a62a4d"
          opacity=".85"
        />
      </symbol>
    </defs>
  </svg>
);
