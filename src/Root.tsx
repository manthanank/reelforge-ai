import React from 'react';
import { CalculateMetadataFunction, Composition } from 'remotion';
import { CaptionsReel, CaptionsReelProps } from './CaptionsReel';
import { defaultReelConfig } from './CaptionsReel/sample-data';
import { MultiSceneReel } from './MultiSceneReel';

// Automatically calculate video duration to match the script length + 0.5s buffer
const calculateReelMetadata: CalculateMetadataFunction<CaptionsReelProps> = ({
  props,
}) => {
  const captions = props.config?.captions ?? [];
  if (captions.length === 0) {
    return { durationInFrames: 450 }; // Default 15s if no captions
  }

  const lastCaption = captions[captions.length - 1];
  // Add 15 frames (0.5s @ 30fps) smooth out-tro padding so the ending doesn't cut abruptly
  const totalFrames = Math.max(90, lastCaption.endFrame + 15);

  return {
    durationInFrames: totalFrames,
  };
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Main 9:16 vertical reel (1080x1920 @ 30fps) - Auto-sized duration */}
      <Composition
        id="CaptionsReel"
        component={CaptionsReel}
        calculateMetadata={calculateReelMetadata}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          config: defaultReelConfig,
          showSafeZones: false,
        }}
      />

      {/* Composition with Safe Zone Overlays to preview Instagram/YouTube UI margins */}
      <Composition
        id="CaptionsReelWithSafeZones"
        component={CaptionsReel}
        calculateMetadata={calculateReelMetadata}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          config: defaultReelConfig,
          showSafeZones: true,
        }}
      />

      {/* 3-Scene Storytelling Reel with @remotion/transitions (Slide & Wipe) - 30 seconds */}
      <Composition
        id="MultiSceneReel"
        component={MultiSceneReel}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};

