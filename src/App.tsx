import { useEffect, useState } from 'react';
import { loadProjects, saveProject, deleteProject } from './db';
import type { Project } from './types';
import { templates, emptyProject } from './templates';
import { uid } from './utils/date';
import { parseJSONFile } from './utils/export';
import Home from './components/Home';
import Editor from './components/Editor';
import CompareView from './components/CompareView';

type View = 'home' | 'editor' | 'compare';

export default function App() {
  const [view, setView] = useState<View>('home');
  const [projects, setProjects] = useState<Project[]>([]);
  const [current, setCurrent] = useState<Project | null>(null);

  useEffect(() => {
    loadProjects().then(setProjects);
  }, []);

  const openProject = (p: Project) => {
    setCurrent(p);
    setView('editor');
  };

  const createFromTemplate = (t: (typeof templates)[number]) => {
    const p = t.build();
    saveProject(p).then(() => loadProjects().then(setProjects));
    openProject(p);
  };

  const createEmpty = () => {
    const p = emptyProject('새 타임라인');
    saveProject(p).then(() => loadProjects().then(setProjects));
    openProject(p);
  };

  const duplicateStudent = (p: Project) => {
    const copy: Project = {
      ...p,
      id: uid(),
      title: `${p.title} (학생용)`,
      locked: false,
      answerEvents: undefined,
      answerRelations: undefined,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      events: p.events.map((e) => ({ ...e })),
      relations: p.relations.map((r) => ({ ...r })),
    };
    saveProject(copy).then(() => loadProjects().then(setProjects));
    openProject(copy);
  };

  const updateProject = (p: Project) => {
    const next = { ...p, updatedAt: Date.now() };
    setCurrent(next);
    saveProject(next).then(() => loadProjects().then(setProjects));
  };

  const removeProject = async (id: string) => {
    await deleteProject(id);
    setProjects(await loadProjects());
    if (current?.id === id) { setCurrent(null); setView('home'); }
  };

  const importProject = async (file: File) => {
    const p = await parseJSONFile(file);
    p.id = p.id || uid();
    p.updatedAt = Date.now();
    await saveProject(p);
    setProjects(await loadProjects());
    openProject(p);
  };

  return (
    <div className="app">
      {view === 'home' && (
        <Home
          projects={projects}
          templates={templates}
          onOpen={openProject}
          onCreateEmpty={createEmpty}
          onCreateFromTemplate={createFromTemplate}
          onDelete={removeProject}
          onImport={importProject}
        />
      )}
      {view === 'editor' && current && (
        <Editor
          project={current}
          onChange={updateProject}
          onBack={() => { setView('home'); loadProjects().then(setProjects); }}
          onCompare={() => setView('compare')}
          onDuplicateStudent={duplicateStudent}
        />
      )}
      {view === 'compare' && current && (
        <CompareView
          project={current}
          onBack={() => setView('editor')}
        />
      )}
    </div>
  );
}
