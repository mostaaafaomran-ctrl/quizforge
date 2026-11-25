import { useState } from 'react';
import { Lang, t } from '../lib/i18n';
import { DEFAULT_MODELS, KeyConfig, Provider } from '../lib/types';
import { saveKey } from '../lib/ai';

export default function SettingsModal({ lang, initial, onClose }: { lang: Lang; initial: KeyConfig | null; onClose: () => void }) {
  const [provider, setProvider] = useState<Provider>(initial?.provider ?? 'gemini');
  const [apiKey, setApiKey] = useState(initial?.apiKey ?? '');
  const [model, setModel] = useState(initial?.model ?? DEFAULT_MODELS[provider]);
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{t(lang, 'settings')}</h2>
        <div className="field">
          <label>{t(lang, 'provider')}</label>
          <div className="seg">
            {(['gemini', 'openai', 'anthropic'] as Provider[]).map((p) => (
              <button
                key={p}
                className={provider === p ? 'on' : ''}
                onClick={() => {
                  setProvider(p);
                  setModel(DEFAULT_MODELS[p]);
                }}
              >
                {p === 'gemini' ? 'Google Gemini' : p === 'openai' ? 'OpenAI' : 'Anthropic'}
              </button>
            ))}
          </div>
        </div>
        <div className="field">
          <label>{t(lang, 'apiKey')}</label>
          <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="sk-..." />
          <div className="help">{t(lang, 'keyHelp')}</div>
        </div>
        <div className="field">
          <label>{t(lang, 'model')}</label>
          <input type="text" value={model} onChange={(e) => setModel(e.target.value)} />
        </div>
        <div className="row" style={{ justifyContent: 'flex-end' }}>
          <button className="btn ghost" onClick={onClose}>{t(lang, 'cancel')}</button>
          <button
            className="btn primary"
            disabled={!apiKey.trim()}
            onClick={() => {
              saveKey({ provider, apiKey: apiKey.trim(), model: model.trim() || DEFAULT_MODELS[provider] });
              onClose();
            }}
          >
            {t(lang, 'save')}
          </button>
        </div>
      </div>
    </div>
  );
}
