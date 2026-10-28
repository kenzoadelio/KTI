import React, { useState } from 'react';
import {
  Wrench,
  ShieldCheck,
  Quote,
  Compass,
  Calendar,
  Receipt,
  BarChart3,
  ListChecks,
  BookMarked,
  Award,
  BookOpen,
  FileDown,
  BarChart,
  Sparkles,
} from 'lucide-react';
import { ProposalData } from '../types';
import { PlagiarismChecker } from './PlagiarismChecker';
import { CitationStudio } from './CitationStudio';
import { MethodologyWizard } from './MethodologyWizard';
import { ResearchTimeline } from './ResearchTimeline';
import { BudgetEstimator } from './BudgetEstimator';
import { StatisticalSelector } from './StatisticalSelector';
import { QuestionnaireBuilder } from './QuestionnaireBuilder';
import { AcademicPhrasebank } from './AcademicPhrasebank';
import { ProposalRubricReviewer } from './ProposalRubricReviewer';
import { ScientificGlossary } from './ScientificGlossary';
import { DocumentExportStudio } from './DocumentExportStudio';
import { ChartStudio } from './ChartStudio';
import { useLanguage } from '../context/LanguageContext';

export type ToolkitTab =
  | 'plagiarism'
  | 'citation'
  | 'methodology'
  | 'timeline'
  | 'budget'
  | 'statistics'
  | 'questionnaire'
  | 'phrasebank'
  | 'rubric'
  | 'glossary'
  | 'export'
  | 'chart';

interface ResearchToolkitProps {
  currentProposal: ProposalData | null;
  initialTab?: ToolkitTab;
  onInsertToProposal?: (text: string) => void;
}

export const ResearchToolkit: React.FC<ResearchToolkitProps> = ({
  currentProposal,
  initialTab = 'plagiarism',
  onInsertToProposal,
}) => {
  const { language } = useLanguage();
  const [activeTool, setActiveTool] = useState<ToolkitTab>(initialTab);

  const tools: Array<{ id: ToolkitTab; labelId: string; labelEn: string; icon: React.ReactNode }> = [
    { id: 'plagiarism', labelId: 'Cek Plagiarisme', labelEn: 'Plagiarism Checker', icon: <ShieldCheck className="w-4 h-4 text-emerald-600" /> },
    { id: 'citation', labelId: 'Studio Sitasi (6 Gaya)', labelEn: 'Citation Studio (6 Styles)', icon: <Quote className="w-4 h-4 text-blue-600" /> },
    { id: 'methodology', labelId: 'Panduan Metodologi', labelEn: 'Methodology Wizard', icon: <Compass className="w-4 h-4 text-indigo-600" /> },
    { id: 'timeline', labelId: 'Timeline Gantt Chart', labelEn: 'Timeline & Gantt', icon: <Calendar className="w-4 h-4 text-amber-600" /> },
    { id: 'budget', labelId: 'Anggaran Biaya (RAB)', labelEn: 'Budget Estimator (RAB)', icon: <Receipt className="w-4 h-4 text-teal-600" /> },
    { id: 'statistics', labelId: 'Pemilih Uji Statistik', labelEn: 'Statistical Selector', icon: <BarChart3 className="w-4 h-4 text-purple-600" /> },
    { id: 'questionnaire', labelId: 'Penyusun Kuesioner', labelEn: 'Survey Questionnaire', icon: <ListChecks className="w-4 h-4 text-cyan-600" /> },
    { id: 'phrasebank', labelId: 'Kamus Frasa Akademis', labelEn: 'Academic Phrasebank', icon: <BookMarked className="w-4 h-4 text-rose-600" /> },
    { id: 'rubric', labelId: 'Rubrik Penjurian OPSI', labelEn: 'OPSI Rubric Reviewer', icon: <Award className="w-4 h-4 text-orange-600" /> },
    { id: 'glossary', labelId: 'Glosarium Sains & Audio', labelEn: 'Scientific Glossary', icon: <BookOpen className="w-4 h-4 text-sky-600" /> },
    { id: 'chart', labelId: 'Studio Grafik Data', labelEn: 'Data Chart Studio', icon: <BarChart className="w-4 h-4 text-emerald-600" /> },
    { id: 'export', labelId: 'Ekspor Word/MD/LaTeX', labelEn: 'Export Word/LaTeX', icon: <FileDown className="w-4 h-4 text-slate-700" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Top Toolkit Submenu Ribbon */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-3 sm:p-4 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          {tools.map((t) => {
            const isActive = activeTool === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTool(t.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{t.icon}</span>
                <span>{language === 'id' ? t.labelId : t.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Render Active Tool */}
      {activeTool === 'plagiarism' && <PlagiarismChecker />}
      {activeTool === 'citation' && <CitationStudio />}
      {activeTool === 'methodology' && <MethodologyWizard onInsertToBab3={onInsertToProposal} />}
      {activeTool === 'timeline' && <ResearchTimeline />}
      {activeTool === 'budget' && <BudgetEstimator />}
      {activeTool === 'statistics' && <StatisticalSelector />}
      {activeTool === 'questionnaire' && <QuestionnaireBuilder />}
      {activeTool === 'phrasebank' && <AcademicPhrasebank />}
      {activeTool === 'rubric' && <ProposalRubricReviewer currentProposal={currentProposal} />}
      {activeTool === 'glossary' && <ScientificGlossary />}
      {activeTool === 'chart' && <ChartStudio />}
      {activeTool === 'export' && <DocumentExportStudio currentProposal={currentProposal} />}
    </div>
  );
};
