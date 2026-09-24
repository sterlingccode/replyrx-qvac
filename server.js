import express from 'express';
import { loadModel, completion, unloadModel, LLAMA_3_2_1B_INST_Q4_0 } from '@qvac/sdk';

const app = express();
const PORT = process.env.PORT || 3000;
let modelId = null;
let loadingPromise = null;

app.use(express.json({ limit: '1mb' }));
app.use(express.static('public'));

async function getModel() {
  if (modelId) return modelId;
  if (loadingPromise) return loadingPromise;

  loadingPromise = loadModel({
    modelSrc: LLAMA_3_2_1B_INST_Q4_0,
    onProgress: (progress) => {
      const pct = Number(progress?.percentage ?? 0).toFixed(0);
      console.log(`QVAC model: ${pct}%`);
    }
  })
    .then((id) => {
      modelId = id;
      return id;
    })
    .finally(() => {
      loadingPromise = null;
    });

  return loadingPromise;
}

function extractJson(text) {
  const cleaned = text.trim().replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('QVAC returned an invalid response.');
  return JSON.parse(cleaned.slice(start, end + 1));
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, qvacLoaded: Boolean(modelId) });
});

app.post('/api/analyze', async (req, res) => {
  const message = String(req.body?.message || '').trim();
  if (!message) return res.status(400).json({ error: 'Paste a message first.' });
  if (message.length > 5000) return res.status(400).json({ error: 'Please keep the message under 5,000 characters.' });

  try {
    const id = await getModel();
    const history = [{
      role: 'user',
      content: `You are ReplyRx, a practical message helper. Analyze the message below and return ONLY valid JSON with exactly these keys: intent, tone, context, friendly, direct, professional. intent must be one short phrase. tone must be 1-3 words. context must be one concise sentence explaining what the sender likely means without guessing hidden facts. friendly, direct, and professional must each be short, natural reply options that respond to the message without inventing details. Do not include markdown or extra text.\n\nMessage:\n${message}`
    }];

    const run = completion({ modelId: id, history, stream: true });
    let output = '';
    for await (const token of run.tokenStream) output += token;

    const result = extractJson(output);
    const required = ['intent', 'tone', 'context', 'friendly', 'direct', 'professional'];
    for (const key of required) {
      if (!result[key] || typeof result[key] !== 'string') throw new Error('QVAC returned incomplete reply suggestions.');
    }
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.message || 'QVAC could not analyze the message.' });
  }
});

const server = app.listen(PORT, () => {
  console.log(`ReplyRx running at http://localhost:${PORT}`);
});

async function shutdown() {
  try {
    if (modelId) await unloadModel({ modelId });
  } catch (error) {
    console.error('Model cleanup failed:', error);
  } finally {
    server.close(() => process.exit(0));
  }
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
