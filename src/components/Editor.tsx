import { useState, useRef, useEffect } from 'react';
import type { Project, EventItem, Relation } from '../types';
import { uid } from '../utils/date';
import Timeline from './Timeline';
import { exportPNG, exportPDF, exportJSON } from '../utils/export';

const COLORS = ['#4f46e5', '#2563eb', '#059669', '#d97706', '#dc2626', '#7c3aed', '#0891b2'];

export default function Editor({
  project,
  onChange,
  onBack,
  onCompare,
}: {
  project: Project;
  onChange: (p: Project) => void;
  onBack: () => void;
  onCompare: () => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedRelId, setSelectedRelId] = useState<string | null>(null);
  const [connectMode, setConnectMode] = useState(false);
  const [pendingFrom, setPendingFrom] = useState<string | null>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setConnectMode(false); setPendingFrom(null); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  const [exportOpen, setExportOpen] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const update = (patch: Partial<Project>) => onChange({ ...project, ...patch });

  const addEvent = () => {
    const ev: EventItem = { id: uid(), title: '새 사건', date: '', description: '', color: COLORS[project.events.length % COLORS.length] };
    update({ events: [...project.events, ev] });
    setSelectedId(ev.id);
    setSelectedRelId(null);
  };

  const updateEvent = (id: string, patch: Partial<EventItem>) => {
    update({ events: project.events.map((e) => (e.id === id ? { ...e, ...patch } : e)) });
  };

  const deleteEvent = (id: string) => {
    update({
      events: project.events.filter((e) => e.id !== id),
      relations: project.relations.filter((r) => r.from !== id && r.to !== id),
    });
    if (selectedId === id) setSelectedId(null);
  };

  const moveEvent = (id: string, newDate: string) => {
    updateEvent(id, { date: newDate });
  };

  const addRelation = (from: string, to: string) => {
    if (from === to) return;
    if (project.relations.some((r) => r.from === from && r.to === to)) return;
    const rel: Relation = { id: uid(), from, to, label: '', type: 'cause' };
    update({ relations: [...project.relations, rel] });
    setSelectedRelId(rel.id);
  };

  const updateRelation = (id: string, patch: Partial<Relation>) => {
    update({ relations: project.relations.map((r) => (r.id === id ? { ...r, ...patch } : r)) });
  };

  const deleteRelation = (id: string) => {
    update({ relations: project.relations.filter((r) => r.id !== id) });
    if (selectedRelId === id) setSelectedRelId(null);
  };

  const handleCardClick = (id: string) => {
    if (!pendingFrom) { setPendingFrom(id); return; }
    if (pendingFrom !== id) addRelation(pendingFrom, id);
    setPendingFrom(null);
    setConnectMode(false);
  };

  const selectedEvent = project.events.find((e) => e.id === selectedId) || null;
  const selectedRel = project.relations.find((r) => r.id === selectedRelId) || null;

  const onImageUpload = (file: File) => {
    if (!selectedId) return;
    const reader = new FileReader();
    reader.onload = () => updateEvent(selectedId, { image: String(reader.result) });
    reader.readAsDataURL(file);
  };

  const saveAsAnswer = () => {
    update({ answerEvents: project.events.map((e) => ({ ...e })), answerRelations: project.relations.map((r) => ({ ...r })) });
  };

  return (
    <div className="editor">
      <div className="editor-topbar">
        <button className="btn" onClick={onBack}>← 홈</button>
        <input
          className="title-input"
          value={project.title}
          onChange={(e) => update({ title: e.target.value })}
        />
        <select value={project.theme} onChange={(e) => update({ theme: e.target.value })} className="theme-select">
          <option>일반</option><option>조선</option><option>세계사</option><option>한국 근현대</option>
        </select>
        <button className="btn" onClick={() => setConnectMode((v) => !v)}>
          {connectMode ? '연결 모드 ON' : '인과관계 연결'}
        </button>
        <button className="btn" onClick={addEvent}>+ 사건</button>
        <button className="btn" onClick={() => setExportOpen(true)}>내보내기</button>
        <button className="btn" onClick={onCompare}>비교</button>
        <button className="btn" onClick={saveAsAnswer} title="현재 타임라인을 정답으로 저장">정답 저장</button>
      </div>

      <div className="editor-body">
        <aside className="palette">
          <h3>사건 목록</h3>
          <div className="palette-list">
            {project.events.map((e) => (
              <div
                key={e.id}
                className={`palette-item ${selectedId === e.id ? 'selected' : ''}`}
                onClick={() => { setSelectedId(e.id); setSelectedRelId(null); }}
              >
                <span className="palette-dot" style={{ background: e.color }} />
                <span className="palette-title">{e.title || '(제목 없음)'}</span>
                <span className="palette-date">{e.date}</span>
              </div>
            ))}
          </div>
          <p className="hint">카드를 드래그해 시간축 위치를 바꿀 수 있습니다.</p>
        </aside>

        <main className="canvas-wrap" ref={canvasRef}>
          <Timeline
            events={project.events}
            relations={project.relations}
            selectedId={selectedId}
            onSelectEvent={(id) => { setSelectedId(id); setSelectedRelId(null); }}
            onSelectRelation={(id) => { setSelectedRelId(id); setSelectedId(null); }}
            selectedRelationId={selectedRelId}
            onEventMove={moveEvent}
            connectMode={connectMode}
            pendingFrom={pendingFrom}
            onCardClick={handleCardClick}
          />
        </main>

        <aside className="props">
          <h3>속성</h3>
          {selectedEvent && (
            <div className="props-form">
              <label>제목<input value={selectedEvent.title} onChange={(e) => updateEvent(selectedEvent.id, { title: e.target.value })} /></label>
              <label>날짜<input value={selectedEvent.date} onChange={(e) => updateEvent(selectedEvent.id, { date: e.target.value })} placeholder="YYYY-MM-DD" /></label>
              <label>설명<textarea value={selectedEvent.description} onChange={(e) => updateEvent(selectedEvent.id, { description: e.target.value })} rows={4} /></label>
              <label>색상<input type="color" value={selectedEvent.color} onChange={(e) => updateEvent(selectedEvent.id, { color: e.target.value })} /></label>
              <label>이미지<input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) onImageUpload(f); e.target.value = ''; }} /></label>
              {selectedEvent.image && <img src={selectedEvent.image} alt="" className="props-img" />}
              <button className="btn danger" onClick={() => deleteEvent(selectedEvent.id)}>사건 삭제</button>
            </div>
          )}
          {selectedRel && (
            <div className="props-form">
              <label>라벨<input value={selectedRel.label} onChange={(e) => updateRelation(selectedRel.id, { label: e.target.value })} /></label>
              <label>유형
                <select value={selectedRel.type} onChange={(e) => updateRelation(selectedRel.id, { type: e.target.value as Relation['type'] })}>
                  <option value="cause">원인</option>
                  <option value="influence">영향</option>
                  <option value="sequence">순서</option>
                </select>
              </label>
              <button className="btn danger" onClick={() => deleteRelation(selectedRel.id)}>연결 삭제</button>
            </div>
          )}
          {!selectedEvent && !selectedRel && <p className="muted">사건 또는 연결선을 선택하세요.</p>}
        </aside>
      </div>

      {exportOpen && (
        <div className="modal-overlay" onClick={() => setExportOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>내보내기</h3>
            <div className="modal-actions">
              <button className="btn" onClick={() => { if (canvasRef.current) exportPNG(canvasRef.current, `${project.title}.png`); }}>PNG</button>
              <button className="btn" onClick={() => { if (canvasRef.current) exportPDF(canvasRef.current, `${project.title}.pdf`); }}>PDF</button>
              <button className="btn" onClick={() => exportJSON(project)}>JSON</button>
            </div>
            <button className="btn" onClick={() => setExportOpen(false)}>닫기</button>
          </div>
        </div>
      )}
      {connectMode && (
        <div className="connect-hint">
          {pendingFrom ? '도착 사건을 클릭하세요' : '출발 사건을 클릭하세요'} · ESC로 취소
        </div>
      )}
    </div>
  );
}
