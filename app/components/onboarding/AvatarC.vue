<template>
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="bgC" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#081428"/>
        <stop offset="100%" stop-color="#040a14"/>
      </radialGradient>
      <radialGradient id="glowC" cx="50%" cy="30%" r="60%">
        <stop offset="0%" stop-color="#7ad4ff" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#7ad4ff" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <circle cx="100" cy="100" r="100" fill="url(#bgC)"/>
    <circle cx="100" cy="100" r="100" fill="url(#glowC)"/>
    <!-- Clean uniform -->
    <path d="M58 136 Q58 108 80 103 L100 98 L120 103 Q142 108 142 136 L144 185 L56 185 Z" fill="#081428" stroke="#7ad4ff" stroke-width="1"/>
    <!-- Buttoned front -->
    <path d="M84 110 L100 104 L116 110 L114 150 L100 154 L86 150 Z" fill="#060f20" stroke="#7ad4ff" stroke-width="1.2"/>
    <!-- Buttons -->
    <circle cx="100" cy="118" r="1.5" fill="#7ad4ff" opacity="0.7"/>
    <circle cx="100" cy="126" r="1.5" fill="#7ad4ff" opacity="0.7"/>
    <circle cx="100" cy="134" r="1.5" fill="#7ad4ff" opacity="0.7"/>
    <circle cx="100" cy="142" r="1.5" fill="#7ad4ff" opacity="0.7"/>
    <!-- Grid/data lines on suit -->
    <path d="M88 115 L112 115" stroke="#7ad4ff" stroke-width="0.4" opacity="0.3"/>
    <path d="M87 148 L113 148" stroke="#7ad4ff" stroke-width="0.4" opacity="0.3"/>
    <!-- Head -->
    <ellipse cx="100" cy="72" rx="24" ry="26" fill="#081428" stroke="#7ad4ff" stroke-width="1"/>
    <!-- Hair - neat, organized -->
    <path d="M76 65 Q78 44 100 42 Q122 44 124 65" fill="#04091a"/>
    <path d="M76 60 Q80 48 100 46 Q100 55 100 62" fill="#04091a"/>
    <!-- Clean part on side -->
    <path d="M78 55 L100 50" stroke="#7ad4ff" stroke-width="0.5" opacity="0.3"/>
    <!-- Neat precise eyes -->
    <ellipse cx="88" cy="72" rx="7" ry="5.5" fill="#04080f"/>
    <ellipse cx="112" cy="72" rx="7" ry="5.5" fill="#04080f"/>
    <ellipse cx="88" cy="72" rx="4.5" ry="3.5" fill="#102030"/>
    <ellipse cx="112" cy="72" rx="4.5" ry="3.5" fill="#102030"/>
    <ellipse cx="88" cy="72" rx="2.8" ry="2.8" fill="#7ad4ff" opacity="0.9"/>
    <ellipse cx="112" cy="72" rx="2.8" ry="2.8" fill="#7ad4ff" opacity="0.9"/>
    <circle cx="89.5" cy="70.5" r="0.8" fill="white" opacity="0.9"/>
    <circle cx="113.5" cy="70.5" r="0.8" fill="white" opacity="0.9"/>
    <!-- Straight eyebrows -->
    <path d="M82 65 L94 65" stroke="#7ad4ff" stroke-width="1.5" stroke-linecap="round" opacity="0.7"/>
    <path d="M106 65 L118 65" stroke="#7ad4ff" stroke-width="1.5" stroke-linecap="round" opacity="0.7"/>
    <!-- Neutral mouth -->
    <path d="M94 87 L106 87" stroke="#7ad4ff" stroke-width="1" stroke-linecap="round" opacity="0.6"/>
    <!-- Nose -->
    <path d="M98 78 L100 82 L102 78" stroke="#7ad4ff" stroke-width="0.7" fill="none" opacity="0.4"/>
    <!-- Neck -->
    <rect x="92" y="89" width="16" height="12" rx="3" fill="#081428" stroke="#7ad4ff" stroke-width="0.5"/>
    <!-- Floating grid/data nodes -->
    <rect x="40" y="68" width="8" height="8" rx="1" fill="none" stroke="#7ad4ff" stroke-width="0.8" opacity="0.4"/>
    <rect x="152" y="80" width="8" height="8" rx="1" fill="none" stroke="#7ad4ff" stroke-width="0.8" opacity="0.4"/>
    <rect x="42" y="118" width="6" height="6" rx="1" fill="none" stroke="#7ad4ff" stroke-width="0.8" opacity="0.3"/>
    <line x1="48" y1="72" x2="58" y2="80" stroke="#7ad4ff" stroke-width="0.4" opacity="0.3"/>
    <line x1="152" y1="88" x2="142" y2="96" stroke="#7ad4ff" stroke-width="0.4" opacity="0.3"/>
    <circle cx="158" cy="55" r="1.5" fill="#7ad4ff" opacity="0.5"/>
    <circle cx="40" cy="145" r="1" fill="#7ad4ff" opacity="0.4"/>
  </svg>
</template>
<style scoped>
svg { width: 100%; height: 100%; }
</style>
