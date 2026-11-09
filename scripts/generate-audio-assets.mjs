import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// -------------------------------------------------------------
// Helper: Write 16-bit mono WAV buffer
// -------------------------------------------------------------
function writeWav(filename, samples, sampleRate = 44100) {
  const numSamples = samples.length;
  const byteRate = sampleRate * 2;
  const blockAlign = 2;
  const dataSize = numSamples * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF identifier
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt subchunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
  buffer.writeUInt16LE(1, 20);  // AudioFormat (1 = PCM)
  buffer.writeUInt16LE(1, 22);  // NumChannels (1 = Mono)
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(16, 34); // BitsPerSample (16)

  // data subchunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Write 16-bit PCM samples
  for (let i = 0; i < numSamples; i++) {
    // Clamp sample between -1 and 1
    const s = Math.max(-1, Math.min(1, samples[i]));
    const intVal = s < 0 ? s * 0x8000 : s * 0x7fff;
    buffer.writeInt16LE(Math.floor(intVal), 44 + i * 2);
  }

  fs.writeFileSync(filename, buffer);
  console.log(`Generated: ${filename} (${(dataSize / 1024).toFixed(1)} KB)`);
}

// -------------------------------------------------------------
// 1. Generate pop.wav (Snappy bubble pop for word bounces)
// -------------------------------------------------------------
function generatePopSfx() {
  const sampleRate = 44100;
  const duration = 0.12; // 120ms
  const numSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(numSamples);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    // Fast frequency sweep down from 900Hz to 200Hz
    const freq = 900 * Math.exp(-t * 28);
    const envelope = Math.exp(-t * 32);
    samples[i] = Math.sin(2 * Math.PI * freq * t) * envelope * 0.8;
  }

  writeWav(path.join(publicDir, 'pop.wav'), samples, sampleRate);
}

// -------------------------------------------------------------
// 2. Generate whoosh.wav (Airy whoosh for hook badge)
// -------------------------------------------------------------
function generateWhooshSfx() {
  const sampleRate = 44100;
  const duration = 0.45; // 450ms
  const numSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(numSamples);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    // White noise with bell curve envelope and pitch filter sweep
    const noise = Math.random() * 2 - 1;
    const progress = t / duration;
    const bell = Math.sin(progress * Math.PI);
    const filter = Math.sin(progress * Math.PI * 4);
    samples[i] = noise * bell * (0.5 + 0.5 * filter) * 0.45;
  }

  writeWav(path.join(publicDir, 'whoosh.wav'), samples, sampleRate);
}

// -------------------------------------------------------------
// 3. Generate music.wav (30-second upbeat lo-fi synth groove)
// -------------------------------------------------------------
function generateBackgroundMusic() {
  const sampleRate = 44100;
  const duration = 31.0; // 31 seconds
  const numSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(numSamples);

  // BPM = 120 (0.5s per beat)
  const beatSec = 0.5;
  // Chord progression: Am -> F -> C -> G (frequencies)
  const chords = [
    [220, 261.63, 329.63], // A3, C4, E4
    [174.61, 220, 261.63], // F3, A3, C4
    [130.81, 164.81, 196],  // C3, E3, G3
    [196, 246.94, 293.66], // G3, B3, D4
  ];

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const beat = t / beatSec;
    const measure = Math.floor(beat / 4);
    const chord = chords[measure % chords.length];

    // Ambient warm synth chords
    let chordSample = 0;
    for (const freq of chord) {
      chordSample += Math.sin(2 * Math.PI * freq * t) * 0.08;
      // Add subtle sub-octave
      chordSample += Math.sin(2 * Math.PI * (freq / 2) * t) * 0.05;
    }

    // Soft kick drum on beat 1 and 3
    const beatPhase = (beat % 1);
    let drum = 0;
    if ((Math.floor(beat) % 2 === 0) && beatPhase < 0.15) {
      const kickFreq = 120 * Math.exp(-beatPhase * 30);
      drum += Math.sin(2 * Math.PI * kickFreq * beatPhase) * Math.exp(-beatPhase * 20) * 0.4;
    }

    // Light shaker / hi-hat on every 8th note
    const halfBeatPhase = (beat * 2) % 1;
    if (halfBeatPhase < 0.06) {
      const hatNoise = (Math.random() * 2 - 1) * Math.exp(-halfBeatPhase * 60) * 0.08;
      drum += hatNoise;
    }

    samples[i] = (chordSample + drum) * 0.7;
  }

  writeWav(path.join(publicDir, 'music.wav'), samples, sampleRate);
}

// -------------------------------------------------------------
// 4. Generate voice.wav using Windows Speech Synthesis
// -------------------------------------------------------------
function generateVoiceover() {
  const voicePath = path.join(publicDir, 'voice.wav');
  console.log(`Generating voiceover: ${voicePath}...`);

  const scriptText = `Stop making this mistake when posting your reels! The first three seconds decide your entire reach. Rule number one: hook them with high contrast. Bounce each word smoothly, and cut all silence. Zero breathing pauses allowed! This keeps retention above eighty percent completion. Save this short now, share it with friends, and follow for more!`;

  const psScript = `
Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
try {
    $synth.SelectVoice("Microsoft Zira Desktop")
} catch {}
$synth.Rate = 0
$synth.SetOutputToWaveFile("${voicePath.replace(/\\/g, '\\\\')}")
$synth.Speak("${scriptText.replace(/"/g, '`"')}")
$synth.Dispose()
`;

  try {
    execSync(`powershell -NoProfile -Command "${psScript.replace(/\n/g, ' ')}"`, { stdio: 'inherit' });
    console.log(`Successfully generated voiceover: ${voicePath}`);
  } catch (err) {
    console.error('Error synthesizing voice:', err);
  }
}

// Run all generators
console.log('--- Generating Complete Audio Suite ---');
generatePopSfx();
generateWhooshSfx();
generateBackgroundMusic();
generateVoiceover();
console.log('--- Audio Suite Ready in /public! ---');

