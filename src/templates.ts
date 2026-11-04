import type { Project, EventItem, Relation } from './types';
import { uid } from './utils/date';

function ev(title: string, date: string, description: string, color = '#4f46e5'): EventItem {
  return { id: uid(), title, date, description, color };
}

function rel(from: string, to: string, label: string, type: 'cause' | 'influence' | 'sequence' = 'cause'): Relation {
  return { id: uid(), from, to, label, type };
}

export type Template = { id: string; name: string; description: string; theme: string; build: () => Project };

function makeProject(title: string, theme: string, events: EventItem[], relations: Relation[]): Project {
  const now = Date.now();
  return { id: uid(), title, theme, events, relations, viewport: { scale: 1, offset: 0 }, locked: false, createdAt: now, updatedAt: now };
}

export const templates: Template[] = [
  {
    id: 'joseon',
    name: '조선 시대',
    description: '조선 건국부터 대한제국까지 주요 사건',
    theme: '조선',
    build: () => {
      const e = [
        ev('조선 건국', '1392-07-17', '이성계가 고려를 무너뜨리고 조선을 세움', '#7c3aed'),
        ev('훈민정음 반포', '1446-10-09', '세종대왕이 훈민정음을 반포', '#2563eb'),
        ev('임진왜란', '1592-04-13', '일본의 침략으로 발발한 전쟁', '#dc2626'),
        ev('병자호란', '1636-12-01', '청나라의 침략', '#dc2626'),
        ev('영조·정조 개혁', '1724-01-01', '탕평책과 개혁 정치', '#059669'),
        ev('갑오개혁', '1894-01-01', '근대적 개혁 시도', '#d97706'),
        ev('대한제국 선포', '1897-10-12', '고종이 대한제국을 선포', '#7c3aed'),
      ];
      const r = [
        rel(e[0].id, e[1].id, '한글 창제 기반', 'cause'),
        rel(e[2].id, e[3].id, '국력 약화', 'influence'),
        rel(e[5].id, e[6].id, '제국 선포', 'sequence'),
      ];
      return makeProject('조선 시대 타임라인', '조선', e, r);
    },
  },
  {
    id: 'world',
    name: '세계사 주요 사건',
    description: '르네상스부터 2차 세계대전까지',
    theme: '세계사',
    build: () => {
      const e = [
        ev('르네상스', '1400-01-01', '유럽의 문예부흥 운동', '#7c3aed'),
        ev('종교개혁', '1517-10-31', '마르틴 루터의 95개 조항', '#2563eb'),
        ev('프랑스 혁명', '1789-07-14', '부르봉 왕조 붕괴', '#dc2626'),
        ev('산업혁명', '1760-01-01', '증기기관 중심의 산업화', '#d97706'),
        ev('제1차 세계대전', '1914-07-28', '유럽 중심의 세계전쟁', '#dc2626'),
        ev('제2차 세계대전', '1939-09-01', '추축국 vs 연합국', '#dc2626'),
      ];
      const r = [
        rel(e[0].id, e[1].id, '사상적 토대', 'influence'),
        rel(e[2].id, e[4].id, '민족주의 확산', 'cause'),
        rel(e[3].id, e[4].id, '제국주의 경쟁', 'cause'),
      ];
      return makeProject('세계사 타임라인', '세계사', e, r);
    },
  },
  {
    id: 'korea-modern',
    name: '한국 근현대사',
    description: '개항기부터 현대까지',
    theme: '한국 근현대',
    build: () => {
      const e = [
        ev('강화도 조약', '1876-02-26', '조선의 개항', '#d97706'),
        ev('동학농민운동', '1894-01-01', '농민 봉기', '#dc2626'),
        ev('3·1 운동', '1919-03-01', '독립 만세 운동', '#2563eb'),
        ev('8·15 광복', '1945-08-15', '일제로부터의 해방', '#059669'),
        ev('6·25 전쟁', '1950-06-25', '남북 전쟁', '#dc2626'),
        ev('4·19 혁명', '1960-04-19', '학생·시민 봉기', '#7c3aed'),
        ev('6월 민주항쟁', '1987-06-01', '민주화 운동', '#7c3aed'),
      ];
      const r = [
        rel(e[0].id, e[1].id, '사회 불안', 'cause'),
        rel(e[2].id, e[3].id, '독립운동 성과', 'influence'),
        rel(e[4].id, e[5].id, '전후 혼란', 'cause'),
      ];
      return makeProject('한국 근현대사 타임라인', '한국 근현대', e, r);
    },
  },
];

export function emptyProject(title = '새 타임라인'): Project {
  const now = Date.now();
  return { id: uid(), title, theme: '일반', events: [], relations: [], viewport: { scale: 1, offset: 0 }, createdAt: now, updatedAt: now };
}
