import { useMemo, useRef, useState, memo } from 'react';
import { scaleLinear } from 'd3-scale';
import type { EventItem, Relation } from '../types';
import { parseDate } from '../utils/date';

const CARD_W = 170;
const CARD_H = 96;
const ROW_H = 130;
const PAD = 60;

type Layout = { id: string; x: number; y: number; row: number };

function computeLayout(events: EventItem[], width: number): { positions: Record<string, Layout>; scale: (d: number) => number; domain: [number, number] } {
  const ts = events.map((e) => parseDate(e.date));
  const min = ts.length ? Math.min(...ts) : Date.now();
  const max = ts.length ? Math.max(...ts) : Date.now() + 86400000;
  const lo = min === max ? min - 86400000 * 365 : min;
  const hi = min === max ? max + 86400000 * 365 : max;
  const scale = scaleLinear().domain([lo, hi]).range([PAD, Math.max(PAD + 100, width - PAD)]);
  const sorted = [...events].sort((a, b) => parseDate(a.date) - parseDate(b.date));
  const positions: Record<string, Layout> = {};
  const rowEnds: number[] = [];
  for (const ev of sorted) {
    const x = scale(parseDate(ev.date));
    let row = 0;
    while (rowEnds[row] !== undefined && x - rowEnds[row] < CARD_W + 24) row++;
    rowEnds[row] = x + CARD_W;
    positions[ev.id] = { id: ev.id, x: x - CARD_W / 2, y: 80 + row * ROW_H, row };
  }
  return { positions, scale: scale as (d: number) => number, domain: [lo, hi] };
}

