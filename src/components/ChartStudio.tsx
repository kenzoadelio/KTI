import React, { useState } from 'react';
import {
  BarChart,
  LineChart,
  Plus,
  Trash2,
  Download,
  Copy,
  Check,
  Sparkles,
} from 'lucide-react';
import { DataChartPoint } from '../types';
import { useLanguage } from '../context/LanguageContext';

const DEFAULT_DATA: DataChartPoint[] = [
  { label: 'Kontrol (0%)', treatment: '0% Minyak Kulit Jeruk', replicate1: 14.2, replicate2: 13.8, replicate3: 14.5, mean: 14.17 },
  { label: 'Formula A (2%)', treatment: '2% Minyak Kulit Jeruk', replicate1: 18.5, replicate2: 19.1, replicate3: 18.9, mean: 18.83 },
  { label: 'Formula B (4%)', treatment: '4% Minyak Kulit Jeruk', replicate1: 24.6, replicate2: 25.2, replicate3: 24.8, mean: 24.87 },
  { label: 'Formula C (6%)', treatment: '6% Minyak Kulit Jeruk', replicate1: 21.0, replicate2: 20.4, replicate3: 21.2, mean: 20.87 },
];

export const ChartStudio: React.FC = () => {
  const { language } = useLanguage();
  const [dataPoints, setDataPoints] = useState<DataChartPoint[]>(DEFAULT_DATA);
  const [metricName, setMetricName] = useState('Kuat Tarik (Tensile Strength)');
  const [unit, setUnit] = useState('MPa');
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
  const [copied, setCopied] = useState(false);

  // New item inputs
  const [newLabel, setNewLabel] = useState('');
  const [r1, setR1] = useState(20);
  const [r2, setR2] = useState(20);
  const [r3, setR3] = useState(20);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) return;

    const mean = Number(((r1 + r2 + r3) / 3).toFixed(2));
    const newPt: DataChartPoint = {
      label: newLabel.trim(),
      treatment: newLabel.trim(),
      replicate1: r1,
      replicate2: r2,
      replicate3: r3,
      mean,
    };

    setDataPoints((prev) => [...prev, newPt]);
    setNewLabel('');
  };

  const handleDelete = (index: number) => {
    setDataPoints((prev) => prev.filter((_, i) => i !== index));
  };

  const maxMean = Math.max(...dataPoints.map((d) => d.mean), 1) * 1.25;

  const handleDownloadCsv = () => {
    const headers = 'Perlakuan,Ulangan_1,Ulangan_2,Ulangan_3,Rata_Rata,Satuan\n';
    const rows = dataPoints
      .map((d) => `"${d.label}",${d.replicate1},${d.replicate2},${d.replicate3},${d.mean},"${unit}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `data_grafik_eksperimen_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span className="font-semibold text-slate-700">
              {language === 'id' ? 'Visualisasi Data Hasil Penelitian' : 'Experimental Data Visualization'}
            </span>
            <span>·</span>
            <span>Triplo Replikasi & Standar Deviasi</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart className="w-6 h-6 text-blue-600" />
            <span>{language === 'id' ? 'Studio Grafik & Visualisasi Data Uji' : 'Data & Laboratory Chart Studio'}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            {language === 'id'
              ? 'Plot data hasil pengujian laboratorium Anda (ulangan triplo) ke dalam grafik batang dan garis siap sisip ke Bab IV.'
              : 'Plot laboratory trial data with triplicate replicates into bar and trend charts ready for Chapter 4.'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleDownloadCsv}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Control Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Nama Parameter Uji:</label>
          <input
            type="text"
            value={metricName}
            onChange={(e) => setMetricName(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
          />
        </div>
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Satuan Ukur:</label>
          <input
            type="text"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 font-mono"
          />
        </div>
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Tipe Grafik:</label>
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setChartType('bar')}
              className={`flex-1 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                chartType === 'bar' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Batang (Bar)
            </button>
            <button
              type="button"
              onClick={() => setChartType('line')}
              className={`flex-1 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                chartType === 'line' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Tren Garis (Line)
            </button>
          </div>
        </div>
      </div>

      {/* Interactive SVG Chart Rendering */}
      <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-800">
            {metricName} ({unit})
          </span>
          <span className="text-slate-400 font-mono text-[11px]">Rata-rata 3 Ulangan (Mean ± SD)</span>
        </div>

        {/* SVG Canvas */}
        <div className="h-56 w-full relative flex items-end justify-around pt-6 pb-6 px-4 bg-white rounded-xl border border-slate-200/80 overflow-hidden">
          {chartType === 'bar' ? (
            /* Bar Chart with error bar indicator */
            dataPoints.map((pt, idx) => {
              const heightPercent = Math.min(100, Math.max(8, (pt.mean / maxMean) * 100));
              return (
                <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end flex-1 max-w-20">
                  <span className="text-[11px] font-mono font-bold text-slate-800">
                    {pt.mean}
                  </span>
                  <div
                    className="w-10 sm:w-12 bg-blue-600 hover:bg-blue-500 rounded-t-lg transition-all duration-300 relative group cursor-pointer shadow-2xs"
                    style={{ height: `${heightPercent}%` }}
                  >
                    {/* Tooltip on hover */}
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                      U1: {pt.replicate1} | U2: {pt.replicate2} | U3: {pt.replicate3}
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-600 font-semibold text-center line-clamp-1 truncate w-full">
                    {pt.label}
                  </span>
                </div>
              );
            })
          ) : (
            /* Line Trend Representation */
            <div className="w-full h-full relative">
              <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible">
                <polyline
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={dataPoints
                    .map((pt, i) => {
                      const x = 40 + (i / (dataPoints.length - 1 || 1)) * 420;
                      const y = 130 - (pt.mean / maxMean) * 110;
                      return `${x},${y}`;
                    })
                    .join(' ')}
                />
                {dataPoints.map((pt, i) => {
                  const x = 40 + (i / (dataPoints.length - 1 || 1)) * 420;
                  const y = 130 - (pt.mean / maxMean) * 110;
                  return (
                    <g key={i}>
                      <circle cx={x} cy={y} r="5" fill="#1e40af" stroke="#ffffff" strokeWidth="2" />
                      <text x={x} y={y - 10} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#0f172a" fontFamily="monospace">
                        {pt.mean}
                      </text>
                      <text x={x} y="145" textAnchor="middle" fontSize="9" fill="#64748b">
                        {pt.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-2xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="p-3">Perlakuan Formulasi</th>
              <th className="p-3 text-right">Ulangan 1</th>
              <th className="p-3 text-right">Ulangan 2</th>
              <th className="p-3 text-right">Ulangan 3</th>
              <th className="p-3 text-right">Rata-Rata ({unit})</th>
              <th className="p-3 text-center w-12">Hapus</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {dataPoints.map((pt, i) => (
              <tr key={i} className="hover:bg-slate-50/60">
                <td className="p-3 font-semibold text-slate-900">{pt.label}</td>
                <td className="p-3 text-right font-mono text-slate-600">{pt.replicate1}</td>
                <td className="p-3 text-right font-mono text-slate-600">{pt.replicate2}</td>
                <td className="p-3 text-right font-mono text-slate-600">{pt.replicate3}</td>
                <td className="p-3 text-right font-mono font-bold text-blue-600">{pt.mean}</td>
                <td className="p-3 text-center">
                  <button
                    type="button"
                    onClick={() => handleDelete(i)}
                    className="p-1 text-slate-300 hover:text-rose-600 rounded cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Treatment Input */}
      <form onSubmit={handleAdd} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
        <span className="font-bold text-slate-700 block">+ Tambah Data Perlakuan Uji Baru:</span>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          <input
            type="text"
            required
            placeholder="Nama perlakuan (misal: 8% Atsiri)"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            className="sm:col-span-2 px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-900"
          />
          <input
            type="number"
            step="0.01"
            placeholder="Ulangan 1"
            value={r1}
            onChange={(e) => setR1(Number(e.target.value))}
            className="px-2.5 py-2 bg-white border border-slate-200 rounded-xl font-mono text-slate-900"
          />
          <input
            type="number"
            step="0.01"
            placeholder="Ulangan 2"
            value={r2}
            onChange={(e) => setR2(Number(e.target.value))}
            className="px-2.5 py-2 bg-white border border-slate-200 rounded-xl font-mono text-slate-900"
          />
          <div className="flex gap-1.5">
            <input
              type="number"
              step="0.01"
              placeholder="Ulangan 3"
              value={r3}
              onChange={(e) => setR3(Number(e.target.value))}
              className="flex-1 px-2.5 py-2 bg-white border border-slate-200 rounded-xl font-mono text-slate-900"
            />
            <button
              type="submit"
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold flex items-center justify-center cursor-pointer shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
