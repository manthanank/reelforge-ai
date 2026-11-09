export type StickerType = 'fire' | 'warning' | 'rocket' | 'sparkles' | 'checkmark' | 'lightning';

export interface CaptionWord {
  text: string;
  startFrame: number;
  endFrame: number;
  highlightColor?: string;
  emoji?: string;
  sticker?: StickerType;
}

export interface CaptionPhrase {
  id: string;
  startFrame: number;
  endFrame: number;
  words: CaptionWord[];
}

export interface ReelConfig {
  titleHook: {
    badge: string;
    headline: string;
    durationInFrames: number;
  };
  captions: CaptionPhrase[];
  theme: {
    highlightColor: string; // e.g. '#FFDE00' (Hormozi yellow)
    accentColor: string;    // e.g. '#00FF66' (lime green)
    textColor: string;      // '#FFFFFF'
    dimTextColor: string;   // 'rgba(255, 255, 255, 0.4)'
    backgroundColor: string;// '#0B0F17'
    overlayOpacity: number; // 0.65
    fontSize: number;       // e.g. 64px
    captionYPosition: number;// percentage from top, default 65%
  };
  backgroundType: 'cinematic-gradient' | 'particles' | 'video';
  backgroundVideoUrl?: string;
  audioTrackUrl?: string;
  musicUrl?: string;
  popSfxUrl?: string;
  whooshSfxUrl?: string;
  audioVolume?: number;
}

