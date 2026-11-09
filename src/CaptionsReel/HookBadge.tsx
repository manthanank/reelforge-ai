import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { antonFamily, montserratFamily } from './fonts';

interface HookBadgeProps {
  badge: string;
  headline: string;
  durationInFrames: number;
}

export const HookBadge: React.FC<HookBadgeProps> = ({
  badge,
  headline,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring animation
  const entrance = spring({
    frame,
    fps,
    config: {
      damping: 12,
      stiffness: 110,
      mass: 0.7,
    },
  });

  // Exit fade & slide-up animation
  const exitProgress = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  if (frame > durationInFrames) {
    return null;
  }

  const scale = entrance * exitProgress;
  const opacity = Math.min(entrance, exitProgress);
  const translateY = interpolate(entrance, [0, 1], [-60, 0]);

  // Pulsing radar ping for the live badge dot
  const pingScale = (frame % 30) / 15 + 1;
  const pingOpacity = 1 - (frame % 30) / 30;

  return (
    <div
      style={{
        position: 'absolute',
        top: 155,
        left: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 40,
        transform: `translateY(${translateY}px) scale(${scale})`,
        opacity,
        padding: '0 40px',
        pointerEvents: 'none',
      }}
    >
      {/* Frosted Glass Tag Pill */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '12px',
          background: 'linear-gradient(135deg, rgba(255, 0, 122, 0.25) 0%, rgba(189, 0, 255, 0.25) 100%)',
          backdropFilter: 'blur(25px)',
          WebkitBackdropFilter: 'blur(25px)',
          color: '#FFFFFF',
          padding: '12px 32px',
          borderRadius: '9999px',
          border: '1.5px solid rgba(255, 255, 255, 0.25)',
          borderTop: '2px solid rgba(255, 255, 255, 0.5)',
          boxShadow: '0 12px 35px rgba(255, 0, 122, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
        }}
      >
        {/* Pulsing Radar Ping Dot */}
        <div style={{ position: 'relative', width: '14px', height: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              backgroundColor: '#FF007A',
              transform: `scale(${pingScale})`,
              opacity: pingOpacity,
            }}
          />
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#FF007A',
              boxShadow: '0 0 10px #FF007A',
            }}
          />
        </div>

        <span
          style={{
            fontFamily: antonFamily,
            fontSize: '36px',
            letterSpacing: '2.5px',
            textTransform: 'uppercase',
          }}
        >
          {badge}
        </span>
      </div>

      {/* Main Headline */}
      {headline && (
        <div
          style={{
            marginTop: '20px',
            fontFamily: antonFamily,
            fontSize: '56px',
            lineHeight: 1.1,
            color: '#FFFFFF',
            textAlign: 'center',
            textShadow: '0 0 40px rgba(0, 240, 255, 0.45), 0 6px 20px rgba(0,0,0,0.9)',
            maxWidth: '920px',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
          }}
        >
          {headline}
        </div>
      )}
    </div>
  );
};
