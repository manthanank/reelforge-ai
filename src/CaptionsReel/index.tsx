import React from 'react';
import { AbsoluteFill } from 'remotion';
import { AudioTrack } from './AudioTrack';
import { BackgroundLayer } from './BackgroundLayer';
import { CaptionsLayer } from './CaptionsLayer';
import { HookBadge } from './HookBadge';
import { MetricCard } from './MetricCard';
import { ProgressBar } from './ProgressBar';
import { ReelConfig } from './types';
import {
  BrandHeader,
  GrowthChartCard,
  NotificationBanner,
  SocialLogosCard,
} from './VisualAssets';

export type CaptionsReelProps = {
  config: ReelConfig;
  showSafeZones?: boolean;
};

export const CaptionsReel: React.FC<CaptionsReelProps> = ({
  config,
  showSafeZones = false,
}) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: config.theme.backgroundColor,
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* 1. Cyberpunk Dark Neon & Bokeh Background */}
      <BackgroundLayer
        type={config.backgroundType}
        videoUrl={config.backgroundVideoUrl}
        overlayOpacity={config.theme.overlayOpacity}
        backgroundColor={config.theme.backgroundColor}
      />

      {/* 2. Brand Watermark & Verified Channel Header */}
      <BrandHeader name="CREATOR LABS" handle="@creatorlabs" />

      {/* 3. Electric Neon Progress Bar with Traveling Head Particle */}
      <ProgressBar />

      {/* 4. Opening Hook Badge with Frosted Glass Pill & Radar Ping */}
      {config.titleHook && (
        <HookBadge
          badge={config.titleHook.badge}
          headline={config.titleHook.headline}
          durationInFrames={config.titleHook.durationInFrames}
        />
      )}

      {/* 5. Dynamic Visual Assets, SVGs & Logos */}
      {/* Instagram & YouTube Logos Card */}
      <SocialLogosCard startFrame={56} endFrame={108} />

      {/* 3D Exponential Growth Chart with Animated Drawing Line */}
      <GrowthChartCard startFrame={166} endFrame={235} />

      {/* 3D Glassmorphic Metric Cards for Key Milestones */}
      <MetricCard
        label="RETENTION HOOK"
        value="3.0 SEC"
        subtext="Drop-off point for 70% of viewers"
        color="#00F0FF"
        startFrame={109}
        endFrame={165}
      />

      {/* iOS Viral Alert Notification Popup */}
      <NotificationBanner startFrame={566} endFrame={635} />

      <MetricCard
        label="ALGORITHM GOAL"
        value="> 80%"
        subtext="Average view duration to go viral"
        color="#22C55E"
        startFrame={636}
        endFrame={700}
      />

      {/* 6. Alex Hormozi 2.0: 3D Glass Pill + Kinetic Highlighter Boxes */}
      <CaptionsLayer captions={config.captions} theme={config.theme} />

      {/* 7. Complete Sound Suite (Voiceover + Ducked Music + SFX) */}
      <AudioTrack
        voiceoverUrl={config.audioTrackUrl}
        musicUrl={config.musicUrl}
        popSfxUrl={config.popSfxUrl}
        whooshSfxUrl={config.whooshSfxUrl}
        captions={config.captions}
      />

      {/* Optional Safe Zone Guide */}
      {showSafeZones && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderTop: '120px dashed rgba(255, 0, 0, 0.4)',
            borderBottom: '280px dashed rgba(255, 0, 0, 0.4)',
            borderRight: '120px dashed rgba(255, 0, 0, 0.4)',
            pointerEvents: 'none',
            zIndex: 99,
          }}
        >
          <div
            style={{
              position: 'absolute',
              bottom: 290,
              right: 130,
              color: 'rgba(255, 0, 0, 0.7)',
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            Safe Zone Boundary
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
