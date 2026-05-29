<template>
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="avatar-svg">
    <defs>
      <radialGradient id="bgR" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#0a1628"/>
        <stop offset="100%" stop-color="#050a14"/>
      </radialGradient>
      <radialGradient id="glowR" cx="50%" cy="30%" r="60%">
        <stop offset="0%" stop-color="#3fb4ff" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="#3fb4ff" stop-opacity="0"/>
      </radialGradient>
      <filter id="glowFilterR">
        <feGaussianBlur stdDeviation="2" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <!-- Background -->
    <circle cx="100" cy="100" r="100" fill="url(#bgR)"/>
    <circle cx="100" cy="100" r="100" fill="url(#glowR)"/>
    <!-- Body armor -->
    <path d="M60 140 Q60 110 80 105 L100 100 L120 105 Q140 110 140 140 L140 180 L60 180 Z" fill="#1a2a3a" stroke="#3fb4ff" stroke-width="1"/>
    <!-- Chest plate -->
    <path d="M75 115 L100 108 L125 115 L122 145 L100 150 L78 145 Z" fill="#0d1f30" stroke="#3fb4ff" stroke-width="1.5"/>
    <!-- Chest glow lines -->
    <path d="M90 125 L110 125" stroke="#3fb4ff" stroke-width="1" opacity="0.8"/>
    <path d="M85 132 L115 132" stroke="#3fb4ff" stroke-width="0.8" opacity="0.6"/>
    <path d="M88 139 L112 139" stroke="#3fb4ff" stroke-width="0.8" opacity="0.4"/>
    <!-- Diamond emblem on chest -->
    <polygon points="100,118 107,125 100,132 93,125" fill="none" stroke="#3fb4ff" stroke-width="1.5" filter="url(#glowFilterR)"/>
    <polygon points="100,121 104,125 100,129 96,125" fill="#3fb4ff" opacity="0.6"/>
    <!-- Neck -->
    <rect x="92" y="88" width="16" height="14" rx="3" fill="#1a2a3a" stroke="#3fb4ff" stroke-width="0.5"/>
    <!-- Head -->
    <ellipse cx="100" cy="72" rx="26" ry="28" fill="#1a2a3a" stroke="#3fb4ff" stroke-width="1"/>
    <!-- Hair - spiky short dark -->
    <path d="M74 68 Q76 45 100 44 Q124 45 126 68" fill="#0a1218" stroke="#3fb4ff" stroke-width="0.5"/>
    <path d="M78 58 L74 44 L82 56" fill="#0a1218"/>
    <path d="M88 52 L86 38 L93 51" fill="#0a1218"/>
    <path d="M100 50 L100 36 L105 50" fill="#0a1218"/>
    <path d="M112 52 L114 38 L107 51" fill="#0a1218"/>
    <path d="M122 58 L126 44 L118 56" fill="#0a1218"/>
    <!-- Eyes - sharp Solo Leveling style -->
    <ellipse cx="88" cy="72" rx="7" ry="5" fill="#0a0f18"/>
    <ellipse cx="112" cy="72" rx="7" ry="5" fill="#0a0f18"/>
    <ellipse cx="88" cy="72" rx="4" ry="3.5" fill="#1a4a6a"/>
    <ellipse cx="112" cy="72" rx="4" ry="3.5" fill="#1a4a6a"/>
    <ellipse cx="88" cy="72" rx="2.5" ry="2.5" fill="#3fb4ff" opacity="0.9"/>
    <ellipse cx="112" cy="72" rx="2.5" ry="2.5" fill="#3fb4ff" opacity="0.9"/>
    <circle cx="89.5" cy="70.5" r="0.8" fill="white" opacity="0.9"/>
    <circle cx="113.5" cy="70.5" r="0.8" fill="white" opacity="0.9"/>
    <!-- Eyebrows sharp -->
    <path d="M82 66 L94 67" stroke="#3fb4ff" stroke-width="1.5" stroke-linecap="round" opacity="0.8"/>
    <path d="M106 67 L118 66" stroke="#3fb4ff" stroke-width="1.5" stroke-linecap="round" opacity="0.8"/>
    <!-- Nose -->
    <path d="M98 78 L100 82 L102 78" stroke="#3fb4ff" stroke-width="0.8" fill="none" opacity="0.5"/>
    <!-- Mouth - serious expression -->
    <path d="M93 87 L107 87" stroke="#3fb4ff" stroke-width="1" stroke-linecap="round" opacity="0.6"/>
    <!-- Shoulder pads -->
    <path d="M60 115 Q50 110 48 125 Q50 135 62 132 L68 118 Z" fill="#1a2a3a" stroke="#3fb4ff" stroke-width="1"/>
    <path d="M140 115 Q150 110 152 125 Q150 135 138 132 L132 118 Z" fill="#1a2a3a" stroke="#3fb4ff" stroke-width="1"/>
    <!-- Arms -->
    <path d="M62 132 Q50 145 55 165 L68 162 Q65 148 72 140 Z" fill="#1a2a3a" stroke="#3fb4ff" stroke-width="0.8"/>
    <path d="M138 132 Q150 145 145 165 L132 162 Q135 148 128 140 Z" fill="#1a2a3a" stroke="#3fb4ff" stroke-width="0.8"/>
    <!-- Glowing particles -->
    <circle cx="155" cy="60" r="1.5" fill="#3fb4ff" opacity="0.8"/>
    <circle cx="45" cy="80" r="1" fill="#3fb4ff" opacity="0.6"/>
    <circle cx="160" cy="100" r="1" fill="#3fb4ff" opacity="0.5"/>
    <circle cx="40" cy="130" r="1.5" fill="#3fb4ff" opacity="0.4"/>
  </svg>
</template>
<style scoped>
.avatar-svg { width: 100%; height: 100%; }
</style>
