<template>
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="bgI" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#120a28"/>
        <stop offset="100%" stop-color="#080514"/>
      </radialGradient>
      <radialGradient id="glowI" cx="50%" cy="30%" r="60%">
        <stop offset="0%" stop-color="#a073ff" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="#a073ff" stop-opacity="0"/>
      </radialGradient>
      <filter id="glowFI">
        <feGaussianBlur stdDeviation="2" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <circle cx="100" cy="100" r="100" fill="url(#bgI)"/>
    <circle cx="100" cy="100" r="100" fill="url(#glowI)"/>
    <!-- Robe/coat -->
    <path d="M55 135 Q55 108 78 103 L100 98 L122 103 Q145 108 145 135 L148 185 L52 185 Z" fill="#150d25" stroke="#a073ff" stroke-width="1"/>
    <!-- Inner shirt -->
    <path d="M82 112 L100 106 L118 112 L116 148 L100 152 L84 148 Z" fill="#0d0820" stroke="#a073ff" stroke-width="1.5"/>
    <!-- Rune symbols on chest -->
    <text x="93" y="128" font-size="8" fill="#a073ff" opacity="0.8" font-family="serif">✦</text>
    <text x="100" y="138" font-size="6" fill="#a073ff" opacity="0.6" font-family="serif">⬡</text>
    <path d="M87 132 L113 132" stroke="#a073ff" stroke-width="0.5" opacity="0.4"/>
    <!-- Glasses -->
    <rect x="79" y="68" width="16" height="11" rx="4" fill="none" stroke="#a073ff" stroke-width="1.5"/>
    <rect x="105" y="68" width="16" height="11" rx="4" fill="none" stroke="#a073ff" stroke-width="1.5"/>
    <line x1="95" y1="73" x2="105" y2="73" stroke="#a073ff" stroke-width="1.2"/>
    <line x1="79" y1="73" x2="74" y2="72" stroke="#a073ff" stroke-width="1"/>
    <line x1="121" y1="73" x2="126" y2="72" stroke="#a073ff" stroke-width="1"/>
    <!-- Neck -->
    <rect x="92" y="88" width="16" height="13" rx="3" fill="#150d25" stroke="#a073ff" stroke-width="0.5"/>
    <!-- Head -->
    <ellipse cx="100" cy="72" rx="25" ry="27" fill="#150d25" stroke="#a073ff" stroke-width="1"/>
    <!-- Hair - longer, swept back -->
    <path d="M75 65 Q77 42 100 41 Q123 42 125 65" fill="#080514" stroke="#a073ff" stroke-width="0.5"/>
    <path d="M125 55 Q132 48 128 38 Q120 50 122 58" fill="#080514"/>
    <path d="M112 46 Q116 34 108 33 Q106 44 110 50" fill="#080514"/>
    <!-- Eyes behind glasses -->
    <ellipse cx="87" cy="73" rx="5" ry="4" fill="#0a0518"/>
    <ellipse cx="113" cy="73" rx="5" ry="4" fill="#0a0518"/>
    <ellipse cx="87" cy="73" rx="3" ry="2.5" fill="#3d1a7a"/>
    <ellipse cx="113" cy="73" rx="3" ry="2.5" fill="#3d1a7a"/>
    <ellipse cx="87" cy="73" rx="1.8" ry="1.8" fill="#a073ff" opacity="0.9"/>
    <ellipse cx="113" cy="73" rx="1.8" ry="1.8" fill="#a073ff" opacity="0.9"/>
    <circle cx="88" cy="72" r="0.7" fill="white" opacity="0.9"/>
    <circle cx="114" cy="72" r="0.7" fill="white" opacity="0.9"/>
    <!-- Eyebrows -->
    <path d="M82 65 L93 66" stroke="#a073ff" stroke-width="1.2" stroke-linecap="round" opacity="0.7"/>
    <path d="M107 66 L118 65" stroke="#a073ff" stroke-width="1.2" stroke-linecap="round" opacity="0.7"/>
    <!-- Nose -->
    <path d="M98 79 L100 83 L102 79" stroke="#a073ff" stroke-width="0.8" fill="none" opacity="0.4"/>
    <!-- Slight smile -->
    <path d="M94 88 Q100 91 106 88" stroke="#a073ff" stroke-width="1" fill="none" stroke-linecap="round" opacity="0.6"/>
    <!-- Shoulder coat collar -->
    <path d="M56 132 Q44 128 42 118 Q46 108 58 112 L68 122 Z" fill="#150d25" stroke="#a073ff" stroke-width="1"/>
    <path d="M144 132 Q156 128 158 118 Q154 108 142 112 L132 122 Z" fill="#150d25" stroke="#a073ff" stroke-width="1"/>
    <!-- Floating rune particles -->
    <text x="148" y="70" font-size="8" fill="#a073ff" opacity="0.7">✦</text>
    <text x="38" y="90" font-size="6" fill="#a073ff" opacity="0.5">⬡</text>
    <text x="152" y="110" font-size="5" fill="#a073ff" opacity="0.4">✧</text>
    <circle cx="42" cy="140" r="1" fill="#a073ff" opacity="0.5"/>
    <circle cx="158" cy="55" r="1.5" fill="#a073ff" opacity="0.6"/>
  </svg>
</template>
<style scoped>
svg { width: 100%; height: 100%; }
</style>
