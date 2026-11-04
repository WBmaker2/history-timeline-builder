import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import type { Project } from '../types';

export async function exportPNG(el: HTMLElement, filename = 'timeline.png') {
  const canvas = await html2canvas(el, { scale: 2, backgroundColor: '#ffffff' });
  const url = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
}

export async function exportPDF(el: HTMLElement, filename = 'timeline.pdf') {
  const canvas = await html2canvas(el, { scale: 2, backgroundColor: '#ffffff' });
  const img = canvas.toDataURL('image/png');
  const pdf = new jsPDF({ orientation: canvas.width > canvas.height ? 'landscape' : 'portrait', unit: 'px', format: [canvas.width / 2, canvas.height / 2] });
  pdf.addImage(img, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
  pdf.save(filename);
}

export function exportJSON(project: Project) {
  const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${project.title || 'timeline'}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function parseJSONFile(file: File): Promise<Project> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try { resolve(JSON.parse(String(reader.result))); }
      catch (e) { reject(e); }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}
