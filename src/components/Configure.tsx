import { useState } from 'react';
import { Lang, t } from '../lib/i18n';
import { GenOptions } from '../lib/types';

export default function Configure({
  lang,
  sourceName,
  onBack,
  onGenerate,
}: {
  lang: Lang;
  sourceName: string;
  onBack: () => void;
  onGenerate: (opts: GenOptions) => void;
}) {
  const [mcqCount, setMcqCount] = useState(10);
  const [cardCount, setCardCount] = useState(8);
  const [difficulty, setDifficulty] = useState<GenOptions['difficulty']>('mixed');
  const [language, setLanguage] = useState<GenOptions['language']>('auto');

  return (
    <div className="card">
      <h2>{t(lang, 'configure')}</h2>
      <div className="field">
        <label>PDF</label>
        <div style={{ color: 'var(--accent2)' }}>{sourceName}</div>
      </div>
      <div className="row">
        <div className="field">
          <label>{t(lang, 'mcqCount')}</label>
          <div className="seg">
            {[5, 10, 15, 20].map((n) => (
              <button key={n} className={mcqCount === n ? 'on' : ''} onClick={() => setMcqCount(n)}>{n}</button>
            ))}
          </div>
        </div>
        <div className="field">
          <label>{t(lang, 'cardCount')}</label>
          <div className="seg">
            {[4, 8, 12, 16].map((n) => (
              <button key={n} className={cardCount === n ? 'on' : ''} onClick={() => setCardCount(n)}>{n}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="row">
        <div className="field">
          <label>{t(lang, 'difficulty')}</label>
          <div className="seg">
            {(['easy', 'medium', 'hard', 'mixed'] as const).map((d) => (
              <button key={d} className={difficulty === d ? 'on' : ''} onClick={() => setDifficulty(d)}>{t(lang, d)}</button>
            ))}
          </div>
        </div>
        <div className="field">
          <label>{t(lang, 'language')}</label>
          <div className="seg">
            {(['auto', 'english', 'arabic', 'mixed'] as const).map((l) => (
              <button key={l} className={language === l ? 'on' : ''} onClick={() => setLanguage(l)}>{t(lang, l)}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="row" style={{ justifyContent: 'flex-end', marginTop: 8 }}>
        <button className="btn ghost" onClick={onBack}>{t(lang, 'back')}</button>
        <button className="btn primary" onClick={() => onGenerate({ mcqCount, cardCount, difficulty, language })}>
          {t(lang, 'generate')}
        </button>
      </div>
    </div>
  );
}
