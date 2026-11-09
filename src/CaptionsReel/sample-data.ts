import { staticFile } from 'remotion';
import { ReelConfig } from './types';

export const defaultReelConfig: ReelConfig = {
  titleHook: {
    badge: '🔥 CREATOR SECRET',
    headline: 'Stop Making This Mistake',
    durationInFrames: 90, // First 3 seconds
  },
  captions: [
    // --- ACT 1: THE HOOK (0s - 3s) ---
    {
      id: 'p1',
      startFrame: 10,
      endFrame: 55,
      words: [
        { text: 'STOP', startFrame: 10, endFrame: 20, highlightColor: '#EF4444', sticker: 'warning' },
        { text: 'MAKING', startFrame: 21, endFrame: 32 },
        { text: 'THIS', startFrame: 33, endFrame: 43 },
        { text: 'MISTAKE', startFrame: 44, endFrame: 55, highlightColor: '#EF4444' },
      ],
    },
    {
      id: 'p2',
      startFrame: 56,
      endFrame: 105,
      words: [
        { text: 'WHEN', startFrame: 56, endFrame: 68 },
        { text: 'POSTING', startFrame: 69, endFrame: 81 },
        { text: 'YOUR', startFrame: 82, endFrame: 92 },
        { text: 'REELS!', startFrame: 93, endFrame: 105, highlightColor: '#FFDE00', emoji: '📱' },
      ],
    },

    // --- ACT 2: THE PROBLEM (3s - 8s) ---
    {
      id: 'p3',
      startFrame: 106,
      endFrame: 165,
      words: [
        { text: 'THE', startFrame: 106, endFrame: 118 },
        { text: 'FIRST', startFrame: 119, endFrame: 132 },
        { text: 'THREE', startFrame: 133, endFrame: 148, highlightColor: '#38BDF8', sticker: 'lightning' },
        { text: 'SECONDS', startFrame: 149, endFrame: 165, highlightColor: '#38BDF8' },
      ],
    },
    {
      id: 'p4',
      startFrame: 166,
      endFrame: 235,
      words: [
        { text: 'DECIDE', startFrame: 166, endFrame: 182 },
        { text: 'YOUR', startFrame: 183, endFrame: 198 },
        { text: 'ENTIRE', startFrame: 199, endFrame: 215 },
        { text: 'REACH!', startFrame: 216, endFrame: 235, highlightColor: '#22C55E', sticker: 'rocket' },
      ],
    },

    // --- ACT 3: STEP 1 - VISUAL HOOK (8s - 14s) ---
    {
      id: 'p5',
      startFrame: 236,
      endFrame: 300,
      words: [
        { text: 'RULE', startFrame: 236, endFrame: 250, highlightColor: '#FFDE00' },
        { text: 'NUMBER', startFrame: 251, endFrame: 265 },
        { text: 'ONE:', startFrame: 266, endFrame: 280, highlightColor: '#FFDE00' },
        { text: 'HOOK', startFrame: 281, endFrame: 300, highlightColor: '#00F0FF', emoji: '🪝' },
      ],
    },
    {
      id: 'p6',
      startFrame: 301,
      endFrame: 365,
      words: [
        { text: 'THEM', startFrame: 301, endFrame: 315 },
        { text: 'WITH', startFrame: 316, endFrame: 330 },
        { text: 'HIGH', startFrame: 331, endFrame: 345 },
        { text: 'CONTRAST!', startFrame: 346, endFrame: 365, highlightColor: '#FFDE00', emoji: '🎨' },
      ],
    },
    {
      id: 'p7',
      startFrame: 366,
      endFrame: 430,
      words: [
        { text: 'BOUNCE', startFrame: 366, endFrame: 382, highlightColor: '#22C55E' },
        { text: 'EACH', startFrame: 383, endFrame: 398 },
        { text: 'WORD', startFrame: 399, endFrame: 414 },
        { text: 'SMOOTHLY,', startFrame: 415, endFrame: 430 },
      ],
    },

    // --- ACT 4: STEP 2 - FAST PACING (14s - 21s) ---
    {
      id: 'p8',
      startFrame: 431,
      endFrame: 495,
      words: [
        { text: 'AND', startFrame: 431, endFrame: 445 },
        { text: 'CUT', startFrame: 446, endFrame: 462, highlightColor: '#EF4444', emoji: '✂️' },
        { text: 'ALL', startFrame: 463, endFrame: 478 },
        { text: 'SILENCE.', startFrame: 479, endFrame: 495, highlightColor: '#EF4444' },
      ],
    },
    {
      id: 'p9',
      startFrame: 496,
      endFrame: 565,
      words: [
        { text: 'ZERO', startFrame: 496, endFrame: 512, highlightColor: '#FFB800' },
        { text: 'BREATHING', startFrame: 513, endFrame: 532 },
        { text: 'PAUSES', startFrame: 533, endFrame: 548 },
        { text: 'ALLOWED!', startFrame: 549, endFrame: 565, highlightColor: '#FFB800', sticker: 'warning' },
      ],
    },
    {
      id: 'p10',
      startFrame: 566,
      endFrame: 635,
      words: [
        { text: 'THIS', startFrame: 566, endFrame: 582 },
        { text: 'KEEPS', startFrame: 583, endFrame: 598 },
        { text: 'RETENTION', startFrame: 599, endFrame: 618, highlightColor: '#22C55E', sticker: 'sparkles' },
        { text: 'ABOVE', startFrame: 619, endFrame: 635 },
      ],
    },
    {
      id: 'p11',
      startFrame: 636,
      endFrame: 700,
      words: [
        { text: 'EIGHTY', startFrame: 636, endFrame: 655, highlightColor: '#00F0FF' },
        { text: 'PERCENT', startFrame: 656, endFrame: 675, highlightColor: '#00F0FF', sticker: 'rocket' },
        { text: 'COMPLETION!', startFrame: 676, endFrame: 700 },
      ],
    },

    // --- ACT 5: STEP 3 - THE CALL TO ACTION (21s - 30s) ---
    {
      id: 'p12',
      startFrame: 701,
      endFrame: 770,
      words: [
        { text: 'SAVE', startFrame: 701, endFrame: 720, highlightColor: '#FFDE00', emoji: '💾' },
        { text: 'THIS', startFrame: 721, endFrame: 738 },
        { text: 'SHORT', startFrame: 739, endFrame: 754 },
        { text: 'NOW,', startFrame: 755, endFrame: 770 },
      ],
    },
    {
      id: 'p13',
      startFrame: 771,
      endFrame: 840,
      words: [
        { text: 'SHARE', startFrame: 771, endFrame: 788, highlightColor: '#38BDF8', emoji: '↗️' },
        { text: 'IT', startFrame: 789, endFrame: 802 },
        { text: 'WITH', startFrame: 803, endFrame: 820 },
        { text: 'FRIENDS,', startFrame: 821, endFrame: 840 },
      ],
    },
    {
      id: 'p14',
      startFrame: 841,
      endFrame: 900,
      words: [
        { text: 'AND', startFrame: 841, endFrame: 855 },
        { text: 'FOLLOW', startFrame: 856, endFrame: 872, highlightColor: '#FFDE00', emoji: '👇' },
        { text: 'FOR', startFrame: 873, endFrame: 885 },
        { text: 'MORE!', startFrame: 886, endFrame: 900, highlightColor: '#22C55E', sticker: 'fire' },
      ],
    },
  ],
  theme: {
    highlightColor: '#FFDE00',
    accentColor: '#22C55E',
    textColor: '#FFFFFF',
    dimTextColor: 'rgba(255, 255, 255, 0.45)',
    backgroundColor: '#07090E',
    overlayOpacity: 0.65,
    fontSize: 72,
    captionYPosition: 62,
  },
  backgroundType: 'cinematic-gradient',
  audioTrackUrl: staticFile('voice.wav'),
  musicUrl: staticFile('music.wav'),
  popSfxUrl: staticFile('pop.wav'),
  whooshSfxUrl: staticFile('whoosh.wav'),
  audioVolume: 1.0,
};
