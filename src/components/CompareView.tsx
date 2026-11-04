import type { Project } from '../types';
import Timeline from './Timeline';
import { parseDate } from '../utils/date';

export default function CompareView({ project, onBack }: { project: Project; onBack: () => void }) {
  const answerEvents = project.answerEvents || [];
  const answerRels = project.answerRelations || [];

  // order score: fraction of adjacent pairs preserved (Kendall-like simple)
  const studentOrder = [...project.events].sort((a, b) => parseDate(a.date) - parseDate(b.date)).map((e) => e.id);
  const answerOrder = [...answerEvents].sort((a, b) => parseDate(a.date) - parseDate(b.date)).map((e) => e.id);
  let orderMatches = 0;
  const totalPairs = Math.max(1, (answerOrder.length * (answerOrder.length - 1)) / 2);
  for (let i = 0; i < answerOrder.length; i++) {
    for (let j = i + 1; j < answerOrder.length; j++) {
      const a = answerOrder.indexOf(answerOrder[i]);
      const b = answerOrder.indexOf(answerOrder[j]);
      const sa = studentOrder.indexOf(answerOrder[i]);
      const sb = studentOrder.indexOf(answerOrder[j]);
      if (sa !== -1 && sb !== -1 && (sa < sb) === (a < b)) orderMatches++;
    }
  }
  const orderScore = Math.round((orderMatches / totalPairs) * 100);

  const relKey = (r: { from: string; to: string }) => `${r.from}->${r.to}`;
  const answerRelSet = new Set(answerRels.map(relKey));
  const studentRelSet = new Set(project.relations.map(relKey));
  let relMatch = 0;
  answerRelSet.forEach((k) => { if (studentRelSet.has(k)) relMatch++; });
  const relScore = answerRelSet.size ? Math.round((relMatch / answerRelSet.size) * 100) : 100;

  return (
    <div className="compare">
      <div className="editor-topbar">
        <button className="btn" onClick={onBack}>← 에디터</button>
        <h2>비교 뷰</h2>
      </div>
      <div className="compare-scores">
        <div className="score-card">순서 일치: <strong>{orderScore}%</strong></div>
        <div className="score-card">인과관계 일치: <strong>{relScore}%</strong></div>
      </div>
      <div className="compare-panels">
        <div className="compare-panel">
          <h3>정답</h3>
          <Timeline events={answerEvents} relations={answerRels} selectedId={null} onSelectEvent={() => {}} readOnly height={420} />
        </div>
        <div className="compare-panel">
          <h3>학생 답안</h3>
          <Timeline events={project.events} relations={project.relations} selectedId={null} onSelectEvent={() => {}} readOnly height={420} />
        </div>
      </div>
      {answerEvents.length === 0 && <p className="muted" style={{ padding: 16 }}>정답이 저장되지 않았습니다. 에디터에서 "정답 저장"을 먼저 하세요.</p>}
    </div>
  );
}
