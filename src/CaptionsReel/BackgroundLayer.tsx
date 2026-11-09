import React, { useMemo } from 'react';
import { interpolate, OffthreadVideo, useCurrentFrame, useVideoConfig } from 'remotion';

interface BackgroundLayerProps {
  type: 'cinematic-gradient' | 'particles' | 'video';
  videoUrl?: string;
  overlayOpacity?: number;
  backgroundColor?: string;
}

export const BackgroundLayer: React.FC<BackgroundLayerProps> = ({
  type,
  videoUrl,
  overlayOpacity = 0.5,
  backgroundColor = '#04060A',
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Floating plasma orbs movement
  const t = frame * 0.015;
  const orb1X = Math.sin(t) * 160 + width * 0.35;
  const orb1Y = Math.cos(t * 0.8) * 220 + height * 0.3;

  const orb2X = Math.cos(t * 0.7) * 200 + width * 0.65;
  const orb2Y = Math.sin(t * 0.9) * 240 + height * 0.7;

  const orb3X = Math.sin(t * 0.5) * 180 + width * 0.5;
  const orb3Y = Math.cos(t * 0.6) * 160 + height * 0.5;

  // Camera slow cinematic push-in (scale 1.0 -> 1.06)
  const cameraZoom = interpolate(frame, [0, 900], [1.0, 1.08], {
    extrapolateRight: 'clamp',
  });

  // Perspective grid forward motion
  const gridOffsetY = (frame * 3.5) % 80;

  // Seeded deterministic floating dust particles
  const particles = useMemo(() => {
    return Array.from({ length: 28 }).map((_, i) => ({
      x: ((i * 137.5) % 100),
      speedY: 0.8 + ((i * 31) % 5) * 0.3,
      size: 4 + ((i * 17) % 6),
      opacity: 0.25 + ((i * 23) % 5) * 0.12,
      color: i % 3 === 0 ? '#00F0FF' : i % 3 === 1 ? '#BD00FF' : '#FF007A',
    }));
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor,
        overflow: 'hidden',
        zIndex: 0,
        transform: `scale(${cameraZoom})`,
        transformOrigin: 'center center',
      }}
    >
      {type === 'video' && videoUrl ? (
        <OffthreadVideo
          src={videoUrl}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        /* Cyberpunk Neon Mesh & Perspective Matrix */
        <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
          {/* Base gradient */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at 50% 25%, #0d1222 0%, #030408 85%)',
            }}
          />

          {/* Glowing Plasma Orb 1: Electric Cyan */}
          <div
            style={{
              position: 'absolute',
              left: `${orb1X}px`,
              top: `${orb1Y}px`,
              width: 750,
              height: 750,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0, 240, 255, 0.4) 0%, rgba(0, 240, 255, 0) 70%)',
              filter: 'blur(100px)',
              transform: 'translate(-50%, -50%)',
            }}
          />

          {/* Glowing Plasma Orb 2: Ultra Violet */}
          <div
            style={{
              position: 'absolute',
              left: `${orb2X}px`,
              top: `${orb2Y}px`,
              width: 800,
              height: 800,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(189, 0, 255, 0.35) 0%, rgba(189, 0, 255, 0) 70%)',
              filter: 'blur(110px)',
              transform: 'translate(-50%, -50%)',
            }}
          />

          {/* Glowing Plasma Orb 3: Hot Crimson / Neon Pink */}
          <div
            style={{
              position: 'absolute',
              left: `${orb3X}px`,
              top: `${orb3Y}px`,
              width: 650,
              height: 650,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255, 0, 122, 0.28) 0%, rgba(255, 0, 122, 0) 70%)',
              filter: 'blur(100px)',
              transform: 'translate(-50%, -50%)',
            }}
          />

          {/* 3D Perspective Grid Floor (Cyberpunk Horizon) */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '45%',
              perspective: '600px',
              overflow: 'hidden',
              maskImage: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: '-100px -200px',
                transform: 'rotateX(72deg)',
                transformOrigin: 'bottom center',
                backgroundImage: `
                  linear-gradient(rgba(0, 240, 255, 0.18) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0, 240, 255, 0.18) 1px, transparent 1px)
                `,
                backgroundSize: '70px 70px',
                backgroundPosition: `0px ${gridOffsetY}px`,
              }}
            />
          </div>

          {/* Floating Bokeh Dust Particles */}
          {particles.map((p, idx) => {
            const currentY = ((100 - (frame * p.speedY * 0.15 + p.x * 2)) % 100 + 100) % 100;
            const floatX = p.x + Math.sin(frame * 0.03 + idx) * 3;
            const pulseOpacity = p.opacity * (0.6 + 0.4 * Math.sin(frame * 0.08 + idx));

            return (
              <div
                key={`bokeh-${idx}`}
                style={{
                  position: 'absolute',
                  left: `${floatX}%`,
                  top: `${currentY}%`,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  borderRadius: '50%',
                  backgroundColor: p.color,
                  opacity: pulseOpacity,
                  filter: `blur(${p.size > 6 ? 3 : 1}px)`,
                  boxShadow: `0 0 16px ${p.color}`,
                }}
              />
            );
          })}
        </div>
      )}

      {/* Film Vignette & Contrast Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(circle at 50% 50%, rgba(0,0,0,${overlayOpacity * 0.3}) 25%, rgba(4,6,10,0.85) 75%, rgba(0,0,0,0.95) 100%),
            linear-gradient(to bottom, rgba(4,6,10,0.7) 0%, transparent 20%, transparent 80%, rgba(4,6,10,0.8) 100%)
          `,
        }}
      />
    </div>
  );
};
