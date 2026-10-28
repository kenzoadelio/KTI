import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  Download,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { TimelineTask } from '../types';
import { useLanguage } from '../context/LanguageContext';

const DEFAULT_TASKS: TimelineTask[] = [
  {
    id: 't-1',
    title: 'Penelusuran Literatur & Rumusan Masalah (Bab I)',
    chapter: 'Bab 1',
    startDate: '2026-10-01',
    endDate: '2026-10-15',
    progress: 100,
    isCompleted: true,
  },
  {
    id: 't-2',
    title: 'Kajian Teori & Matriks Penelitian Terdahulu (Bab II)',
    chapter: 'Bab 2',
    startDate: '2026-10-16',
    endDate: '2026-11-05',
    progress: 80,
    isCompleted: false,
  },
  {
    id: 't-3',
    title: 'Penyusunan Desain Eksperimen & Instrumen (Bab III)',
    chapter: 'Bab 3',
    startDate: '2026-11-06',
    endDate: '2026-11-20',
    progress: 50,
    isCompleted: false,
  },
  {
    id: 't-4',
    title: 'Pengambilan Data Laboratorium & Triplo Trial',
    chapter: 'Bab 3',
    startDate: '2026-11-21',
    endDate: '2026-12-10',
    progress: 20,
    isCompleted: false,
  },
  {
    id: 't-5',
    title: 'Analisis Statistik ANOVA & Pembahasan (Bab IV/V)',
    chapter: 'Bab 4/5',
    startDate: '2026-12-11',
    endDate: '2026-12-28',
    progress: 0,
    isCompleted: false,
  },
  {
    id: 't-6',
    title: 'Finishing Naskah, Cek Plagiarisme, & Gladi Sidang OPSI',
    chapter: 'Sidang/Lomba',
    startDate: '2027-01-05',
    endDate: '2027-01-20',
    progress: 0,
    isCompleted: false,
  },
];

export const ResearchTimeline: React.FC = () => {
  const { language } = useLanguage();
  const [tasks, setTasks] = useState<TimelineTask[]>(() => {
    try {
      const saved = localStorage.getItem('cendekia_timeline_tasks');
      return saved ? JSON.parse(saved) : DEFAULT_TASKS;
    } catch {
      return DEFAULT_TASKS;
    }
  });

  const [newTitle, setNewTitle] = useState('');
  const [newChapter, setNewChapter] = useState<'Bab 1' | 'Bab 2' | 'Bab 3' | 'Bab 4/5' | 'Sidang/Lomba'>('Bab 1');
  const [newStart, setNewStart] = useState('2026-11-01');
  const [newEnd, setNewEnd] = useState('2026-11-15');

  // Persist
  React.useEffect(() => {
    localStorage.setItem('cendekia_timeline_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleToggleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, isCompleted: !t.isCompleted, progress: !t.isCompleted ? 100 : t.progress }
          : t
      )
    );
  };

  const handleProgressChange = (id: string, val: number) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, progress: val, isCompleted: val === 100 }
          : t
      )
    );
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: TimelineTask = {
      id: `task_${Date.now()}`,
      title: newTitle.trim(),
      chapter: newChapter,
      startDate: newStart,
      endDate: newEnd,
      progress: 0,
      isCompleted: false,
    };

    setTasks((prev) => [...prev, newTask]);
    setNewTitle('');
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleDownloadCsv = () => {
    const headers = 'ID,Tahapan_Riset,Kategori,Tanggal_Mulai,Tanggal_Selesai,Progress_Persen,Status\n';
    const rows = tasks
      .map(
        (t) =>
          `"${t.id}","${t.title}","${t.chapter}","${t.startDate}","${t.endDate}",${t.progress}%,"${t.isCompleted ? 'Selesai' : 'Sedang Berjalan'}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timeline_riset_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const overallProgress = Math.round(
    tasks.reduce((acc, curr) => acc + curr.progress, 0) / (tasks.length || 1)
  );

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span className="font-semibold text-slate-700">
              {language === 'id' ? 'Manajemen Waktu Riset' : 'Research Time Management'}
            </span>
            <span>·</span>
            <span>{language === 'id' ? 'Target Penyelesaian Karya Tulis' : 'Thesis Completion Target'}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            <span>{language === 'id' ? 'Jadwal Riset & Timeline Gantt Chart' : 'Research Timeline & Gantt Planner'}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            {language === 'id'
              ? 'Pantau progres setiap tahapan penelitian dari Bab I hingga persiapan sidang dan penjurian lomba.'
              : 'Track progress for every research stage from Chapter I through defense and competition presentation.'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-2">
            <span>{language === 'id' ? 'Total Progres:' : 'Overall:'}</span>
            <span className="font-mono font-bold text-blue-600">{overallProgress}%</span>
          </div>

          <button
            type="button"
            onClick={handleDownloadCsv}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Task List & Visual Gantt Bar */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`p-4 rounded-2xl border transition-all ${
              task.isCompleted
                ? 'bg-slate-50/70 border-slate-200/60 opacity-90'
                : 'bg-white border-slate-200 shadow-2xs hover:border-slate-300'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => handleToggleComplete(task.id)}
                  className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-colors cursor-pointer ${
                    task.isCompleted
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-slate-300 hover:border-slate-400 bg-white'
                  }`}
                >
                  {task.isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>

                <div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-slate-900">{task.title}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.2 rounded-md bg-slate-100 text-slate-600">
                      {task.chapter}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5 font-mono">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{task.startDate} s.d. {task.endDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={task.progress}
                    onChange={(e) => handleProgressChange(task.id, Number(e.target.value))}
                    className="w-24 sm:w-28 accent-blue-600 cursor-pointer"
                  />
                  <span className="text-xs font-mono font-bold text-slate-700 w-9 text-right">
                    {task.progress}%
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteTask(task.id)}
                  className="p-1 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Visual Progress bar */}
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  task.progress === 100 ? 'bg-emerald-500' : 'bg-blue-600'
                }`}
                style={{ width: `${task.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Add New Milestone Task */}
      <form onSubmit={handleAddTask} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
        <span className="text-xs font-bold text-slate-700 block">
          {language === 'id' ? '+ Tambah Agenda Riset Baru:' : '+ Add New Research Task:'}
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs">
          <input
            type="text"
            required
            placeholder={language === 'id' ? 'Judul kegiatan riset...' : 'Research task name...'}
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="sm:col-span-2 px-3.5 py-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={newChapter}
            onChange={(e) => setNewChapter(e.target.value as any)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-900"
          >
            <option value="Bab 1">Bab 1: Pendahuluan</option>
            <option value="Bab 2">Bab 2: Tinjauan Pustaka</option>
            <option value="Bab 3">Bab 3: Metodologi</option>
            <option value="Bab 4/5">Bab 4/5: Hasil & Kesimpulan</option>
            <option value="Sidang/Lomba">Sidang / Lomba OPSI</option>
          </select>
          <button
            type="submit"
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{language === 'id' ? 'Tambah Tugas' : 'Add Task'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
