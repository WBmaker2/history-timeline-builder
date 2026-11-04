import type { Project } from '../types';
import type { Template } from '../templates';
import updateLog from '../../docs/UPDATELOG.md?raw';
import { useState } from 'react';

export default function Home({
  projects,
  templates,
  onOpen,
  onCreateEmpty,
  onCreateFromTemplate,
  onDelete,
  onImport,
}: {
  projects: Project[];
  templates: Template[];
  onOpen: (p: Project) => void;
  onCreateEmpty: () => void;
  onCreateFromTemplate: (t: Template) => void;
  onDelete: (id: string) => void;
  onImport: (f: File) => void;
}) {
  const [logOpen, setLogOpen] = useState(false);
  return (
    <div className="home">
      <header className="home-header">
        <h1>히스토리 타임라인 빌더</h1>
        <p>역사 사건 카드를 드래그로 정렬하고 인과관계를 연결하세요.</p>
        <button className="btn" onClick={() => setLogOpen(true)}>업데이트 내역</button>
      </header>

      <section className="home-section">
        <div className="home-section-head">
          <h2>새 프로젝트</h2>
          <div className="home-actions">
            <button className="btn primary" onClick={onCreateEmpty}>빈 타임라인</button>
            <label className="btn">
              JSON 불러오기
              <input type="file" accept="application/json" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) onImport(f); e.target.value = ''; }} />
            </label>
          </div>
        </div>
        <div className="template-grid">
          {templates.map((t) => (
            <button key={t.id} className="template-card" onClick={() => onCreateFromTemplate(t)}>
              <div className="template-name">{t.name}</div>
              <div className="template-desc">{t.description}</div>
            </button>
          ))}
        </div>
      </section>

      <section className="home-section">
        <h2>내 프로젝트</h2>
        {projects.length === 0 && <p className="muted">저장된 프로젝트가 없습니다.</p>}
        <div className="project-list">
          {projects.map((p) => (
            <div key={p.id} className="project-item">
              <button className="project-open" onClick={() => onOpen(p)}>
                <span className="project-title">{p.title}</span>
                <span className="project-meta">{p.theme} · 사건 {p.events.length}개 · {new Date(p.updatedAt).toLocaleDateString()}</span>
              </button>
              <button className="btn danger small" onClick={() => onDelete(p.id)}>삭제</button>
            </div>
          ))}
        </div>
      </section>
      {logOpen && (
        <div className="modal-overlay" onClick={() => setLogOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520, maxHeight: '70vh', overflow: 'auto' }}>
            <h3>업데이트 내역</h3>
            <pre style={{ whiteSpace: 'pre-wrap', fontSize: 13, lineHeight: 1.6 }}>{updateLog}</pre>
            <button className="btn" onClick={() => setLogOpen(false)}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
}
