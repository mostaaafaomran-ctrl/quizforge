import { KeyConfig, Provider } from './types';

const LS_KEY = 'quizforge.key';

export function loadKey(): KeyConfig | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as KeyConfig) : null;
  } catch {
    return null;
  }
}

export function saveKey(cfg: KeyConfig) {
  localStorage.setItem(LS_KEY, JSON.stringify(cfg));
}

export function clearKey() {
  localStorage.removeItem(LS_KEY);
}

export async function callAI(cfg: KeyConfig, system: string, user: string): Promise<string> {
  if (cfg.provider === 'openai') return callOpenAI(cfg.apiKey, cfg.model, system, user);
  if (cfg.provider === 'anthropic') return callAnthropic(cfg.apiKey, cfg.model, system, user);
  return callGemini(cfg.apiKey, cfg.model, system, user);
}

async function callOpenAI(key: string, model: string, system: string, user: string): Promise<string> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + key },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      response_format: { type: 'json_object' },
    }),
  });
  if (!res.ok) throw new Error('OpenAI error ' + res.status + ': ' + (await res.text()).slice(0, 200));
  const data = await res.json();
  return data.choices[0].message.content;
}

async function callAnthropic(key: string, model: string, system: string, user: string): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      system,
      messages: [{ role: 'user', content: user }],
    }),
  });
  if (!res.ok) throw new Error('Anthropic error ' + res.status + ': ' + (await res.text()).slice(0, 200));
  const data = await res.json();
  return data.content.map((b: { text?: string }) => b.text ?? '').join('');
}

async function callGemini(key: string, model: string, system: string, user: string): Promise<string> {
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent?key=' + encodeURIComponent(key);
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ role: 'user', parts: [{ text: user }] }],
      generationConfig: { responseMimeType: 'application/json' },
    }),
  });
  if (!res.ok) throw new Error('Gemini error ' + res.status + ': ' + (await res.text()).slice(0, 200));
  const data = await res.json();
  return data.candidates[0].content.parts.map((p: { text?: string }) => p.text ?? '').join('');
}
