import React, { useState } from 'react';
import {
  DollarSign,
  Plus,
  Trash2,
  Download,
  Copy,
  Check,
  Receipt,
  RotateCcw,
} from 'lucide-react';
import { BudgetItem } from '../types';
import { useLanguage } from '../context/LanguageContext';

const DEFAULT_BUDGET: BudgetItem[] = [
  {
    id: 'b-1',
    category: 'Bahan Habis Pakai',
    name: 'Pati Singkong Varietas Mukibat (Grade Laboratorium)',
    quantity: 5,
    unit: 'kg',
    pricePerUnit: 25000,
    total: 125000,
  },
  {
    id: 'b-2',
    category: 'Bahan Habis Pakai',
    name: 'Gliserol Murni 99% (Plasticizer)',
    quantity: 2,
    unit: 'liter',
    pricePerUnit: 85000,
    total: 170000,
  },
  {
    id: 'b-3',
    category: 'Bahan Habis Pakai',
    name: 'Minyak Atsiri Kulit Jeruk Manis (D-Limonena)',
    quantity: 500,
    unit: 'ml',
    pricePerUnit: 450,
    total: 225000,
  },
  {
    id: 'b-4',
    category: 'Peralatan & Sewa Lab',
    name: 'Sewa Alat Uji Tarik Universal Testing Machine (UTM)',
    quantity: 4,
    unit: 'sampel',
    pricePerUnit: 120000,
    total: 480000,
  },
  {
    id: 'b-5',
    category: 'Peralatan & Sewa Lab',
    name: 'Karakterisasi Gugus Fungsi FTIR Spektrofotometri',
    quantity: 2,
    unit: 'uji',
    pricePerUnit: 200000,
    total: 400000,
  },
  {
    id: 'b-6',
    category: 'Publikasi & Seminar',
    name: 'Pencetakan Poster & Banner Pameran OPSI / LKIR BRIN',
    quantity: 1,
    unit: 'paket',
    pricePerUnit: 250000,
    total: 250000,
  },
];

