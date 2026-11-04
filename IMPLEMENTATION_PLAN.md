# 히스토리 타임라인 빌더 (History Timeline Builder) — 구현 계획

## 1. 개요
역사 사건 카드를 드래그로 시간순 정렬하고 인과관계를 연결하는 웹앱.
학생이 직접 타임라인을 구성하며 역사적 사고력을 기른다. API 없이 로컬 동작.

## 2. 목표 사용자
- 중·고등학생, 역사 교사

## 3. 핵심 기능
- 사건 카드 생성/편집 (제목, 날짜, 설명, 이미지 업로드)
- 드래그로 시간축 정렬 (자동 스케일)
- 사건 간 인과관계 연결선(화살표) + 라벨
- 테마별 템플릿(조선, 세계사, 한국 근현대 등)
- PDF/PNG 내보내기, JSON 저장/불러오기
- 교사: 정답 타임라인과 학생 답안 비교

## 4. 화면 구성
- 홈: 템플릿 선택/새 프로젝트
- 에디터: 좌측 사건 팔레트, 중앙 캔버스, 우측 속성 패널
- 비교 뷰: 정답 vs 학생
- 내보내기 모달

## 5. 기술 스택
- React + Vite + TypeScript
- 캔버스: SVG + d3-scale (또는 순수 SVG)
- DnD: @dnd-kit/core
- 내보내기: html2canvas + jsPDF
- 저장: IndexedDB (Dexie) + JSON

## 6. 데이터 모델
- Event { id, title, date, description, image, color }
- Relation { from, to, label, type }
- Project { id, title, theme, events, relations, viewport }

## 7. 구현 단계
1. 프로젝트 세팅
2. 이벤트 모델 & CRUD
3. 시간축 렌더링 & 드래그 정렬
4. 관계선 그리기 (SVG path)
5. 템플릿 데이터
6. 내보내기 (PNG/PDF/JSON)
7. 비교 모드
8. 접근성/반응형

## 8. 비기능 요구사항
- 큰 타임라인 성능 (가상화)
- 인쇄 최적화 CSS

## 9. 검증
- 단위: 날짜 파싱, 정렬
- E2E: 카드 생성→정렬→내보내기