function Timeline({
  events,
  relations,
  selectedId,
  onSelectEvent,
  onSelectRelation,
  selectedRelationId,
  onEventMove,
  readOnly,
  height = 520,
  connectMode,
  pendingFrom,
  onCardClick,
}: {
  events: EventItem[];
  relations: Relation[];
  selectedId: string | null;
  onSelectEvent: (id: string | null) => void;
  onSelectRelation?: (id: string | null) => void;
  selectedRelationId?: string | null;
  onEventMove?: (id: string, newDate: string) => void;
  readOnly?: boolean;
  height?: number;
  connectMode?: boolean;
  pendingFrom?: string | null;
  onCardClick?: (id: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(900);
  const [drag, setDrag] = useState<{ id: string; startX: number; startY: number; dx: number; dy: number; moved: boolean } | null>(null);
  const movedRef = useRef(false);

  const resizeRef = (el: HTMLDivElement | null) => {
    if (el) {
      containerRef.current = el;
      const w = el.clientWidth;
      if (w && w !== width) setWidth(w);
    }
  };

  const { positions, scale, domain } = useMemo(() => computeLayout(events, width), [events, width]);
  const sc = scale as any;

  const ticks = useMemo(() => {
    const [lo, hi] = domain;
    const count = 6;
    const step = (hi - lo) / count;
    return Array.from({ length: count + 1 }, (_, i) => lo + step * i);
  }, [domain]);

  const handlePointerDown = (ev: EventItem, e: React.PointerEvent) => {
    if (readOnly || !onEventMove) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    movedRef.current = false;
    setDrag({ id: ev.id, startX: e.clientX, startY: e.clientY, dx: 0, dy: 0, moved: false });
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!drag) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) movedRef.current = true;
    setDrag({ ...drag, dx, dy, moved: movedRef.current });
  };
  const handlePointerUp = () => {
    if (!drag) return;
    const { id, dx, moved } = drag;
    if (moved && onEventMove) {
      const pos = positions[id];
      if (pos) {
        const centerX = pos.x + CARD_W / 2 + dx;
        const inv = sc.invert(centerX);
        const d = new Date(inv);
        const newDate = isNaN(d.getTime()) ? String(Math.round(inv / (365.25 * 86400000) + 1970)) : d.toISOString().slice(0, 10);
        onEventMove(id, newDate);
      }
    }
    setDrag(null);
  };

  return (
    <div ref={resizeRef} className="timeline-container" style={{ height }}>
      <svg className="timeline-axis" width={width} height={height} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <line x1={PAD} y1={60} x2={width - PAD} y2={60} stroke="#8a7355" strokeWidth={2} />
        {ticks.map((t, i) => {
          const x = scale(t);
          const label = new Date(t).getFullYear();
          return (
            <g key={i}>
              <line x1={x} y1={54} x2={x} y2={66} stroke="#8a7355" strokeWidth={1.5} />
              <text x={x} y={48} textAnchor="middle" fontSize={11} fill="#6b4f2a">{isNaN(label) ? '' : label}</text>
            </g>
          );
        })}
        {relations.map((rel) => {
          const from = positions[rel.from];
          const to = positions[rel.to];
          if (!from || !to) return null;
          const x1 = from.x + CARD_W / 2;
          const y1 = from.y + CARD_H;
          const x2 = to.x + CARD_W / 2;
          const y2 = to.y;
          const midX = (x1 + x2) / 2;
          const midY = (y1 + y2) / 2;
          const selected = selectedRelationId === rel.id;
          const color = selected ? '#c94a2a' : (rel.type === 'cause' ? '#c94a2a' : rel.type === 'influence' ? '#2a6a8a' : '#d4a020');
          return (
            <g key={rel.id} onClick={(e) => { e.stopPropagation(); onSelectRelation?.(rel.id); }} style={{ cursor: 'pointer', pointerEvents: 'auto' }}>
              <defs>
                <marker id={`arrow-${rel.id}`} markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L9,3 z" fill={color} />
                </marker>
              </defs>
              <path
                d={`M${x1},${y1} C${x1},${(y1 + y2) / 2} ${x2},${(y1 + y2) / 2} ${x2},${y2}`}
                fill="none"
                stroke={color}
                strokeWidth={selected ? 3 : 2.2}
                strokeDasharray={selected ? '0' : '0'}
                markerEnd={`url(#arrow-${rel.id})`}
              />
              <text x={midX} y={midY - 6} textAnchor="middle" fontSize={11} fill="#2b1d0e" className="relation-label">{rel.label}</text>
            </g>
          );
        })}
      </svg>
      <div className="timeline-cards" onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
        {events.map((ev) => {
          const pos = positions[ev.id];
          if (!pos) return null;
          const isDragging = drag?.id === ev.id;
          const transform = isDragging ? `translate3d(${drag!.dx}px, ${drag!.dy}px, 0)` : undefined;
          return (
            <div
              key={ev.id}
              className={`event-card ${selectedId === ev.id || pendingFrom === ev.id ? 'selected' : ''}`}
              style={{
                position: 'absolute',
                left: pos.x,
                top: pos.y,
                width: CARD_W,
                transform,
                zIndex: isDragging ? 50 : 10,
                cursor: readOnly ? 'pointer' : 'grab',
              }}
              role="button"
              tabIndex={readOnly ? -1 : 0}
              aria-label={`${ev.title || '사건'}, ${ev.date}`}
              aria-pressed={selectedId === ev.id || pendingFrom === ev.id}
              onKeyDown={(e) => {
                if (readOnly) return;
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (connectMode && onCardClick) onCardClick(ev.id); else onSelectEvent(ev.id); }
                if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && onEventMove) {
                  e.preventDefault();
                  const delta = e.key === 'ArrowLeft' ? -1 : 1;
                  const ts = parseDate(ev.date) + delta * 86400000;
                  const d = new Date(ts);
                  onEventMove(ev.id, isNaN(d.getTime()) ? ev.date : d.toISOString().slice(0, 10));
                }
              }}
              onPointerDown={(e) => handlePointerDown(ev, e)}
              onClick={(e) => {
                e.stopPropagation();
                if (movedRef.current) { movedRef.current = false; return; }
                if (connectMode && onCardClick) onCardClick(ev.id);
                else onSelectEvent(ev.id);
              }}
            >
              <div className="event-card-color" style={{ background: ev.color }} />
              <div className="event-card-title">{ev.title || '(제목 없음)'}</div>
              <div className="event-card-date">{ev.date}</div>
              {ev.image && <img src={ev.image} alt="" className="event-card-img" />}
            </div>
          );
        })}
      </div>
      {events.length === 0 && <div className="timeline-empty">사건을 추가하세요</div>}
    </div>
  );
}


export default memo(Timeline);
