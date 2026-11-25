import { callAI } from './ai';
import { GenOptions, KeyConfig, MCQ, QAItem } from './types';

const CHUNK_SIZE = 6000;

function chunkText(text: string): string[] {
  const chunks: string[] = [];
  let i = 0;
  while (i < text.length) {
    let end = Math.min(i + CHUNK_SIZE, text.length);
    const nl = text.lastIndexOf('\n', end);
    if (nl > i + CHUNK_SIZE / 2) end = nl;
    chunks.push(text.slice(i, end));
    i = end;
  }
  return chunks.filter((c) => c.trim().length > 50);
}

function langInstruction(lang: GenOptions['language']): string {
  switch (lang) {
    case 'english':
      return 'Write everything in English.';
    case 'arabic':
      return 'Write everything in Arabic.';
    case 'mixed':
      return 'Write roughly half the questions in Arabic and half in English.';
    default:
      return 'Write in the same language as the document (if the document mixes Arabic and English, mix the same way).';
  }
}

function buildPrompt(text: string, opts: GenOptions, mcq: number, cards: number): { system: string; user: string } {
  const system = [
    'You generate study questions from course material for university students.',
    'Return ONLY valid JSON with this exact shape:',
    '{"mcq":[{"question":"...","options":["A","B","C","D"],"answerIndex":0,"explanation":"..."}],"cards":[{"front":"...","back":"..."}]}',
    'Rules: questions must be answerable from the text only. Options must be plausible. Keep questions short and clear.',
    langInstruction(opts.language),
    'Difficulty: ' + opts.difficulty + '.',
  ].join('\n');
  const user = 'Generate ' + mcq + ' multiple-choice questions and ' + cards + ' flashcards from this text:\n\n' + text;
  return { system, user };
}

function parseItems(json: string): QAItem[] {
  const cleaned = json.replace(/```json/g, '').replace(/```/g, '').trim();
  const data = JSON.parse(cleaned);
  const items: QAItem[] = [];
  for (const m of data.mcq ?? []) {
    if (m.question && Array.isArray(m.options) && m.options.length >= 2 && typeof m.answerIndex === 'number') {
      items.push({ kind: 'mcq', question: m.question, options: m.options, answerIndex: m.answerIndex, explanation: m.explanation });
    }
  }
  for (const c of data.cards ?? []) {
    if (c.front && c.back) items.push({ kind: 'card', front: c.front, back: c.back });
  }
  return items;
}

export async function generateQuestions(
  text: string,
  opts: GenOptions,
  key: KeyConfig,
  onProgress?: (done: number, total: number) => void
): Promise<QAItem[]> {
  const chunks = chunkText(text);
  if (chunks.length === 0) throw new Error('Not enough text in the document.');
  const perChunkMcq = Math.max(2, Math.ceil(opts.mcqCount / chunks.length));
  const perChunkCards = Math.max(1, Math.ceil(opts.cardCount / chunks.length));
  const all: QAItem[] = [];
  for (let i = 0; i < chunks.length; i++) {
    const { system, user } = buildPrompt(chunks[i], opts, perChunkMcq, perChunkCards);
    const raw = await callAI(key, system, user);
    all.push(...parseItems(raw));
    onProgress?.(i + 1, chunks.length);
  }
  const mcqs = all.filter((x): x is MCQ => x.kind === 'mcq').slice(0, opts.mcqCount);
  const cards = all.filter((x) => x.kind === 'card').slice(0, opts.cardCount);
  return [...mcqs, ...cards];
}
