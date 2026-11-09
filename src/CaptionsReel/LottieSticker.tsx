import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export type StickerType = 'fire' | 'warning' | 'rocket' | 'sparkles' | 'checkmark' | 'lightning';

interface LottieStickerProps {
  type: StickerType;
  size?: number;
}

export const LottieSticker: React.FC<LottieStickerProps> = ({
  type,
  size = 90,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Snappy spring pop-in physics
  const pop = spring({
    frame,
    fps,
    config: { damping: 9, stiffness: 220, mass: 0.5 },
  });

  // Continuous ambient pulsation / breathing
  const pulse = Math.sin(frame * 0.2) * 0.08 + 1;
  const rotation = Math.sin(frame * 0.15) * 6;

  const scale = pop * pulse;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: `${size}px`,
        height: `${size}px`,
        transform: `scale(${scale}) rotate(${rotation}deg)`,
        filter: 'drop-shadow(0 6px 20px rgba(0, 0, 0, 0.6))',
      }}
    >
      {type === 'fire' && (
        <svg viewBox="0 0 64 64" width="100%" height="100%">
          <defs>
            <linearGradient id="fireGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="50%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#FDE047" />
            </linearGradient>
          </defs>
          <path
            fill="url(#fireGrad)"
            d="M32 4C32 4 39 17 39 26C39 30 36 34 33 36C35 29 32 23 32 23C32 23 27 30 27 38C27 45 32 50 32 50C22 50 16 41 16 33C16 19 32 4 32 4Z"
          />
          <path
            fill="#FEF08A"
            d="M32 28C32 28 35 34 35 39C35 43 32 46 32 46C27 46 25 42 25 38C25 32 32 28 32 28Z"
          />
        </svg>
      )}

      {type === 'warning' && (
        <svg viewBox="0 0 64 64" width="100%" height="100%">
          <path
            d="M32 8L56 52H8L32 8Z"
            fill="#FBBF24"
            stroke="#F59E0B"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <line
            x1="32"
            y1="24"
            x2="32"
            y2="38"
            stroke="#1F2937"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle cx="32" cy="46" r="3" fill="#1F2937" />
        </svg>
      )}

      {type === 'rocket' && (
        <svg viewBox="0 0 64 64" width="100%" height="100%">
          <path
            d="M32 6C32 6 46 16 46 38L32 46L18 38C18 16 32 6 32 6Z"
            fill="#38BDF8"
            stroke="#0284C7"
            strokeWidth="3"
          />
          <circle cx="32" cy="24" r="6" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2" />
          <path d="M18 38L8 46L18 48Z" fill="#EF4444" />
          <path d="M46 38L56 46L46 48Z" fill="#EF4444" />
          <path d="M26 48L32 60L38 48Z" fill="#F59E0B" />
        </svg>
      )}

      {type === 'lightning' && (
        <svg viewBox="0 0 64 64" width="100%" height="100%">
          <path
            d="M38 4L16 34H32L26 60L48 30H32L38 4Z"
            fill="#FACC15"
            stroke="#EAB308"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      )}

      {type === 'checkmark' && (
        <svg viewBox="0 0 64 64" width="100%" height="100%">
          <circle cx="32" cy="32" r="26" fill="#22C55E" />
          <path
            d="M20 32L28 40L44 24"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}

      {type === 'sparkles' && (
        <svg viewBox="0 0 64 64" width="100%" height="100%">
          <path
            d="M32 4L36 24L56 28L36 32L32 52L28 32L8 28L28 24Z"
            fill="#00F0FF"
            filter="drop-shadow(0 0 8px #00F0FF)"
          />
          <circle cx="48" cy="12" r="3" fill="#FDE047" />
          <circle cx="16" cy="48" r="3" fill="#FDE047" />
        </svg>
      )}
    </div>
  );
};

