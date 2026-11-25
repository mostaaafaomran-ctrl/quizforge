import { QAItem, QuizSet } from './types';

function download(filename: string, content: string, mime: string) {
  const blob = new Blob(['﻿' + content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportAnki(set: QuizSet) {
  const rows: string[] = [];
  for (const item of set.items) {
    if (item.kind === 'card') {
      rows.push(esc(item.front) + '\t' + esc(item.back));
    } else {
      const front = item.question + '<br><br>' + item.options.map((o, i) => String.fromCharCode(65 + i) + '. ' + o).join('<br>');
      const back = String.fromCharCode(65 + item.answerIndex) + '. ' + item.options[item.answerIndex] + (item.explanation ? '<br><br>' + item.explanation : '');
      rows.push(esc(front) + '\t' + esc(back));
    }
  }
  download('quizforge-anki.tsv', rows.join('\n'), 'text/tab-separated-values');
}

function esc(s: string): string {
  return s.replace(/\t/g, ' ').replace(/\n/g, '<br>');
}

export function exportCsv(set: QuizSet) {
  const q = (s: string) => '"' + s.replace(/"/g, '""') + '"';
  const lines = ['type,question,option_a,option_b,option_c,option_d,correct,explanation,front,back'];
  for (const item of set.items) {
    if (item.kind === 'mcq') {
      const opts = [0, 1, 2, 3].map((i) => q(item.options[i] ?? ''));
      lines.push(['mcq', q(item.question), ...opts, String.fromCharCode(65 + item.answerIndex), q(item.explanation ?? ''), '', ''].join(','));
    } else {
      lines.push(['card', '', '', '', '', '', '', '', q(item.front), q(item.back)].join(','));
    }
  }
  download('quizforge-questions.csv', lines.join('\n'), 'text/csv');
}

export function exportJson(set: QuizSet) {
  download('quizforge-questions.json', JSON.stringify(set, null, 2), 'application/json');
}
