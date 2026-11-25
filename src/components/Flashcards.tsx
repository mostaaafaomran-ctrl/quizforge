import { useState } from 'react';
import { Lang, t } from '../lib/i18n';
import { Flashcard } from '../lib/types';

export default function Flashcards({ lang, cards }: { lang: Lang; cards: Flashcard[] }) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);

  if (cards.length === 0) return <div className="card"><h2>{t(lang, 'flashcards')}</h2><p style={{ color: 'var(--muted)' }}>No flashcards.</p></div>;

  const c = cards[idx];
  const advance = (knew: boolean) => {
    if (knew) setKnown((k) => k + 1);
    setFlipped(false);
    setIdx((i) => (i + 1) % cards.length);
  };

  return (
    <div className="card">
      <div className="qprogress">{t(lang, 'cardOf', { a: idx + 1, b: cards.length })}</div>
      <div className="flashcard" dir="auto" onClick={() => setFlipped(!flipped)}>
        <div>
          <span className="face">{flipped ? (lang === 'ar' ? 'الإجابة' : 'Answer') : lang === 'ar' ? 'السؤال' : 'Question'}</span>
          {flipped ? c.back : c.front}
        </div>
      </div>
      <div className="flash-actions">
        {flipped ? (
          <>
            <button className="btn bad" onClick={() => advance(false)}>{t(lang, 'didntKnow')}</button>
            <button className="btn good" onClick={() => advance(true)}>{t(lang, 'knewIt')}</button>
          </>
        ) : (
          <button className="btn" onClick={() => setFlipped(true)}>{t(lang, 'flip')}</button>
        )}
      </div>
    </div>
  );
}
