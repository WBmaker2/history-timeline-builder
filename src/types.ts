export type EventItem = {
  id: string;
  title: string;
  date: string;
  description: string;
  image?: string;
  color: string;
};

export type RelationType = 'cause' | 'influence' | 'sequence';

export type Relation = {
  id: string;
  from: string;
  to: string;
  label: string;
  type: RelationType;
};

export type Viewport = { scale: number; offset: number };

export type Project = {
  id: string;
  title: string;
  theme: string;
  events: EventItem[];
  relations: Relation[];
  viewport: Viewport;
  createdAt: number;
  updatedAt: number;
  answerEvents?: EventItem[];
  answerRelations?: Relation[];
};
