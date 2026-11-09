import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { TransitionSeries, linearTiming, springTiming } from '@remotion/transitions';
import { slide } from '@remotion/transitions/slide';
import { wipe } from '@remotion/transitions/wipe';
import { flip } from '@remotion/transitions/flip';
import { ProgressBar } from '../CaptionsReel/ProgressBar';
import { antonFamily, montserratFamily } from '../CaptionsReel/fonts';
import { LottieSticker } from '../CaptionsReel/LottieSticker';

export const MultiSceneReel: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#07090E', fontFamily: montserratFamily }}>
      <ProgressBar />

      {/* Background Music and Transition Whooshes */}
      <Audio src={staticFile('music.wav')} volume={0.35} loop />
      <Sequence from={0} durationInFrames={30}>
        <Audio src={staticFile('whoosh.wav')} volume={0.5} />
      </Sequence>
      <Sequence from={175} durationInFrames={30}>
        <Audio src={staticFile('whoosh.wav')} volume={0.5} />
      </Sequence>
      <Sequence from={705} durationInFrames={30}>
        <Audio src={staticFile('whoosh.wav')} volume={0.5} />
      </Sequence>

      <TransitionSeries>
        {/* ======================================== */}
        {/* SCENE 1: THE HOOK (6 seconds)           */}
        {/* ======================================== */}
        <TransitionSeries.Sequence durationInFrames={180}>
          <HookScene />
        </TransitionSeries.Sequence>

        {/* Transition 1: Fast Spring Slide from Right */}
        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-right' })}
          timing={springTiming({ config: { damping: 14, stiffness: 160 } })}
        />

        {/* ======================================== */}
        {/* SCENE 2: THE 3 RULES (18 seconds)        */}
        {/* ======================================== */}
        <TransitionSeries.Sequence durationInFrames={540}>
          <RulesScene />
        </TransitionSeries.Sequence>

        {/* Transition 2: Diagonal Wipe Transition */}
        <TransitionSeries.Transition
          presentation={wipe({ direction: 'from-top-right' })}
          timing={linearTiming({ durationInFrames: 20 })}
        />

        {/* ======================================== */}
        {/* SCENE 3: CALL TO ACTION (7 seconds)      */}
        {/* ======================================== */}
        <TransitionSeries.Sequence durationInFrames={220}>
          <CtaScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};

// Scene 1: The Hook
const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = spring({ frame, fps, config: { damping: 12, stiffness: 180 } });

  return (
    <AbsoluteFill
      style={{
        background: 'radial-gradient(ellipse at 50% 30%, #1c0d2d 0%, #080312 80%)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 60px',
        textAlign: 'center',
      }}
    >
      <div style={{ transform: `scale(${pop})` }}>
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'center' }}>
          <LottieSticker type="warning" size={140} />
        </div>
        <div
          style={{
            fontFamily: antonFamily,
            fontSize: '84px',
            lineHeight: 1.05,
            color: '#FFFFFF',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            textShadow: '0 0 30px rgba(239, 68, 68, 0.6), 0 4px 16px #000000',
          }}
        >
          STOP WASTING TIME <br />
          <span style={{ color: '#EF4444' }}>ON BORING SHORTS</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: The Core Insight
const RulesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rules = [
    { num: '01', title: 'HOOK IN 3 SECONDS', color: '#FFDE00', sticker: 'lightning' },
    { num: '02', title: 'BOUNCE YOUR CAPTIONS', color: '#38BDF8', sticker: 'rocket' },
    { num: '03', title: 'END WITH A LOOP', color: '#22C55E', sticker: 'fire' },
  ];

  return (
    <AbsoluteFill
      style={{
        background: 'radial-gradient(ellipse at 50% 40%, #0d1e2e 0%, #040910 80%)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 50px',
      }}
    >
      <div
        style={{
          fontFamily: antonFamily,
          fontSize: '54px',
          color: '#FFFFFF',
          marginBottom: 40,
          letterSpacing: '2px',
        }}
      >
        ⚡ 3 RULES FOR 1M+ VIEWS
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', width: '100%' }}>
        {rules.map((rule, idx) => {
          const delay = idx * 20;
          const anim = spring({
            frame: frame - delay,
            fps,
            config: { damping: 14, stiffness: 180 },
          });

          return (
            <div
              key={rule.num}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: `2px solid ${rule.color}55`,
                borderRadius: '24px',
                padding: '24px 32px',
                transform: `translateX(${(1 - anim) * 100}px) scale(${anim})`,
                opacity: anim,
                boxShadow: `0 8px 30px ${rule.color}22`,
              }}
            >
              <div
                style={{
                  fontFamily: antonFamily,
                  fontSize: '44px',
                  color: rule.color,
                }}
              >
                {rule.num}
              </div>
              <div
                style={{
                  fontSize: '38px',
                  fontWeight: 900,
                  color: '#FFFFFF',
                  letterSpacing: '-0.5px',
                  flex: 1,
                }}
              >
                {rule.title}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Scene 3: The CTA
const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = spring({ frame, fps, config: { damping: 10, stiffness: 200 } });
  const pulse = Math.sin(frame * 0.2) * 0.05 + 1;

  return (
    <AbsoluteFill
      style={{
        background: 'radial-gradient(ellipse at 50% 50%, #1e1105 0%, #0a0501 80%)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 60px',
        textAlign: 'center',
      }}
    >
      <div style={{ transform: `scale(${pop})` }}>
        <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'center' }}>
          <LottieSticker type="fire" size={130} />
        </div>
        <div
          style={{
            fontFamily: antonFamily,
            fontSize: '76px',
            color: '#FFFFFF',
            lineHeight: 1.1,
            letterSpacing: '1px',
            marginBottom: 36,
          }}
        >
          FOLLOW FOR DAILY <br />
          <span style={{ color: '#FFDE00' }}>CREATOR SECRETS</span>
        </div>

        <div
          style={{
            display: 'inline-block',
            padding: '20px 48px',
            borderRadius: '9999px',
            background: 'linear-gradient(135deg, #FFDE00 0%, #FF9900 100%)',
            color: '#000000',
            fontFamily: antonFamily,
            fontSize: '42px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            boxShadow: '0 8px 40px rgba(255, 222, 0, 0.5)',
            transform: `scale(${pulse})`,
          }}
        >
          🔥 SUBSCRIBE NOW
        </div>
      </div>
    </AbsoluteFill>
  );
};

