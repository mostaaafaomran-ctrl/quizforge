export type MCQ = {
  kind: 'mcq';
  question: string;
  options: string[];
  answerIndex: number;
  explanation?: string;
};

export type Flashcard = {
  kind: 'card';
  front: string;
  back: string;
};

export type QAItem = MCQ | Flashcard;

export type QuizSet = {
  title: string;
  sourceName: string;
  items: QAItem[];
};

export type Provider = 'openai' | 'anthropic' | 'gemini';

export type GenOptions = {
  mcqCount: number;
  cardCount: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  language: 'auto' | 'english' | 'arabic' | 'mixed';
};

export type KeyConfig = {
  provider: Provider;
  apiKey: string;
  model: string;
};

export const DEFAULT_MODELS: Record<Provider, string> = {
  openai: 'gpt-4o-mini',
  anthropic: 'claude-haiku-4-5-20251001',
  gemini: 'gemini-2.0-flash',
};
