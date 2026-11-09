# 🎬 ReelForge AI — Viral Shorts & Reels Generator

A production-ready React & Remotion framework designed specifically for creating high-converting, viral **Instagram Reels** and **YouTube Shorts** (9:16 vertical 1080x1920).

Inspired by the dynamic, word-by-word animated captions popularized by **Alex Hormozi**, **Ali Abdaal**, and top podcast creators.

---

## ⚡ Quick Start

```bash
# 1. Navigate to the project directory
cd reelforge-ai

# 2. Launch the Web Studio Dashboard (port 3001)
npm run dashboard

# 3. Launch Remotion Studio Preview (port 3000)
npm run dev
```

Open the local preview URL (usually `http://localhost:3000`) in your browser to view the video, scrub through frames, inspect safe zones, and tweak timing live with instant hot-reloading!

---

## 🎥 Rendering Videos to MP4

### Single Reel Render:
```bash
npm run build
# Outputs to: out/reel.mp4
```

### Batch Render Multiple Reels:
```bash
npm run render:all
# Automatically reads scripts/sample-reels.json and renders out/reel-1.mp4, out/reel-2.mp4, etc.
```

---

## 📁 Project Structure

```
remotion-shorts/
├── src/
│   ├── index.ts                     # Remotion root registration
│   ├── Root.tsx                     # Registers compositions & 9:16 resolutions
│   ├── CaptionsReel/
│   │   ├── index.tsx                # Main composition layout
│   │   ├── CaptionsLayer.tsx        # 3D glass cards + kinetic highlighter box engine
│   │   ├── BackgroundLayer.tsx      # Cyberpunk 3D perspective grid, plasma orbs & bokeh
│   │   ├── ProgressBar.tsx          # Electric progress bar with traveling head particle
│   │   ├── HookBadge.tsx            # Frosted glass hook badge with live radar ping
│   │   ├── MetricCard.tsx           # 3D floating glass metric tickers (e.g. 3.0s, >80%)
│   │   ├── VisualAssets.tsx         # SVGs, logos (Instagram, YouTube), and growth charts
│   │   ├── AudioTrack.tsx           # Voiceover + background music ducking + SFX
│   │   ├── LottieSticker.tsx        # Animated vector stickers (fire, rocket, warning, etc.)
│   │   ├── fonts.ts                 # Google Fonts (Montserrat & Anton) loaders
│   │   ├── types.ts                 # TypeScript types for captions and themes
│   │   └── sample-data.ts           # Demo script with frame timings, colors & stickers
│   └── MultiSceneReel/
│       └── index.tsx                # 3-scene reel with @remotion/transitions (Slide & Wipe)
├── scripts/
│   ├── batch-render.mjs             # Automate rendering multiple reels
│   ├── generate-voiceover.mjs       # Instant script-to-reel timing generator
│   ├── sample-reels.json            # Batch dataset for content calendar
│   └── srt-to-remotion.mjs          # Converter: .srt subtitles -> Remotion frames
├── remotion.config.ts               # Remotion render settings & GPU configuration
└── package.json
```

---

## 🎨 Key Features & Customizations

### 1. Dynamic Auto-Sizing Video Duration
The video length automatically adapts to your script! Powered by `calculateMetadata`, Remotion inspects the timestamp of your last spoken word and adds a smooth 0.5-second buffer at the end so your video is never cut off and has zero dead air.

### 2. Hormozi-Style Word Highlighting
Captions are grouped into short, digestible 2–4 word phrases. As the speaker says each word:
- The word bounces in with **spring physics** (`scale(1.15)`).
- Its color shifts to a bright highlight color (e.g., `#FFDE00` Yellow or `#22C55E` Lime Green).
- An animated **emoji pops above the word** (e.g. `🔥`, `⚠️`, `🚀`).
- Preceding words stay legible in bright white.
- Future words remain subtly dimmed to guide viewer attention.

### 2. Instagram & YouTube Safe Zones
Social apps place buttons (like, share, comments, profile icons, sound attribution) over videos.
- You can preview safe-zone overlays anytime by selecting the **`CaptionsReelWithSafeZones`** composition in Remotion Studio!

### 3. Automatic Subtitle Importer (`.srt` to Remotion)
If you transcribed your video with **OpenAI Whisper**, **CapCut**, **Premiere Pro**, or **Descript**, you can convert `.srt` files directly:
```bash
node scripts/srt-to-remotion.mjs my-audio.srt
```
This generates `my-audio-remotion.json` ready to paste or import into `sample-data.ts`.

### 4. Background Video & Voiceover Audio
To use your own recorded background video and voiceover:
1. Put your video/audio in the `public/` directory (e.g., `public/bg.mp4` and `public/voice.mp3`).
2. In your config:
```ts
{
  backgroundType: 'video',
  backgroundVideoUrl: staticFile('bg.mp4'),
  audioTrackUrl: staticFile('voice.mp3'),
  audioVolume: 1.0,
  theme: {
    overlayOpacity: 0.6, // darkens video so text is 100% legible
    ...
  }
}
```

---

## 🛠️ Customizing the Script & Theme

Edit [`src/CaptionsReel/sample-data.ts`](file:///c:/Users/manth/remotion-shorts/src/CaptionsReel/sample-data.ts):

```typescript
export const defaultReelConfig: ReelConfig = {
  titleHook: {
    badge: '🔥 CREATOR SECRET',
    headline: 'Stop Making This Mistake',
    durationInFrames: 90, // First 3 seconds
  },
  captions: [
    {
      id: 'p1',
      startFrame: 10,
      endFrame: 65,
      words: [
        { text: 'STOP', startFrame: 10, endFrame: 22, highlightColor: '#EF4444', emoji: '⚠️' },
        { text: 'MAKING', startFrame: 23, endFrame: 35 },
        { text: 'THIS', startFrame: 36, endFrame: 48 },
        { text: 'MISTAKE', startFrame: 49, endFrame: 65, highlightColor: '#EF4444' },
      ],
    },
    ...
  ],
  theme: {
    highlightColor: '#FFDE00',
    accentColor: '#22C55E',
    textColor: '#FFFFFF',
    fontSize: 72,
    captionYPosition: 62, // % from top (optimal eye level on mobile)
  },
  backgroundType: 'cinematic-gradient',
};
```

