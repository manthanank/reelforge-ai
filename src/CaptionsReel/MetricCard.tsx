import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { antonFamily, montserratFamily } from './fonts';

interface MetricCardProps {
  label: string;
  value: string;
  subtext?: string;
  color?: string;
  startFrame: number;
  endFrame: number;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subtext,
  color = '#00F0FF',
  startFrame,
  endFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < startFrame || frame > endFrame) {
    return null;
  }

  // Entrance spring animation
  const entrance = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 12, stiffness: 180, mass: 0.6 },
  });

  // Exit fade
  const exit = interpolate(
    frame,
    [endFrame - 10, endFrame],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const scale = entrance * exit;
  const opacity = Math.min(entrance, exit);
  const translateY = interpolate(entrance, [0, 1], [60, 0]);

  // Subtle 3D floating wobble
  const rotateX = Math.sin((frame - startFrame) * 0.1) * 3;
  const rotateY = Math.cos((frame - startFrame) * 0.08) * 4;

  return (
    <div
      style={{
        position: 'absolute',
        top: '32%',
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 25,
        perspective: '1000px',
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          width: '780px',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.75) 0%, rgba(6, 11, 25, 0.85) 100%)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          borderRadius: '36px',
          border: '1.5px solid rgba(255, 255, 255, 0.16)',
          borderTop: '2px solid rgba(255, 255, 255, 0.35)',
          padding: '36px 44px',
          boxShadow: `
            0 25px 60px rgba(0, 0, 0, 0.7),
            0 0 50px ${color}33,
            inset 0 1px 0 rgba(255, 255, 255, 0.3)
          `,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          textAlign: 'center',
        }}
      >
        {/* Top Tag */}
        <div
          style={{
            fontFamily: montserratFamily,
            fontWeight: 800,
            fontSize: '24px',
            color: color,
            textTransform: 'uppercase',
            letterSpacing: '3px',
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <span
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: color,
              boxShadow: `0 0 12px ${color}`,
            }}
          />
          {label}
        </div>

        {/* Big Number / Value */}
        <div
          style={{
            fontFamily: antonFamily,
            fontSize: '110px',
            lineHeight: 1.0,
            color: '#FFFFFF',
            textShadow: `0 0 35px ${color}88, 0 4px 16px rgba(0,0,0,0.8)`,
            letterSpacing: '2px',
          }}
        >
          {value}
        </div>

        {/* Subtext */}
        {subtext && (
          <div
            style={{
              marginTop: '12px',
              fontFamily: montserratFamily,
              fontWeight: 700,
              fontSize: '28px',
              color: 'rgba(255, 255, 255, 0.75)',
              letterSpacing: '-0.5px',
            }}
          >
            {subtext}
          </div>
        )}
      </div>
    </div>
  );
};

