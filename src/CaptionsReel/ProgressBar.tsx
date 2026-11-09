import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

interface ProgressBarProps {
  color?: string;
  height?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  color = 'linear-gradient(90deg, #00F0FF 0%, #BD00FF 50%, #FF007A 100%)',
  height = 8,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const progress = Math.min(100, Math.max(0, (frame / durationInFrames) * 100));

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: `${height}px`,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        zIndex: 50,
      }}
    >
      {/* The progressing gradient bar */}
      <div
        style={{
          position: 'relative',
          width: `${progress}%`,
          height: '100%',
          background: color,
          boxShadow: '0 0 20px rgba(0, 240, 255, 0.9)',
          borderRadius: '0 4px 4px 0',
          transition: 'width 0.04s linear',
        }}
      >
        {/* Glowing Head Particle */}
        <div
          style={{
            position: 'absolute',
            right: '-4px',
            top: '-4px',
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            boxShadow: '0 0 15px #00F0FF, 0 0 30px #BD00FF',
          }}
        />
      </div>
    </div>
  );
};
