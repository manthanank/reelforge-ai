import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { montserratFamily } from './fonts';
import { LottieSticker } from './LottieSticker';
import { CaptionPhrase, CaptionWord } from './types';

interface CaptionsLayerProps {
  captions: CaptionPhrase[];
  theme: {
    highlightColor: string;
    accentColor: string;
    textColor: string;
    dimTextColor: string;
    fontSize: number;
    captionYPosition: number; // percentage from top
  };
}

export const CaptionsLayer: React.FC<CaptionsLayerProps> = ({
  captions,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Find the active phrase
  const activePhrase = captions.find(
    (phrase) => frame >= phrase.startFrame && frame <= phrase.endFrame
  );

  if (!activePhrase) {
    return null;
  }

  // Find the active word to extract dynamic glow accent
  const activeWord = activePhrase.words.find(
    (w) => frame >= w.startFrame && frame <= w.endFrame
  );
  const activeGlowColor = activeWord?.highlightColor || theme.highlightColor;

  // Spring entrance for the phrase container
  const phraseEntrance = spring({
    frame: frame - activePhrase.startFrame,
    fps,
    config: { damping: 13, stiffness: 160, mass: 0.5 },
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: `${theme.captionYPosition}%`,
        left: 0,
        right: 0,
        transform: 'translateY(-50%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 30,
        padding: '0 40px',
        perspective: '1000px',
      }}
    >
      {/* 3D Glassmorphic Container Card */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '20px 24px',
          maxWidth: '980px',
          padding: '28px 44px',
          borderRadius: '36px',
          background: 'linear-gradient(135deg, rgba(13, 20, 38, 0.75) 0%, rgba(5, 9, 20, 0.82) 100%)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: '1.5px solid rgba(255, 255, 255, 0.16)',
          borderTop: '2px solid rgba(255, 255, 255, 0.35)',
          boxShadow: `
            0 24px 60px rgba(0, 0, 0, 0.75),
            0 0 55px ${activeGlowColor}33,
            inset 0 1px 0 rgba(255, 255, 255, 0.25)
          `,
          transform: `scale(${phraseEntrance})`,
          transition: 'box-shadow 0.15s ease',
        }}
      >
        {activePhrase.words.map((word, index) => {
          return (
            <WordComponent
              key={`${activePhrase.id}-${index}-${word.text}`}
              word={word}
              currentFrame={frame}
              fps={fps}
              theme={theme}
            />
          );
        })}
      </div>
    </div>
  );
};

interface WordComponentProps {
  word: CaptionWord;
  currentFrame: number;
  fps: number;
  theme: {
    highlightColor: string;
    accentColor: string;
    textColor: string;
    dimTextColor: string;
    fontSize: number;
  };
}

const WordComponent: React.FC<WordComponentProps> = ({
  word,
  currentFrame,
  fps,
  theme,
}) => {
  const isActive = currentFrame >= word.startFrame && currentFrame <= word.endFrame;
  const isPast = currentFrame > word.endFrame;

  // Snappy spring pop physics for active word
  const popSpring = spring({
    frame: currentFrame - word.startFrame,
    fps,
    config: {
      damping: 10,
      stiffness: 240,
      mass: 0.35,
    },
  });

  const highlightColor = word.highlightColor || theme.highlightColor;

  // Calculate kinetic highlighter box styles
  let scale = 1;
  let textColor = theme.dimTextColor;
  let backgroundColor = 'transparent';
  let boxShadow = 'none';
  let textShadow = 'none';
  let border = '1.5px solid transparent';

  if (isActive) {
    // KINETIC HIGHLIGHTER BOX: Solid glowing neon badge with black text
    scale = interpolate(popSpring, [0, 1], [0.85, 1.15]);
    textColor = '#000000';
    backgroundColor = highlightColor;
    border = `1.5px solid ${highlightColor}`;
    boxShadow = `
      0 0 35px ${highlightColor}cc,
      0 6px 20px rgba(0, 0, 0, 0.6)
    `;
    textShadow = 'none';
  } else if (isPast) {
    // PAST WORD: Crisp bright white
    scale = 1.0;
    textColor = '#FFFFFF';
    backgroundColor = 'rgba(255, 255, 255, 0.05)';
    border = '1.5px solid rgba(255, 255, 255, 0.08)';
    textShadow = '0 2px 10px rgba(0, 0, 0, 0.8)';
  } else {
    // UPCOMING WORD: Dimmed subtle anticipation
    textColor = 'rgba(255, 255, 255, 0.38)';
  }

  // Sticker bounce
  const stickerScale = isActive
    ? spring({
        frame: currentFrame - word.startFrame,
        fps,
        config: { damping: 9, stiffness: 220, mass: 0.4 },
      })
    : 1;

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
      }}
    >
      {/* Floating Animated Sticker or Emoji with Neon Aurora */}
      {isActive && (word.sticker || word.emoji) && (
        <div
          style={{
            position: 'absolute',
            top: '-90px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          {/* Radial Aura Glow behind the sticker */}
          <div
            style={{
              position: 'absolute',
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${highlightColor}66 0%, transparent 70%)`,
              filter: 'blur(15px)',
            }}
          />

          {word.sticker ? (
            <div style={{ transform: `scale(${stickerScale})` }}>
              <LottieSticker type={word.sticker} size={theme.fontSize * 1.35} />
            </div>
          ) : (
            <span
              style={{
                fontSize: `${theme.fontSize * 1.15}px`,
                filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.7))',
                transform: `scale(${stickerScale}) translateY(-4px)`,
              }}
            >
              {word.emoji}
            </span>
          )}
        </div>
      )}

      {/* Kinetic Highlighter Pill / Text */}
      <span
        style={{
          fontFamily: montserratFamily,
          fontWeight: 900,
          fontSize: `${theme.fontSize}px`,
          lineHeight: 1.15,
          color: textColor,
          textTransform: 'uppercase',
          letterSpacing: '-0.5px',
          padding: '6px 18px',
          borderRadius: '18px',
          backgroundColor,
          border,
          boxShadow,
          textShadow,
          whiteSpace: 'nowrap',
          transition: 'all 0.08s ease-out',
        }}
      >
        {word.text}
      </span>
    </div>
  );
};
