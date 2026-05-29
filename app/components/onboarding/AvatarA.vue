<template>
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="bgA" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#28081a"/>
        <stop offset="100%" stop-color="#140508"/>
      </radialGradient>
      <radialGradient id="glowA" cx="50%" cy="30%" r="60%">
        <stop offset="0%" stop-color="#ff5fb1" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="#ff5fb1" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <circle cx="100" cy="100" r="100" fill="url(#bgA)"/>
    <circle cx="100" cy="100" r="100" fill="url(#glowA)"/>
    <!-- Outfit - artistic flowing -->
    <path d="M58 138 Q58 110 80 105 L100 100 L120 105 Q142 110 142 138 L145 185 L55 185 Z" fill="#200810" stroke="#ff5fb1" stroke-width="1"/>
    <!-- Decorative front -->
    <path d="M80 112 L100 106 L120 112 L118 150 L100 155 L82 150 Z" fill="#180610" stroke="#ff5fb1" stroke-width="1.5"/>
    <!-- Artistic paint splatter pattern -->
    <circle cx="95" cy="125" r="2" fill="#ff5fb1" opacity="0.6"/>
    <circle cx="105" cy="120" r="1.5" fill="#ff5fb1" opacity="0.5"/>
    <circle cx="100" cy="132" r="1" fill="#ff5fb1" opacity="0.7"/>
    <circle cx="90" cy="135" r="1.5" fill="#ff5fb1" opacity="0.4"/>
    <circle cx="110" cy="130" r="1" fill="#ff5fb1" opacity="0.5"/>
    <path d="M92 128 Q96 122 102 127 Q106 131 100 135 Q94 138 92 128 Z" fill="none" stroke="#ff5fb1" stroke-width="1" opacity="0.5"/>
    <!-- Long flowing hair -->
    <path d="M72 78 Q65 110 68 150 Q74 148 76 120 Q78 100 80 88" fill="#1a0510" stroke="#ff5fb1" stroke-width="0.5"/>
    <path d="M128 78 Q135 110 132 150 Q126 148 124 120 Q122 100 120 88" fill="#1a0510" stroke="#ff5fb1" stroke-width="0.5"/>
    <!-- Head -->
    <ellipse cx="100" cy="72" rx="24" ry="26" fill="#200810" stroke="#ff5fb1" stroke-width="1"/>
    <!-- Hair top - long pink -->
    <path d="M76 70 Q78 42 100 40 Q122 42 124 70" fill="#2a0815" stroke="#ff5fb1" stroke-width="0.5"/>
    <path d="M78 55 Q82 38 88 36 Q87 50 84 58" fill="#3a0a1a"/>
    <path d="M92 48 Q94 33 100 32 Q102 44 100 52" fill="#3a0a1a"/>
    <path d="M108 48 Q106 33 100 32 Q100 44 103 52" fill="#3a0a1a"/>
    <!-- Hair accessories - star pins -->
    <polygon points="82,52 84,47 86,52 81,49 87,49" fill="#ff5fb1" opacity="0.9"/>
    <polygon points="114,55 116,50 118,55 113,52 119,52" fill="#ff5fb1" opacity="0.7"/>
    <!-- Eyes - large expressive -->
    <ellipse cx="88" cy="72" rx="8" ry="7" fill="#150508"/>
    <ellipse cx="112" cy="72" rx="8" ry="7" fill="#150508"/>
    <ellipse cx="88" cy="72" rx="5" ry="5" fill="#5a1030"/>
    <ellipse cx="112" cy="72" rx="5" ry="5" fill="#5a1030"/>
    <ellipse cx="88" cy="72" rx="3" ry="3" fill="#ff5fb1" opacity="0.9"/>
    <ellipse cx="112" cy="72" rx="3" ry="3" fill="#ff5fb1" opacity="0.9"/>
    <circle cx="90" cy="70" r="1" fill="white" opacity="0.9"/>
    <circle cx="114" cy="70" r="1" fill="white" opacity="0.9"/>
    <!-- Lower eyelash -->
    <path d="M82 76 Q88 79 94 76" stroke="#ff5fb1" stroke-width="0.8" fill="none" opacity="0.5"/>
    <path d="M106 76 Q112 79 118 76" stroke="#ff5fb1" stroke-width="0.8" fill="none" opacity="0.5"/>
    <!-- Eyebrows - curved -->
    <path d="M82 64 Q88 61 94 63" stroke="#ff5fb1" stroke-width="1.2" fill="none" stroke-linecap="round" opacity="0.8"/>
    <path d="M106 63 Q112 61 118 64" stroke="#ff5fb1" stroke-width="1.2" fill="none" stroke-linecap="round" opacity="0.8"/>
    <!-- Nose small -->
    <path d="M98 79 L100 82 L102 79" stroke="#ff5fb1" stroke-width="0.6" fill="none" opacity="0.4"/>
    <!-- Smile -->
    <path d="M93 88 Q100 93 107 88" stroke="#ff5fb1" stroke-width="1.2" fill="none" stroke-linecap="round" opacity="0.7"/>
    <!-- Neck -->
    <rect x="93" y="90" width="14" height="12" rx="3" fill="#200810" stroke="#ff5fb1" stroke-width="0.5"/>
    <!-- Floating sparkles -->
    <text x="145" y="65" font-size="10" fill="#ff5fb1" opacity="0.7">✦</text>
    <text x="38" y="75" font-size="8" fill="#ff5fb1" opacity="0.5">✧</text>
    <text x="150" y="105" font-size="6" fill="#ff5fb1" opacity="0.4">✦</text>
    <circle cx="40" cy="120" r="1.5" fill="#ff5fb1" opacity="0.5"/>
    <circle cx="160" cy="130" r="1" fill="#ff5fb1" opacity="0.4"/>
  </svg>
</template>
<style scoped>
svg { width: 100%; height: 100%; }
</style>
