import { Lang, t } from '../lib/i18n';
import { QuizSet } from '../lib/types';
import { exportAnki, exportCsv, exportJson } from '../lib/export';

export default function ExportPanel({ lang, set }: { lang: Lang; set: QuizSet }) {
  return (
    <div className="card">
      <h2>{t(lang, 'exportTab')}</h2>
      <div className="export-btns">
        <button className="btn" onClick={() => exportAnki(set)}>
          {t(lang, 'exportAnki')}
          <small>{t(lang, 'exportHint')}</small>
        </button>
        <button className="btn" onClick={() => exportCsv(set)}>{t(lang, 'exportCsv')}</button>
        <button className="btn" onClick={() => exportJson(set)}>{t(lang, 'exportJson')}</button>
      </div>
    </div>
  );
}
