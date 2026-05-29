<template>
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="bgS" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#081a10"/>
        <stop offset="100%" stop-color="#030d07"/>
      </radialGradient>
      <radialGradient id="glowS" cx="50%" cy="30%" r="60%">
        <stop offset="0%" stop-color="#3fe0a8" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="#3fe0a8" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <circle cx="100" cy="100" r="100" fill="url(#bgS)"/>
    <circle cx="100" cy="100" r="100" fill="url(#glowS)"/>
    <!-- Jacket open - casual confident -->
    <path d="M58 135 Q58 108 80 103 L100 98 L120 103 Q142 108 142 135 L145 185 L55 185 Z" fill="#081a10" stroke="#3fe0a8" stroke-width="1"/>
    <!-- Inner shirt with symbol -->
    <path d="M82 110 L100 104 L118 110 L116 148 L100 153 L84 148 Z" fill="#061510" stroke="#3fe0a8" stroke-width="1.5"/>
    <!-- Heart/connection symbol -->
    <path d="M95 125 Q100 120 105 125 Q110 130 100 137 Q90 130 95 125 Z" fill="none" stroke="#3fe0a8" stroke-width="1.5" opacity="0.8"/>
    <path d="M95 125 Q100 120 105 125 Q110 130 100 137 Q90 130 95 125 Z" fill="#3fe0a8" opacity="0.2"/>
    <path d="M88 132 L112 132" stroke="#3fe0a8" stroke-width="0.5" opacity="0.3"/>
    <!-- Head -->
    <ellipse cx="100" cy="72" rx="25" ry="27" fill="#081a10" stroke="#3fe0a8" stroke-width="1"/>
    <!-- Hair - natural relaxed -->
    <path d="M75 66 Q77 44 100 42 Q123 44 125 66" fill="#041008"/>
    <path d="M76 56 Q80 42 86 40 Q84 52 82 60" fill="#041008"/>
    <path d="M124 56 Q120 42 114 40 Q116 52 118 60" fill="#041008"/>
    <path d="M90 48 Q92 36 100 35 Q102 46 100 52" fill="#041008"/>
    <!-- Friendly eyes - slightly wider -->
    <ellipse cx="88" cy="72" rx="7.5" ry="6.5" fill="#030d07"/>
    <ellipse cx="112" cy="72" rx="7.5" ry="6.5" fill="#030d07"/>
    <ellipse cx="88" cy="72" rx="4.5" ry="4" fill="#0d3a20"/>
    <ellipse cx="112" cy="72" rx="4.5" ry="4" fill="#0d3a20"/>
    <ellipse cx="88" cy="72" rx="2.8" ry="2.8" fill="#3fe0a8" opacity="0.9"/>
    <ellipse cx="112" cy="72" rx="2.8" ry="2.8" fill="#3fe0a8" opacity="0.9"/>
    <circle cx="89.5" cy="70.5" r="0.8" fill="white" opacity="0.9"/>
    <circle cx="113.5" cy="70.5" r="0.8" fill="white" opacity="0.9"/>
    <!-- Eyebrows - relaxed friendly -->
    <path d="M82 65 Q88 63 94 65" stroke="#3fe0a8" stroke-width="1.3" fill="none" stroke-linecap="round" opacity="0.7"/>
    <path d="M106 65 Q112 63 118 65" stroke="#3fe0a8" stroke-width="1.3" fill="none" stroke-linecap="round" opacity="0.7"/>
    <!-- Warm smile -->
    <path d="M91 87 Q100 93 109 87" stroke="#3fe0a8" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.8"/>
    <!-- Cheek blush -->
    <ellipse cx="80" cy="80" rx="6" ry="3" fill="#3fe0a8" opacity="0.12"/>
    <ellipse cx="120" cy="80" rx="6" ry="3" fill="#3fe0a8" opacity="0.12"/>
    <!-- Nose -->
    <path d="M98 79 L100 82 L102 79" stroke="#3fe0a8" stroke-width="0.7" fill="none" opacity="0.4"/>
    <!-- Neck -->
    <rect x="92" y="90" width="16" height="11" rx="3" fill="#081a10" stroke="#3fe0a8" stroke-width="0.5"/>
    <!-- Collar open jacket -->
    <path d="M80 103 L90 115 L100 104 L110 115 L120 103" fill="none" stroke="#3fe0a8" stroke-width="1" opacity="0.6"/>
    <!-- Floating connection nodes -->
    <circle cx="45" cy="75" r="3" fill="none" stroke="#3fe0a8" stroke-width="1" opacity="0.5"/>
    <circle cx="155" cy="85" r="3" fill="none" stroke="#3fe0a8" stroke-width="1" opacity="0.5"/>
    <circle cx="40" cy="120" r="2" fill="none" stroke="#3fe0a8" stroke-width="1" opacity="0.4"/>
    <line x1="48" y1="75" x2="58" y2="90" stroke="#3fe0a8" stroke-width="0.5" opacity="0.3"/>
    <line x1="152" y1="88" x2="142" y2="100" stroke="#3fe0a8" stroke-width="0.5" opacity="0.3"/>
    <circle cx="155" cy="55" r="1.5" fill="#3fe0a8" opacity="0.6"/>
    <circle cx="42" cy="145" r="1" fill="#3fe0a8" opacity="0.4"/>
  </svg>
</template>
<style scoped>
svg { width: 100%; height: 100%; }
</style>
