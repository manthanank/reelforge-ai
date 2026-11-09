import React from 'react';
import { Audio, interpolate, Sequence, useCurrentFrame } from 'remotion';
import { CaptionPhrase } from './types';

interface AudioTrackProps {
  voiceoverUrl?: string;
  musicUrl?: string;
  popSfxUrl?: string;
  whooshSfxUrl?: string;
  captions?: CaptionPhrase[];
  baseMusicVolume?: number;
  duckedMusicVolume?: number;
}

export const AudioTrack: React.FC<AudioTrackProps> = ({
  voiceoverUrl,
  musicUrl,
  popSfxUrl,
  whooshSfxUrl,
  captions = [],
  baseMusicVolume = 0.35,
  duckedMusicVolume = 0.12,
}) => {
  const frame = useCurrentFrame();

  // Smooth broadcast-grade audio ducking with 10-frame (333ms) cosine curve
  const getMusicVolume = (f: number) => {
    const fadeFrames = 10;
    let minDistance = Infinity;
    let isInside = false;

    for (const phrase of captions) {
      if (f >= phrase.startFrame && f <= phrase.endFrame) {
        isInside = true;
        break;
      }
      const dist = Math.min(
        Math.abs(f - phrase.startFrame),
        Math.abs(f - phrase.endFrame)
      );
      if (dist < minDistance) {
        minDistance = dist;
      }
    }

    if (isInside) {
      return duckedMusicVolume;
    }

    if (minDistance < fadeFrames) {
      // Smooth interpolation between ducked and base volume
      const factor = minDistance / fadeFrames;
      return duckedMusicVolume + (baseMusicVolume - duckedMusicVolume) * factor;
    }

    return baseMusicVolume;
  };

  // Find all frames where an emoji, sticker, or highlight pops in (throttled to avoid double pops)
  const sfxPopTriggers: number[] = [];
  let lastTrigger = -999;
  captions.forEach((phrase) => {
    phrase.words.forEach((word) => {
      if (word.emoji || word.highlightColor || word.sticker) {
        if (word.startFrame - lastTrigger > 12) {
          sfxPopTriggers.push(word.startFrame);
          lastTrigger = word.startFrame;
        }
      }
    });
  });

  return (
    <>
      {/* 1. Main Voiceover Track */}
      {voiceoverUrl && (
        <Audio src={voiceoverUrl} volume={1.0} />
      )}

      {/* 2. Background Music Track with Broadcast Audio Ducking */}
      {musicUrl && (
        <Audio
          src={musicUrl}
          volume={(f) => getMusicVolume(f)}
          loop
        />
      )}

      {/* 3. Opening Whoosh Sound for the Hook Badge */}
      {whooshSfxUrl && (
        <Sequence from={0} durationInFrames={30}>
          <Audio src={whooshSfxUrl} volume={0.6} />
        </Sequence>
      )}

      {/* 4. Pop Sound Effects on Key Words / Emojis / Stickers */}
      {popSfxUrl &&
        sfxPopTriggers.map((startFrame, idx) => (
          <Sequence
            key={`sfx-pop-${startFrame}-${idx}`}
            from={startFrame}
            durationInFrames={20}
          >
            <Audio src={popSfxUrl} volume={0.5} />
          </Sequence>
        ))}
    </>
  );
};
