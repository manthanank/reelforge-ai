import * as Anton from '@remotion/google-fonts/Anton';
import * as Montserrat from '@remotion/google-fonts/Montserrat';

// Load extra-bold Montserrat for punchy, modern captions
export const { fontFamily: montserratFamily } = Montserrat.loadFont('normal', {
  weights: ['800', '900'],
  subsets: ['latin'],
});

// Load Anton for high-impact hook badges and headlines
export const { fontFamily: antonFamily } = Anton.loadFont('normal', {
  weights: ['400'],
  subsets: ['latin'],
});

