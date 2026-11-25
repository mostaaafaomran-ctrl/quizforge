import { useMemo, useState } from 'react';
import { Lang, t } from '../lib/i18n';
import { MCQ } from '../lib/types';

export default function Quiz({ lang, questions }: { lang: Lang; questions: MCQ[] }) {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const done = idx >= questions.length;

  const score = useMemo(
    () => answers.reduce<number>((acc, a, i) => acc + (a === questions[i]?.answerIndex ? 1 : 0), 0),
    [answers, questions]
  );

  if (questions.length === 0) return <div className="card"><h2>{t(lang, 'quiz')}</h2><p style={{ color: 'var(--muted)' }}>No MCQ questions.</p></div>;

  if (done) {
    return (
      <div className="card center">
        <div style={{ color: 'var(--muted)' }}>{t(lang, 'score')}</div>
        <div className="score-big">{score} / {questions.length}</div>
        <button
          className="btn primary"
          style={{ marginTop: 18 }}
          onClick={() => { setIdx(0); setPicked(null); setChecked(false); setAnswers([]); }}
        >
          {t(lang, 'restart')}
        </button>
      </div>
    );
  }

  const q = questions[idx];
  return (
    <div className="card">
      <div className="qprogress">{t(lang, 'questionOf', { a: idx + 1, b: questions.length })}</div>
      <p className="qtext" dir="auto">{q.question}</p>
      {q.options.map((opt, i) => {
        let cls = 'opt';
        if (checked && i === q.answerIndex) cls += ' right';
        else if (checked && i === picked) cls += ' wrong';
        else if (picked === i) cls += ' sel';
        return (
          <button key={i} className={cls} dir="auto" disabled={checked} onClick={() => setPicked(i)}>
            <b style={{ marginInlineEnd: 8 }}>{String.fromCharCode(65 + i)}.</b> {opt}
          </button>
        );
      })}
      {checked && (
        <>
          <div className="expl" dir="auto">
            <b>{picked === q.answerIndex ? t(lang, 'correct') : t(lang, 'wrong')}</b>{' '}
            {q.explanation ?? ''}
          </div>
        </>
      )}
      <div className="qnav">
        <span />
        {!checked ? (
          <button
            className="btn primary"
            disabled={picked === null}
            onClick={() => {
              setChecked(true);
              setAnswers((a) => { const n = [...a]; n[idx] = picked; return n; });
            }}
          >
            {t(lang, 'check')}
          </button>
        ) : (
          <button
            className="btn primary"
            onClick={() => { setIdx(idx + 1); setPicked(null); setChecked(false); }}
          >
            {idx + 1 === questions.length ? t(lang, 'finish') : t(lang, 'next')}
          </button>
        )}
      </div>
    </div>
  );
}
