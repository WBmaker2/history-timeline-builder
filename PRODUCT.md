# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: 중·고등학생이 수업·과제로 역사 사건 타임라인을 직접 구성하는 학습자. 교사가 과제·평가용으로 사용할 수 있으나 핵심 사용자는 학생.

## Product Purpose

역사 사건 카드를 시간순으로 정렬하고 사건 간 인과관계를 직접 연결하도록 하여, 학생이 타임라인을 '구성'하며 역사적 사고력을 기르는 웹앱. API 없이 브라우저에서 로컬 동작.

## Positioning

단순 연대기 나열이 아니라, 드래그 정렬 + 인과관계 연결선(라벨/유형)을 통해 학생이 사건 간 인과를 직접 설계하는 "생각하는 타임라인". 정답 비교 루브릭(순서·인과 일치도)으로 교사 평가 지원.

## Operating Context

수업·과제 환경(교실/가정), 데스크톱·태블릿·모바일. IndexedDB(Dexie) 로컬 저장, JSON 가져오기/내보내기. 템플릿(일반/조선/세계사/한국 근현대)로 빠른 시작. PNG/PDF/JSON 내보내기, 인쇄 CSS 지원.

## Capabilities and Constraints

- 사건 카드 CRUD (제목, 날짜, 설명, 이미지, 색상)
- 드래그로 시간축 정렬 (d3-scale 자동 스케일)
- 사건 간 인과관계 연결선(화살표) + 라벨/유형(원인·영향·순서)
- 테마별 템플릿
- PNG/PDF/JSON 내보내기 및 JSON 불러오기
- 정답 저장 및 비교 뷰(순서/인과관계 일치도 점수)
- IndexedDB 프로젝트 저장
- 교사: 정답 잠금, 학생용 복제
- 접근성: 키보드 탐색, ARIA, 포커스 스타일, 반응형, reduced-motion
- 오프라인 로컬 동작 (API 없음)
- 기술: React 19 + Vite 8 + TypeScript, @dnd-kit, d3-scale, html2canvas, jsPDF, Dexie
- 미결정: 빌드/배포 대상, 다국어

## Brand Commitments

한국어 UI. 제품명 "히스토리 타임라인 빌더". 교육용 톤.

## Evidence on Hand

- IMPLEMENTATION_PLAN.md, docs/NEXT_IMPLEMENTATION_PLAN.md, docs/E2E_SCENARIOS.md, docs/UPDATELOG.md
- src/ (React 컴포넌트, 유틸, 템플릿, 테스트)
- src/assets/hero.png
- 단위 테스트: src/utils/date.test.ts

## Product Principles

- 학생이 직접 구성하며 생각하도록 유도한다; UI는 사고를 방해하지 않는다.
- 오프라인·로컬 우선: 네트워크 없이도 모든 핵심 기능 동작.
- 교사 평가 루브릭(순서/인과 일치도)을 지원한다.
- 접근성은 기능이 아니라 기본이다.
- 데이터 모델·내보내기·접근성은 재구성 시 반드시 보존한다.

## Accessibility & Inclusion

키보드 탐색, ARIA 라벨, 포커스 스타일, 반응형 레이아웃, prefers-reduced-motion 대응. 학생·교사 대상 교육용 앱.
