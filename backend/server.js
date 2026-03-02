import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import { promisify } from 'util';
import { readFile, unlink, readdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(cors());
app.use(express.json());

app.get('/transcript/:videoId', async (req, res) => {
  const videoId = req.params.videoId;
  const ytDlp = path.join(__dirname, 'yt-dlp.exe');

  try {
    // Download captions
    await execAsync(
      `"${ytDlp}" --write-auto-subs --sub-lang en --sub-format json3 --skip-download --output "${path.join(__dirname, videoId)}" "https://www.youtube.com/watch?v=${videoId}"`
    );

    // Find whatever .json3 file was created (name varies)
    const files = await readdir(__dirname);
    const captionFile = files.find(f => f.includes(videoId) && f.endsWith('.json3'));

    if (!captionFile) {
      throw new Error('No captions found for this video — it may not have subtitles.');
    }

    const filepath = path.join(__dirname, captionFile);
    const raw = await readFile(filepath, 'utf8');
    const parsed = JSON.parse(raw);

    // Clean up
    await unlink(filepath);

    const segments = parsed.events
      .filter(e => e.segs)
      .map(e => ({
        start: e.tStartMs / 1000,
        text: e.segs.map(s => s.utf8).join('').replace(/\n/g, ' ').trim(),
      }))
      .filter(s => s.text && s.text.trim() !== '');

    res.json(segments);
  } catch (e) {
    console.error(e);
    // Clean up any leftover files
    try {
      const files = await readdir(__dirname);
      for (const f of files.filter(f => f.startsWith(videoId) && f.endsWith('.json3'))) {
        await unlink(path.join(__dirname, f));
      }
    } catch {}
    res.status(400).json({ error: e.message });
  }
});

app.listen(3001, () => console.log('Backend running on http://localhost:3001'));