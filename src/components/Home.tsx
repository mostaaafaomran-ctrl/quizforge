import { useRef, useState } from 'react';
import { Lang, t } from '../lib/i18n';

export default function Home({
  lang,
  hasKey,
  onFile,
  onText,
  onDemo,
  onOpenSettings,
}: {
  lang: Lang;
  hasKey: boolean;
  onFile: (f: File) => void;
  onText: (txt: string) => void;
  onDemo: () => void;
  onOpenSettings: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [pasteMode, setPasteMode] = useState(false);
  const [pasted, setPasted] = useState('');

  return (
    <>
      <section className="hero">
        <h1>
          {lang === 'ar' ? (
            <>حوّل أي PDF <em>لأسئلة</em> في ثواني</>
          ) : (
            <>Turn any PDF into a <em>quiz</em> in seconds</>
          )}
        </h1>
        <p>{t(lang, 'heroSub')}</p>
      </section>

      {!hasKey && (
        <div className="banner">
          <span>{t(lang, 'noKeyBanner')}</span>
          <button className="btn primary" onClick={onOpenSettings}>{t(lang, 'settings')}</button>
        </div>
      )}

      {pasteMode ? (
        <div className="card">
          <h2>{t(lang, 'pasteTitle')}</h2>
          <div className="field">
            <textarea value={pasted} onChange={(e) => setPasted(e.target.value)} />
          </div>
          <div className="row" style={{ justifyContent: 'flex-end' }}>
            <button className="btn ghost" onClick={() => setPasteMode(false)}>{t(lang, 'cancel')}</button>
            <button className="btn primary" disabled={pasted.trim().length < 100} onClick={() => onText(pasted)}>
              {t(lang, 'useText')}
            </button>
          </div>
        </div>
      ) : (
        <div
          className={'dropzone' + (drag ? ' drag' : '')}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            const f = e.dataTransfer.files?.[0];
            if (f) onFile(f);
          }}
        >
          <div className="big">{t(lang, 'dropTitle')}</div>
          <div className="muted">{t(lang, 'dropOr')}</div>
          <div style={{ marginTop: 14, display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn primary">{t(lang, 'browse')}</button>
            <button className="btn" onClick={(e) => { e.stopPropagation(); setPasteMode(true); }}>{t(lang, 'pasteText')}</button>
          </div>
          <div style={{ marginTop: 14 }}>
            <button className="btn ghost" onClick={(e) => { e.stopPropagation(); onDemo(); }}>{t(lang, 'tryDemo')}</button>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onFile(f);
            }}
          />
        </div>
      )}

      <div className="steps">
        {[1, 2, 3].map((n) => (
          <div className="step" key={n}>
            <div className="n">{n}</div>
            <h3>{t(lang, ('step' + n + 't') as 'step1t')}</h3>
            <p>{t(lang, ('step' + n + 'd') as 'step1d')}</p>
          </div>
        ))}
      </div>

      <div className="privacy">
        <b>{lang === 'ar' ? 'خصوصية:' : 'Privacy:'}</b> {t(lang, 'privacyNote')}
      </div>
    </>
  );
}
