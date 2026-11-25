import { useEffect, useState } from 'react';
import { Lang, t } from './lib/i18n';
import { GenOptions, KeyConfig, MCQ, Flashcard as FC, QuizSet } from './lib/types';
import { loadKey } from './lib/ai';
import { extractPdfText } from './lib/pdf';
import { generateQuestions } from './lib/generate';
import { DEMO_SET } from './lib/demo';
import Home from './components/Home';
import SettingsModal from './components/SettingsModal';
import Configure from './components/Configure';
import Quiz from './components/Quiz';
import Flashcards from './components/Flashcards';
import ExportPanel from './components/ExportPanel';

type Stage =
  | { name: 'home' }
  | { name: 'configure'; text: string; sourceName: string }
  | { name: 'generating'; text: string; sourceName: string; opts: GenOptions }
  | { name: 'results'; set: QuizSet }
  | { name: 'error'; message: string };

function initialStage(): Stage {
  const p = new URLSearchParams(window.location.search).get('preview');
  if (p === 'configure') return { name: 'configure', text: 'sample', sourceName: 'Data-Structures-Lecture-3.pdf' };
  if (p === 'results') return { name: 'results', set: DEMO_SET };
  return { name: 'home' };
}

export default function App() {
  const [lang, setLang] = useState<Lang>(() => (new URLSearchParams(window.location.search).get('lang') === 'en' ? 'en' : 'ar'));
  const [key, setKey] = useState<KeyConfig | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [stage, setStage] = useState<Stage>(initialStage());
  const [progress, setProgress] = useState<{ done: number; total: number; label: string } | null>(null);
  const [tab, setTab] = useState<'quiz' | 'cards' | 'export'>(() => { const p = new URLSearchParams(window.location.search).get('tab'); return p === 'cards' || p === 'export' ? p : 'quiz'; });

  useEffect(() => {
    setKey(loadKey());
  }, [showSettings]);

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const handleFile = async (file: File) => {
    if (!key) {
      setShowSettings(true);
      return;
    }
    setProgress({ done: 0, total: 1, label: t(lang, 'extracting') });
    try {
      const text = await extractPdfText(file, (p, total) =>
        setProgress({ done: p, total, label: t(lang, 'extracting') })
      );
      setProgress(null);
      if (text.trim().length < 100) throw new Error('This PDF has very little text (scanned image?).');
      setStage({ name: 'configure', text, sourceName: file.name });
    } catch (e) {
      setProgress(null);
      setStage({ name: 'error', message: (e as Error).message });
    }
  };

  const handleGenerate = async (text: string, sourceName: string, opts: GenOptions) => {
    if (!key) {
      setShowSettings(true);
      return;
    }
    const s: Stage = { name: 'generating', text, sourceName, opts };
    setStage(s);
    setProgress({ done: 0, total: 1, label: t(lang, 'generating') });
    try {
      const items = await generateQuestions(text, opts, key, (done, total) =>
        setProgress({ done, total, label: t(lang, 'generating') })
      );
      setProgress(null);
      if (items.length === 0) throw new Error('The AI returned no questions. Try again.');
      setTab('quiz');
      setStage({ name: 'results', set: { title: sourceName.replace(/\.pdf$/i, ''), sourceName, items } });
    } catch (e) {
      setProgress(null);
      setStage({ name: 'error', message: (e as Error).message });
    }
  };

  return (
    <div className="app">
      <header className="topbar">
        <div className="logo">
          Quiz<span>Forge</span>
        </div>
        <div className="topbar-actions">
          <button className="btn ghost" onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}>
            {lang === 'ar' ? 'EN' : 'عربي'}
          </button>
          <button className="btn" onClick={() => setShowSettings(true)}>{t(lang, 'settings')}</button>
          {stage.name === 'results' && (
            <button className="btn" onClick={() => setStage({ name: 'home' })}>{t(lang, 'newFile')}</button>
          )}
        </div>
      </header>

      {stage.name === 'home' && (
        <Home
          lang={lang}
          hasKey={!!key}
          onFile={handleFile}
          onText={(txt) => setStage({ name: 'configure', text: txt, sourceName: t(lang, 'pasteTitle') })}
          onDemo={() => { setTab('quiz'); setStage({ name: 'results', set: DEMO_SET }); }}
          onOpenSettings={() => setShowSettings(true)}
        />
      )}

      {progress && stage.name !== 'generating' && (
        <div className="card center">
          <div className="spinner" />
          <div>{progress.label}</div>
          <div className="progress"><div style={{ width: (progress.done / progress.total) * 100 + '%' }} /></div>
          <div className="qprogress">{t(lang, 'chunkOf', { a: progress.done, b: progress.total })}</div>
        </div>
      )}

      {stage.name === 'configure' && (
        <Configure
          lang={lang}
          sourceName={stage.sourceName}
          onBack={() => setStage({ name: 'home' })}
          onGenerate={(opts) => handleGenerate(stage.text, stage.sourceName, opts)}
        />
      )}

      {stage.name === 'generating' && progress && (
        <div className="card center">
          <div className="spinner" />
          <div>{progress.label}</div>
          <div className="progress"><div style={{ width: (progress.done / progress.total) * 100 + '%' }} /></div>
          <div className="qprogress">{t(lang, 'chunkOf', { a: progress.done, b: progress.total })}</div>
        </div>
      )}

      {stage.name === 'results' && (
        <>
          <div className="tabs">
            <button className={tab === 'quiz' ? 'on' : ''} onClick={() => setTab('quiz')}>
              {t(lang, 'quiz')} ({stage.set.items.filter((i) => i.kind === 'mcq').length})
            </button>
            <button className={tab === 'cards' ? 'on' : ''} onClick={() => setTab('cards')}>
              {t(lang, 'flashcards')} ({stage.set.items.filter((i) => i.kind === 'card').length})
            </button>
            <button className={tab === 'export' ? 'on' : ''} onClick={() => setTab('export')}>
              {t(lang, 'exportTab')}
            </button>
          </div>
          {tab === 'quiz' && <Quiz lang={lang} questions={stage.set.items.filter((i): i is MCQ => i.kind === 'mcq')} />}
          {tab === 'cards' && <Flashcards lang={lang} cards={stage.set.items.filter((i): i is FC => i.kind === 'card')} />}
          {tab === 'export' && <ExportPanel lang={lang} set={stage.set} />}
        </>
      )}

      {stage.name === 'error' && (
        <div className="card">
          <h2>{t(lang, 'errorGeneric')}</h2>
          <p style={{ color: 'var(--danger)' }}>{stage.message}</p>
          <button className="btn" onClick={() => setStage({ name: 'home' })}>{t(lang, 'back')}</button>
        </div>
      )}

      {showSettings && <SettingsModal lang={lang} initial={key} onClose={() => setShowSettings(false)} />}
    </div>
  );
}
