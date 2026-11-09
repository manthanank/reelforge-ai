import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn, execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'out');
const publicDir = path.join(rootDir, 'public');
const sampleDataPath = path.join(rootDir, 'src', 'CaptionsReel', 'sample-data.ts');

const PORT = 3001;

let isRendering = false;
let renderLog = '';

/**
 * Loads .env file if present in the project root
 */
function loadEnv() {
  const envPath = path.join(rootDir, '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let val = (match[2] || '').trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        process.env[key] = val;
      }
    }
  }
}
loadEnv();

/**
 * Splits plain text into high-retention phrases with smart sticker and color triggers
 */
function parseScriptToPhrases(scriptText, fps = 30) {
  const words = scriptText
    .replace(/[^\w\s!?,.-]/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const wordsPerPhrase = 3;
  const framesPerWord = 11;
  const phrasePauseFrames = 8;

  const phrases = [];
  let currentFrame = 15;

  for (let i = 0; i < words.length; i += wordsPerPhrase) {
    const chunkWords = words.slice(i, i + wordsPerPhrase);
    const phraseStart = currentFrame;
    const phraseWords = [];

    chunkWords.forEach((wordRaw) => {
      const cleanWord = wordRaw.toUpperCase();
      const wStart = currentFrame;
      const wEnd = currentFrame + framesPerWord - 2;

      let highlightColor = undefined;
      let emoji = undefined;
      let sticker = undefined;

      if (/STOP|MISTAKE|NEVER|WRONG|WARNING|DON'T|AVOID/.test(cleanWord)) {
        highlightColor = '#EF4444';
        sticker = 'warning';
      } else if (/REELS|SHORTS|TIKTOK|POST|VIRAL|VIEWS/.test(cleanWord)) {
        highlightColor = '#FFDE00';
        emoji = '📱';
      } else if (/REACH|GROWTH|MONEY|SCALE|10X|WIN/.test(cleanWord)) {
        highlightColor = '#22C55E';
        sticker = 'rocket';
      } else if (/SECRET|HACK|KEY|TIP|CODE|FIRST|BEST/.test(cleanWord)) {
        highlightColor = '#00F0FF';
        sticker = 'lightning';
      } else if (/NOW|MORE|SUBSCRIBE|FOLLOW|FIRE|SHARE/.test(cleanWord)) {
        highlightColor = '#FFDE00';
        sticker = 'fire';
      }

      phraseWords.push({
        text: cleanWord,
        startFrame: wStart,
        endFrame: wEnd,
        highlightColor,
        emoji,
        sticker,
      });

      currentFrame += framesPerWord;
    });

    const phraseEnd = currentFrame - 2;
    currentFrame += phrasePauseFrames;

    phrases.push({
      id: `p-${Math.floor(i / wordsPerPhrase) + 1}`,
      startFrame: phraseStart,
      endFrame: phraseEnd,
      words: phraseWords,
    });
  }

  return phrases;
}

/**
 * Updates sample-data.ts with new phrases and theme configuration
 */
function writeReelConfig(badge, headline, phrases, highlightColor = '#FFDE00', accentColor = '#00F0FF') {
  const newConfigCode = `import { staticFile } from 'remotion';
import { ReelConfig } from './types';

export const defaultReelConfig: ReelConfig = {
  titleHook: {
    badge: ${JSON.stringify(badge)},
    headline: ${JSON.stringify(headline)},
    durationInFrames: 90,
  },
  captions: ${JSON.stringify(phrases, null, 4)},
  theme: {
    highlightColor: ${JSON.stringify(highlightColor)},
    accentColor: ${JSON.stringify(accentColor)},
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
`;

  fs.writeFileSync(sampleDataPath, newConfigCode);
}

/**
 * Synthesizes voice.wav using Windows System.Speech
 */
function synthesizeVoiceover(scriptText) {
  const voicePath = path.join(publicDir, 'voice.wav');
  const safeScript = scriptText.replace(/[`"$]/g, '').trim();
  const ps = `Add-Type -AssemblyName System.Speech; $synth = New-Object System.Speech.Synthesis.SpeechSynthesizer; try { $synth.SelectVoice("Microsoft Zira Desktop") } catch {}; $synth.Rate = 0; $synth.SetOutputToWaveFile("${voicePath.replace(/\\/g, '\\\\')}"); $synth.Speak("${safeScript}"); $synth.Dispose();`;
  try {
    execSync(`powershell -NoProfile -Command "${ps}"`, { stdio: 'ignore' });
    console.log(`🎙️ Voiceover synthesized for: "${safeScript.slice(0, 40)}..."`);
  } catch (err) {
    console.warn(`Voice synthesis warning:`, err.message);
  }
}

/**
 * Calls Google Gemini REST API to craft viral short-form script
 */
async function callGeminiAI(topic, style = 'viral', userApiKey = '') {
  loadEnv();
  const apiKey = (userApiKey && userApiKey.trim()) || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API key is required. Please paste your Gemini API key in the studio input or add GEMINI_API_KEY in .env file.');
  }

  const prompt = `You are a world-class viral short-form video script architect (Alex Hormozi & Ali Abdaal style for Instagram Reels and YouTube Shorts).
Topic: "${topic}"
Tone/Style: "${style}"

Create an ultra-high retention vertical video script (30 seconds, 55-75 words) that maximizes viewer retention.
Strict requirements:
1. First 3 seconds MUST have a strong hook (pattern interrupt like "Stop scrolling right now" or "Never make this rookie mistake").
2. Spoken sentences must be punchy, energetic, and rhythmic (3-5 words per sentence chunk).
3. Include keyword trigger words in UPPERCASE where impactful: STOP, MISTAKE, SECRET, HACK, VIRAL, GROW, MONEY, NOW, 10X.
4. Conclude with a strong, urgent CTA (e.g. Save this reel, follow for more).
5. Hook Badge: Short 2-3 word category badge with emoji (e.g. "🔥 CREATOR SECRET", "⚠️ STOP DOING THIS", "🚀 10X ALGORITHM HACK", "💡 PRO CODING TIP").
6. Hook Headline: Bold 3-5 word headline in ALL CAPS (e.g. "STOP MAKING THIS MISTAKE").
7. Highlight Color: Hex color for caption kinetic pill (one of: "#FFDE00", "#00F0FF", "#22C55E", "#EF4444", "#FF007A").
8. Accent Color: Hex color for background neon glow.

Respond ONLY with a valid JSON object in this exact schema:
{
  "badge": "string",
  "headline": "string",
  "script": "string",
  "highlightColor": "#HEX",
  "accentColor": "#HEX"
}`;

  const models = ['gemini-2.5-flash', 'gemini-1.5-flash'];
  let lastError = null;

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.75,
          }
        })
      });

      if (!resp.ok) {
        const errorText = await resp.text();
        throw new Error(`${model} API responded with ${resp.status}: ${errorText}`);
      }

      const data = await resp.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) throw new Error('No content returned from Gemini.');

      const parsed = JSON.parse(rawText);
      return parsed;
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError;
}

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  // 1. Serve Dashboard HTML
  if (url.pathname === '/' || url.pathname === '/index.html' || url.pathname === '/studio') {
    const htmlPath = path.join(__dirname, 'index.html');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return fs.createReadStream(htmlPath).pipe(res);
  }

  // 1b. Serve Marketing Landing Page
  if (url.pathname === '/landing') {
    const landingPath = path.join(__dirname, 'landing.html');
    if (fs.existsSync(landingPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return fs.createReadStream(landingPath).pipe(res);
    }
  }

  // 1c. Favicon & Logos
  if (url.pathname === '/favicon.svg' || url.pathname === '/favicon.ico') {
    const favPath = path.join(publicDir, 'favicon.svg');
    if (fs.existsSync(favPath)) {
      res.writeHead(200, { 'Content-Type': 'image/svg+xml' });
      return fs.createReadStream(favPath).pipe(res);
    }
  }

  if (url.pathname === '/logo.svg') {
    const logoPath = path.join(publicDir, 'logo.svg');
    if (fs.existsSync(logoPath)) {
      res.writeHead(200, { 'Content-Type': 'image/svg+xml' });
      return fs.createReadStream(logoPath).pipe(res);
    }
  }

  // 1d. Static Public Assets
  if (url.pathname.startsWith('/public/')) {
    const filePath = path.join(rootDir, url.pathname);
    if (fs.existsSync(filePath)) {
      const ext = path.extname(filePath);
      const mimeTypes = {
        '.svg': 'image/svg+xml',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.ico': 'image/x-icon',
        '.wav': 'audio/wav',
        '.mp3': 'audio/mpeg',
      };
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
      return fs.createReadStream(filePath).pipe(res);
    }
  }

  // 2. Serve Rendered Videos & Static Preview Files
  if (url.pathname.startsWith('/out/')) {
    const filePath = path.join(rootDir, url.pathname);
    if (fs.existsSync(filePath)) {
      const ext = path.extname(filePath);
      const contentType = ext === '.mp4' ? 'video/mp4' : ext === '.png' ? 'image/png' : 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      return fs.createReadStream(filePath).pipe(res);
    }
  }

  // 3. API: Get Status & Videos
  if (url.pathname === '/api/status' && req.method === 'GET') {
    let videos = [];
    if (fs.existsSync(outDir)) {
      videos = fs.readdirSync(outDir)
        .filter((f) => f.endsWith('.mp4'))
        .map((f) => {
          const stat = fs.statSync(path.join(outDir, f));
          return {
            filename: f,
            url: `/out/${f}`,
            sizeMb: (stat.size / (1024 * 1024)).toFixed(2),
            time: stat.mtime,
          };
        })
        .sort((a, b) => b.time - a.time);
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ isRendering, renderLog, videos, hasGeminiEnv: Boolean(process.env.GEMINI_API_KEY) }));
  }

  // 4. API: AI Generate via Google Gemini
  if (url.pathname === '/api/ai/generate' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const topic = payload.topic || 'How to 10x your reels reach';
        const style = payload.style || 'viral';
        const apiKey = payload.apiKey || '';

        console.log(`🤖 Invoking Google Gemini for topic: "${topic}"...`);
        const geminiResult = await callGeminiAI(topic, style, apiKey);

        const phrases = parseScriptToPhrases(geminiResult.script);
        writeReelConfig(
          geminiResult.badge,
          geminiResult.headline,
          phrases,
          geminiResult.highlightColor || '#FFDE00',
          geminiResult.accentColor || '#00F0FF'
        );

        // Synthesize fresh voiceover in background
        synthesizeVoiceover(geminiResult.script);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({
          success: true,
          data: geminiResult,
          phraseCount: phrases.length,
          message: 'Gemini created your viral script, updated preview & synthesized speech!'
        }));
      } catch (err) {
        console.error('Gemini generate error:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // 5. API: Manual Generate & Update Script
  if (url.pathname === '/api/generate' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const scriptText = data.text || 'Stop making this huge mistake when posting your reels. The first three seconds decide your entire reach!';
        const badge = data.badge || '🔥 CREATOR SECRET';
        const headline = data.headline || 'Stop Making This Mistake';
        const highlightColor = data.highlightColor || '#FFDE00';
        const accentColor = data.accentColor || '#22C55E';
        const syncVoice = data.syncVoice !== false;

        const phrases = parseScriptToPhrases(scriptText);
        writeReelConfig(badge, headline, phrases, highlightColor, accentColor);

        if (syncVoice) {
          synthesizeVoiceover(scriptText);
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: true, message: 'Script updated! Preview is reloaded.', phraseCount: phrases.length }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // 6. API: Trigger Video Render
  if (url.pathname === '/api/render' && req.method === 'POST') {
    if (isRendering) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Render already in progress!' }));
    }

    isRendering = true;
    renderLog = 'Starting render pass...\n';

    const renderProc = spawn('npx', ['remotion', 'render', 'src/index.ts', 'CaptionsReel', 'out/reel.mp4'], {
      cwd: rootDir,
      shell: true,
    });

    renderProc.stdout.on('data', (d) => {
      renderLog += d.toString();
    });

    renderProc.stderr.on('data', (d) => {
      renderLog += d.toString();
    });

    renderProc.on('close', (code) => {
      isRendering = false;
      renderLog += `\nRender process finished with code ${code}.`;
    });

    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ success: true, message: 'Render started!' }));
  }

  res.writeHead(404);
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log(`\n=================================================`);
  console.log(`🎬 REELFORGE Dashboard live at http://localhost:${PORT}`);
  console.log(`🤖 Gemini AI Engine ready at /api/ai/generate`);
  console.log(`=================================================\n`);
});
