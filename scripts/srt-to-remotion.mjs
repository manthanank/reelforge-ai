/**
 * Converts an SRT file or Whisper word-level JSON into Remotion CaptionPhrase format.
 * Usage: node scripts/srt-to-remotion.mjs input.srt
 */
import fs from 'fs';

function parseSrtTime(timeStr) {
  // Format: 00:00:01,200
  const [hms, ms] = timeStr.trim().split(',');
  const [h, m, s] = hms.split(':').map(Number);
  return (h * 3600 + m * 60 + s) * 1000 + Number(ms);
}

export function convertSrtToRemotionPhrases(srtContent, fps = 30) {
  const normalized = srtContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const blocks = normalized.split('\n\n').filter((b) => b.trim().length > 0);

  const phrases = [];

  for (let i = 0; i < blocks.length; i++) {
    const lines = blocks[i].split('\n').filter((l) => l.trim().length > 0);
    if (lines.length < 2) continue;

    // Line 0 is often index, Line 1 is timing (00:00:01,000 --> 00:00:03,500)
    let timeLine = lines[0].includes('-->') ? lines[0] : lines[1];
    let textLines = lines[0].includes('-->') ? lines.slice(1) : lines.slice(2);

    if (!timeLine || !timeLine.includes('-->')) continue;

    const [startStr, endStr] = timeLine.split('-->');
    const startMs = parseSrtTime(startStr);
    const endMs = parseSrtTime(endStr);

    const startFrame = Math.round((startMs / 1000) * fps);
    const endFrame = Math.round((endMs / 1000) * fps);

    const rawText = textLines.join(' ').trim();
    const wordsRaw = rawText.split(/\s+/).filter((w) => w.length > 0);

    // Distribute frame duration evenly among words in the phrase
    const totalFrames = endFrame - startFrame;
    const framesPerWord = Math.max(1, Math.floor(totalFrames / wordsRaw.length));

    const words = wordsRaw.map((word, wIdx) => {
      const wStart = startFrame + wIdx * framesPerWord;
      const wEnd =
        wIdx === wordsRaw.length - 1
          ? endFrame
          : startFrame + (wIdx + 1) * framesPerWord - 1;

      return {
        text: word.toUpperCase(),
        startFrame: wStart,
        endFrame: wEnd,
      };
    });

    phrases.push({
      id: `p-${i + 1}`,
      startFrame,
      endFrame,
      words,
    });
  }

  return phrases;
}

// CLI usage
const inputFile = process.argv[2];
if (inputFile && fs.existsSync(inputFile)) {
  const content = fs.readFileSync(inputFile, 'utf-8');
  const output = convertSrtToRemotionPhrases(content);
  const outPath = inputFile.replace(/\.srt$/, '-remotion.json');
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
  console.log(`Successfully converted ${inputFile} -> ${outPath}`);
}

