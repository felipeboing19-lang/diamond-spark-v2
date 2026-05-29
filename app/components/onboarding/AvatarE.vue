<template>
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="bgE" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#1a1408"/>
        <stop offset="100%" stop-color="#0d0a04"/>
      </radialGradient>
      <radialGradient id="glowE" cx="50%" cy="30%" r="60%">
        <stop offset="0%" stop-color="#ffc14d" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="#ffc14d" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <circle cx="100" cy="100" r="100" fill="url(#bgE)"/>
    <circle cx="100" cy="100" r="100" fill="url(#glowE)"/>
    <!-- Sharp business suit -->
    <path d="M56 134 Q56 106 78 101 L100 96 L122 101 Q144 106 144 134 L146 185 L54 185 Z" fill="#14100a" stroke="#ffc14d" stroke-width="1"/>
    <!-- Suit lapels -->
    <path d="M78 101 L88 120 L100 104 L112 120 L122 101 L116 130 L100 136 L84 130 Z" fill="#0d0a06" stroke="#ffc14d" stroke-width="1"/>
    <!-- Tie -->
    <path d="M97 112 L100 106 L103 112 L101 140 L100 142 L99 140 Z" fill="#ffc14d" opacity="0.7"/>
    <!-- Gold pin on lapel -->
    <polygon points="86,116 88,111 90,116 85,113 91,113" fill="#ffc14d" opacity="0.9"/>
    <!-- Head -->
    <ellipse cx="100" cy="72" rx="25" ry="27" fill="#14100a" stroke="#ffc14d" stroke-width="1"/>
    <!-- Hair - slicked back confident -->
    <path d="M75 65 Q80 44 100 42 Q120 44 125 65" fill="#0a0806"/>
    <path d="M75 58 Q78 46 100 44 Q100 56 98 62" fill="#0a0806"/>
    <!-- Side swept -->
    <path d="M75 60 Q70 52 72 44 Q78 52 80 60" fill="#0a0806"/>
    <!-- Sharp confident eyes -->
    <ellipse cx="88" cy="72" rx="7" ry="5.5" fill="#080604"/>
    <ellipse cx="112" cy="72" rx="7" ry="5.5" fill="#080604"/>
    <ellipse cx="88" cy="72" rx="4.5" ry="3.5" fill="#3a2800"/>
    <ellipse cx="112" cy="72" rx="4.5" ry="3.5" fill="#3a2800"/>
    <ellipse cx="88" cy="72" rx="2.8" ry="2.8" fill="#ffc14d" opacity="0.9"/>
    <ellipse cx="112" cy="72" rx="2.8" ry="2.8" fill="#ffc14d" opacity="0.9"/>
    <circle cx="89.5" cy="70.5" r="0.8" fill="white" opacity="0.9"/>
    <circle cx="113.5" cy="70.5" r="0.8" fill="white" opacity="0.9"/>
    <!-- Strong eyebrows -->
    <path d="M81 65 L93 66" stroke="#ffc14d" stroke-width="2" stroke-linecap="round" opacity="0.8"/>
    <path d="M107 66 L119 65" stroke="#ffc14d" stroke-width="2" stroke-linecap="round" opacity="0.8"/>
    <!-- Confident smirk -->
    <path d="M94 87 Q103 91 108 87" stroke="#ffc14d" stroke-width="1.2" fill="none" stroke-linecap="round" opacity="0.7"/>
    <!-- Nose -->
    <path d="M98 78 L100 82 L102 78" stroke="#ffc14d" stroke-width="0.8" fill="none" opacity="0.4"/>
    <!-- Neck -->
    <rect x="92" y="89" width="16" height="12" rx="3" fill="#14100a" stroke="#ffc14d" stroke-width="0.5"/>
    <!-- Crown/rocket floating -->
    <path d="M148 50 L152 38 L156 50 L160 42 L158 55 L148 55 L146 42 Z" fill="#ffc14d" opacity="0.6"/>
    <circle cx="152" cy="58" r="2" fill="#ffc14d" opacity="0.5"/>
    <!-- Gold particles -->
    <circle cx="42" cy="70" r="1.5" fill="#ffc14d" opacity="0.6"/>
    <circle cx="158" cy="100" r="1" fill="#ffc14d" opacity="0.5"/>
    <circle cx="38" cy="130" r="1.5" fill="#ffc14d" opacity="0.4"/>
    <text x="38" y="95" font-size="8" fill="#ffc14d" opacity="0.5">◆</text>
  </svg>
</template>
<style scoped>
svg { width: 100%; height: 100%; }
</style>
