import React, { useState } from 'react';
import { Sparkles, Heart } from 'lucide-react';

export const CuteIceCreamAnimation: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleMascotClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setClickCount((prev) => prev + 1);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newHeart = { id: Date.now(), x, y };
    setHearts((prev) => [...prev, newHeart]);
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 900);
  };

  const getSpeechBubbleText = () => {
    if (clickCount === 0) return "Hi there! 👋 Tap me!";
    if (clickCount % 4 === 1) return "Yum! So fresh & sweet! 🍦";
    if (clickCount % 4 === 2) return "Made with love in Tiruppur! ❤️";
    if (clickCount % 4 === 3) return "Order your favorite scoop! ✨";
    return "Yay! Ice cream time! 🎉";
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-2 sm:p-4">
      {/* Speech Bubble */}
      <div
        key={clickCount}
        className="mb-2 px-3.5 py-1.5 bg-white text-pink-900 text-xs font-black rounded-full shadow-lg border border-pink-200 flex items-center gap-1.5 z-20 cursor-pointer select-none hover:bg-pink-50 transition-all transform active:scale-95"
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
        <span>{getSpeechBubbleText()}</span>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white rotate-45 border-r border-b border-pink-200"></div>
      </div>

      {/* Floating Hearts effect on click */}
      <div className="absolute inset-0 pointer-events-none z-30">
        {hearts.map((h) => (
          <div
            key={h.id}
            style={{ left: `${h.x}px`, top: `${h.y}px` }}
            className="absolute text-pink-500 animate-float-heart"
          >
            <Heart className="w-5 h-5 fill-pink-500" />
          </div>
        ))}
      </div>

      {/* Main Animated Ice Cream Mascot Container */}
      <div
        className="relative cursor-pointer select-none group animate-float-mascot transition-transform duration-200 active:scale-90 hover:scale-105"
        onClick={handleMascotClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Soft Glowing Background Aura */}
        <div className="absolute inset-0 bg-white/25 rounded-full blur-xl group-hover:bg-white/45 transition-all"></div>

        {/* Floating Sparkles around Ice Cream */}
        <div className="absolute -inset-4 pointer-events-none animate-spin" style={{ animationDuration: '12s' }}>
          <span className="absolute top-0 left-2 text-sm">✨</span>
          <span className="absolute bottom-2 right-0 text-xs">⭐</span>
          <span className="absolute top-1/2 -left-3 text-xs">💖</span>
        </div>

        {/* Cute Ice Cream SVG Illustration */}
        <div className="relative w-32 h-44 sm:w-40 sm:h-52 filter drop-shadow-xl">
          <svg viewBox="0 0 200 260" className="w-full h-full">
            <defs>
              {/* Scoop Gradients */}
              <linearGradient id="strawberryScoop" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF85A2" />
                <stop offset="100%" stopColor="#FF477E" />
              </linearGradient>
              <linearGradient id="vanillaScoop" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF9E6" />
                <stop offset="100%" stopColor="#FFEAA7" />
              </linearGradient>
              <linearGradient id="coneGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F5CD79" />
                <stop offset="100%" stopColor="#E67E22" />
              </linearGradient>
              <linearGradient id="cherryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF5252" />
                <stop offset="100%" stopColor="#D50000" />
              </linearGradient>
            </defs>

            {/* Cone */}
            <path
              d="M 60 140 L 100 240 L 140 140 Z"
              fill="url(#coneGradient)"
              stroke="#D35400"
              strokeWidth="3"
            />
            {/* Cone Waffle Pattern */}
            <path d="M 70 165 L 125 200" stroke="#D35400" strokeWidth="2" strokeOpacity="0.5" />
            <path d="M 80 190 L 115 215" stroke="#D35400" strokeWidth="2" strokeOpacity="0.5" />
            <path d="M 130 165 L 75 200" stroke="#D35400" strokeWidth="2" strokeOpacity="0.5" />
            <path d="M 120 190 L 85 215" stroke="#D35400" strokeWidth="2" strokeOpacity="0.5" />

            {/* Bottom Scoop (Vanilla / Cream) */}
            <path
              d="M 50 140 C 40 140, 40 110, 65 110 C 70 95, 100 95, 110 110 C 130 95, 160 110, 150 140 C 160 150, 130 155, 100 152 C 70 155, 40 150, 50 140 Z"
              fill="url(#vanillaScoop)"
              stroke="#F39C12"
              strokeWidth="2"
            />

            {/* Top Scoop (Strawberry Pink) */}
            <path
              d="M 55 110 C 45 80, 75 50, 100 50 C 125 50, 155 80, 145 110 C 155 125, 130 130, 100 128 C 70 130, 45 125, 55 110 Z"
              fill="url(#strawberryScoop)"
            />

            {/* Sprinkles on Pink Scoop */}
            <rect x="75" y="70" width="8" height="3" rx="1.5" fill="#FFEAA7" transform="rotate(-20 75 70)" />
            <rect x="110" y="65" width="8" height="3" rx="1.5" fill="#74B9FF" transform="rotate(30 110 65)" />
            <rect x="125" y="85" width="8" height="3" rx="1.5" fill="#55E6C1" transform="rotate(-15 125 85)" />
            <rect x="85" y="90" width="8" height="3" rx="1.5" fill="#FD79A8" transform="rotate(45 85 90)" />

            {/* Shiny Cherry on Top */}
            <path d="M 100 50 Q 115 35 125 20" stroke="#27AE60" strokeWidth="3" fill="none" strokeLinecap="round" />
            <circle cx="100" cy="48" r="14" fill="url(#cherryGradient)" />
            <circle cx="96" cy="44" r="3" fill="#FFFFFF" opacity="0.8" />

            {/* Cute Face on Strawberry Scoop */}
            {isHovered ? (
              // Happy Winking eyes on hover
              <>
                <path d="M 78 85 Q 85 76 92 85" stroke="#2C3E50" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                <path d="M 108 85 Q 115 76 122 85" stroke="#2C3E50" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              </>
            ) : (
              // Big round shiny anime eyes
              <>
                <circle cx="85" cy="85" r="5.5" fill="#2C3E50" />
                <circle cx="83.5" cy="83.5" r="2" fill="#FFFFFF" />
                <circle cx="115" cy="85" r="5.5" fill="#2C3E50" />
                <circle cx="113.5" cy="83.5" r="2" fill="#FFFFFF" />
              </>
            )}

            {/* Rosy Cheeks */}
            <ellipse cx="76" cy="92" rx="5" ry="3" fill="#FF7675" opacity="0.75" />
            <ellipse cx="124" cy="92" rx="5" ry="3" fill="#FF7675" opacity="0.75" />

            {/* Smile Mouth */}
            <path d="M 94 92 Q 100 100 106 92" stroke="#2C3E50" strokeWidth="3" fill="none" strokeLinecap="round" />
          </svg>
        </div>

        {/* Base Shadow */}
        <div className="w-20 sm:w-24 h-2.5 bg-black/20 rounded-full mx-auto mt-1 blur-xs animate-shadow-pulse" />
      </div>
    </div>
  );
};