export const BudgetEstimator: React.FC = () => {
  const { language } = useLanguage();
  const [items, setItems] = useState<BudgetItem[]>(() => {
    try {
      const saved = localStorage.getItem('cendekia_budget_items');
      return saved ? JSON.parse(saved) : DEFAULT_BUDGET;
    } catch {
      return DEFAULT_BUDGET;
    }
  });

  const [newName, setNewName] = useState('');
  const [newCat, setNewCat] = useState<BudgetItem['category']>('Bahan Habis Pakai');
  const [newQty, setNewQty] = useState(1);
  const [newUnit, setNewUnit] = useState('buah');
  const [newPrice, setNewPrice] = useState(50000);
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    localStorage.setItem('cendekia_budget_items', JSON.stringify(items));
  }, [items]);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newItem: BudgetItem = {
      id: `item_${Date.now()}`,
      category: newCat,
      name: newName.trim(),
      quantity: Number(newQty) || 1,
      unit: newUnit.trim() || 'buah',
      pricePerUnit: Number(newPrice) || 0,
      total: (Number(newQty) || 1) * (Number(newPrice) || 0),
    };

    setItems((prev) => [...prev, newItem]);
    setNewName('');
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const totalBudget = items.reduce((sum, item) => sum + item.total, 0);

  const handleCopyBudgetProposal = () => {
    const text = `[Rencana Anggaran Biaya (RAB) Penelitian]\nTotal Anggaran: Rp${totalBudget.toLocaleString('id-ID')}\n\nRincian:\n${items
      .map(
        (it, idx) =>
          `${idx + 1}. ${it.name} (${it.category}) - ${it.quantity} ${it.unit} @ Rp${it.pricePerUnit.toLocaleString('id-ID')} = Rp${it.total.toLocaleString('id-ID')}`
      )
      .join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCsv = () => {
    const headers = 'Kategori,Nama_Item,Volume,Satuan,Harga_Satuan,Total_Harga\n';
    const rows = items
      .map(
        (it) =>
          `"${it.category}","${it.name}",${it.quantity},"${it.unit}",${it.pricePerUnit},${it.total}`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rab_penelitian_${new Date().toISOString().split('T')[0]}.csv`;
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
              {language === 'id' ? 'Estimasi Finansial Riset' : 'Research Budget Estimator'}
            </span>
            <span>·</span>
            <span>Format Standar Proposal Hibah & Lomba</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Receipt className="w-6 h-6 text-blue-600" />
            <span>{language === 'id' ? 'Kalkulator Rencana Anggaran Biaya (RAB)' : 'Research Budget & Expense Planner'}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            {language === 'id'
              ? 'Rancang rincian biaya bahan kimia, sewa pengujian laboratorium, dan publikasi secara terstruktur.'
              : 'Structure and estimate material purchases, laboratory testing fees, and publication costs.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <div className="text-right">
            <span className="text-[11px] text-slate-400 block font-medium">Total Anggaran:</span>
            <span className="text-lg sm:text-xl font-extrabold font-mono text-slate-900">
              Rp{totalBudget.toLocaleString('id-ID')}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopyBudgetProposal}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copied ? 'Tersalin' : 'Salin RAB'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadCsv}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Items Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-2xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="p-3">Uraian Kebutuhan</th>
              <th className="p-3">Kategori</th>
              <th className="p-3 text-right">Volume</th>
              <th className="p-3 text-right">Harga Satuan</th>
              <th className="p-3 text-right">Total</th>
              <th className="p-3 text-center w-12">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((it) => (
              <tr key={it.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="p-3 font-medium text-slate-900">{it.name}</td>
                <td className="p-3">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                    {it.category}
                  </span>
                </td>
                <td className="p-3 text-right font-mono text-slate-600">
                  {it.quantity} {it.unit}
                </td>
                <td className="p-3 text-right font-mono text-slate-600">
                  Rp{it.pricePerUnit.toLocaleString('id-ID')}
                </td>
                <td className="p-3 text-right font-mono font-bold text-slate-900">
                  Rp{it.total.toLocaleString('id-ID')}
                </td>
                <td className="p-3 text-center">
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(it.id)}
                    className="p-1 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add New Item Form */}
      <form onSubmit={handleAddItem} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
        <span className="text-xs font-bold text-slate-700 block">
          {language === 'id' ? '+ Tambah Komponen Biaya Baru:' : '+ Add New Budget Item:'}
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-6 gap-2 text-xs">
          <input
            type="text"
            required
            placeholder="Nama bahan / sewa alat..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="sm:col-span-2 px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={newCat}
            onChange={(e) => setNewCat(e.target.value as any)}
            className="px-2.5 py-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-900"
          >
            <option value="Bahan Habis Pakai">Bahan Habis Pakai</option>
            <option value="Peralatan & Sewa Lab">Peralatan & Sewa Lab</option>
            <option value="Transportasi & Lapangan">Transportasi & Lapangan</option>
            <option value="Publikasi & Seminar">Publikasi & Seminar</option>
            <option value="Lain-lain">Lain-lain</option>
          </select>
          <div className="flex items-center gap-1">
            <input
              type="number"
              min="1"
              value={newQty}
              onChange={(e) => setNewQty(Number(e.target.value))}
              className="w-16 px-2 py-2 bg-white border border-slate-200 rounded-xl font-medium text-center text-slate-900"
            />
            <input
              type="text"
              placeholder="satuan"
              value={newUnit}
              onChange={(e) => setNewUnit(e.target.value)}
              className="flex-1 px-2 py-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-900"
            />
          </div>
          <input
            type="number"
            min="0"
            step="1000"
            placeholder="Harga satuan"
            value={newPrice}
            onChange={(e) => setNewPrice(Number(e.target.value))}
            className="px-2.5 py-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-900 font-mono"
          />
          <button
            type="submit"
            className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah</span>
          </button>
        </div>
      </form>
    </div>
  );
};
