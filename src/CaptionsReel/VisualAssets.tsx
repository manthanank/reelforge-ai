import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { antonFamily, montserratFamily } from './fonts';

// -------------------------------------------------------------
// 1. Sleek Brand / Creator Header (Top Safe Area)
// -------------------------------------------------------------
export const BrandHeader: React.FC<{ name?: string; handle?: string }> = ({
  name = 'CREATOR LABS',
  handle = '@creatorlabs',
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '60px',
        left: '50px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        zIndex: 45,
        pointerEvents: 'none',
      }}
    >
      {/* Brand Logo Avatar */}
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #00F0FF 0%, #BD00FF 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(0, 240, 255, 0.6)',
          border: '2px solid rgba(255, 255, 255, 0.4)',
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path
            d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
            fill="#FFFFFF"
            stroke="#04060A"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            fontFamily: montserratFamily,
            fontWeight: 900,
            fontSize: '24px',
            color: '#FFFFFF',
            letterSpacing: '1px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {name}
          {/* Verified Badge */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#38BDF8">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        </div>
        <div
          style={{
            fontFamily: montserratFamily,
            fontSize: '18px',
            color: 'rgba(255, 255, 255, 0.5)',
            letterSpacing: '0.5px',
          }}
        >
          {handle}
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 2. Animated Social Platform Cards (Instagram & YouTube)
// -------------------------------------------------------------
export const SocialLogosCard: React.FC<{ startFrame: number; endFrame: number }> = ({
  startFrame,
  endFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < startFrame || frame > endFrame) return null;

  const entrance = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 11, stiffness: 180, mass: 0.6 },
  });

  const exit = interpolate(
    frame,
    [endFrame - 10, endFrame],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const scale = entrance * exit;
  const floatY = Math.sin((frame - startFrame) * 0.1) * 8;

  return (
    <div
      style={{
        position: 'absolute',
        top: '28%',
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 35,
        transform: `translateY(${floatY}px) scale(${scale})`,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '40px',
          padding: '28px 50px',
          borderRadius: '36px',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(6, 11, 25, 0.9) 100%)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: '1.5px solid rgba(255, 255, 255, 0.18)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 50px rgba(236, 72, 153, 0.35)',
        }}
      >
        {/* Instagram Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '90px',
              height: '90px',
              borderRadius: '24px',
              background: 'linear-gradient(45deg, #F58529, #DD2A7B, #8134AF, #515BD4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 25px rgba(221, 42, 123, 0.6)',
            }}
          >
            <svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </div>
          <span style={{ fontFamily: montserratFamily, fontWeight: 900, fontSize: '20px', color: '#FFFFFF' }}>REELS</span>
        </div>

        {/* VS / PLUS divider */}
        <div style={{ fontFamily: antonFamily, fontSize: '42px', color: 'rgba(255,255,255,0.4)' }}>&</div>

        {/* YouTube Shorts Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '90px',
              height: '90px',
              borderRadius: '24px',
              background: '#FF0000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 25px rgba(255, 0, 0, 0.6)',
            }}
          >
            <svg width="50" height="50" viewBox="0 0 24 24" fill="#FFFFFF">
              <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 22c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 2c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z" />
            </svg>
          </div>
          <span style={{ fontFamily: montserratFamily, fontWeight: 900, fontSize: '20px', color: '#FFFFFF' }}>SHORTS</span>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 3. Animated Viral Growth Chart (SVG Hockey-Stick Curve)
// -------------------------------------------------------------
export const GrowthChartCard: React.FC<{ startFrame: number; endFrame: number }> = ({
  startFrame,
  endFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < startFrame || frame > endFrame) return null;

  const entrance = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 12, stiffness: 180, mass: 0.6 },
  });

  const exit = interpolate(
    frame,
    [endFrame - 10, endFrame],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Animate the line path drawing
  const pathProgress = interpolate(
    frame - startFrame,
    [10, 45],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        position: 'absolute',
        top: '27%',
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 35,
        transform: `scale(${entrance * exit})`,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          width: '760px',
          background: 'linear-gradient(135deg, rgba(10, 16, 32, 0.85) 0%, rgba(4, 8, 18, 0.95) 100%)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          borderRadius: '36px',
          border: '1.5px solid rgba(0, 240, 255, 0.3)',
          borderTop: '2px solid rgba(0, 240, 255, 0.7)',
          padding: '30px 40px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 50px rgba(0, 240, 255, 0.3)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <div style={{ fontFamily: montserratFamily, fontWeight: 900, fontSize: '20px', color: '#00F0FF', letterSpacing: '2px' }}>
              AUDIENCE RETENTION
            </div>
            <div style={{ fontFamily: antonFamily, fontSize: '48px', color: '#FFFFFF', letterSpacing: '1px' }}>
              +840% EXPONENTIAL REACH
            </div>
          </div>
          <div
            style={{
              padding: '8px 20px',
              borderRadius: '9999px',
              background: 'rgba(34, 197, 94, 0.2)',
              border: '1px solid #22C55E',
              fontFamily: montserratFamily,
              fontWeight: 900,
              fontSize: '18px',
              color: '#22C55E',
            }}
          >
            🚀 VIRAL SPIKE
          </div>
        </div>

        {/* Animated SVG Curve */}
        <svg viewBox="0 0 500 160" width="100%" height="160" style={{ overflow: 'visible' }}>
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#00F0FF" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#00F0FF" />
              <stop offset="50%" stopColor="#BD00FF" />
              <stop offset="100%" stopColor="#22C55E" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="0" y1="40" x2="500" y2="40" stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
          <line x1="0" y1="90" x2="500" y2="90" stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
          <line x1="0" y1="140" x2="500" y2="140" stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />

          {/* Area fill */}
          <path
            d="M 10 140 Q 180 135 280 90 T 490 20 L 490 150 L 10 150 Z"
            fill="url(#chartGrad)"
            opacity={pathProgress}
          />

          {/* The exponential growth curve */}
          <path
            d="M 10 140 Q 180 135 280 90 T 490 20"
            fill="none"
            stroke="url(#lineGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="600"
            strokeDashoffset={600 * (1 - pathProgress)}
            filter="drop-shadow(0 0 12px rgba(0, 240, 255, 0.8))"
          />

          {/* Peak glowing dot */}
          {pathProgress > 0.85 && (
            <circle cx="490" cy="20" r="9" fill="#22C55E" filter="drop-shadow(0 0 15px #22C55E)" />
          )}
        </svg>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 4. iOS Glassmorphic Viral Notification Banner
// -------------------------------------------------------------
export const NotificationBanner: React.FC<{ startFrame: number; endFrame: number }> = ({
  startFrame,
  endFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < startFrame || frame > endFrame) return null;

  const entrance = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 11, stiffness: 200, mass: 0.5 },
  });

  const exit = interpolate(
    frame,
    [endFrame - 10, endFrame],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        position: 'absolute',
        top: '28%',
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 35,
        transform: `scale(${entrance * exit}) translateY(${(1 - entrance) * -40}px)`,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          width: '740px',
          background: 'rgba(20, 28, 48, 0.85)',
          backdropFilter: 'blur(35px)',
          WebkitBackdropFilter: 'blur(35px)',
          borderRadius: '30px',
          border: '1.5px solid rgba(255, 255, 255, 0.2)',
          borderTop: '2px solid rgba(255, 255, 255, 0.45)',
          padding: '24px 32px',
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(255, 222, 0, 0.3)',
        }}
      >
        <div
          style={{
            width: '68px',
            height: '68px',
            borderRadius: '18px',
            background: 'linear-gradient(135deg, #FFDE00 0%, #FF9900 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '36px',
            boxShadow: '0 8px 25px rgba(255, 222, 0, 0.5)',
          }}
        >
          🔥
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontFamily: montserratFamily, fontWeight: 900, fontSize: '22px', color: '#FFFFFF' }}>
              VIRAL ALERT
            </span>
            <span style={{ fontFamily: montserratFamily, fontSize: '18px', color: 'rgba(255,255,255,0.4)' }}>
              Just now
            </span>
          </div>
          <div style={{ fontFamily: montserratFamily, fontSize: '24px', color: 'rgba(255, 255, 255, 0.85)', fontWeight: 600 }}>
            Your short gained <strong style={{ color: '#22C55E' }}>+54,200 views</strong> in 1 hour!
          </div>
        </div>
      </div>
    </div>
  );
};

