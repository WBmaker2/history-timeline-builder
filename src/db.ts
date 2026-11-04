import Dexie, { type Table } from 'dexie';
import type { Project } from './types';

export class HistoryDB extends Dexie {
  projects!: Table<Project, string>;
  constructor() {
    super('history-timeline-builder');
    this.version(1).stores({ projects: 'id, updatedAt, title' });
  }
}

export const db = new HistoryDB();

export async function loadProjects(): Promise<Project[]> {
  return db.projects.orderBy('updatedAt').reverse().toArray();
}

export async function saveProject(p: Project): Promise<void> {
  await db.projects.put(p);
}

export async function deleteProject(id: string): Promise<void> {
  await db.projects.delete(id);
}
