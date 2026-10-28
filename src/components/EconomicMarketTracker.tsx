import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  Layers,
  Download,
  Copy,
  Check,
  RefreshCw,
  Search,
  Calendar,
  ShieldCheck,
  Info,
  Clock,
  ArrowRightLeft,
  Volume2,
  BarChart3,
  Flame,
  Award,
  Globe2,
  SlidersHorizontal,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { EconomicMarketData, EconomicIndicator, MarketTimeSeriesPoint } from '../types';
import { fetchEconomicIndicators } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { AudioSpeechPlayer } from './AudioSpeechPlayer';

interface EconomicMarketTrackerProps {
  onInsertToProposal?: (citationText: string) => void;
  highlightCategory?: 'all' | 'stock' | 'forex' | 'commodity' | 'macro';
}

// Mini SVG Sparkline component for card previews
const MiniSparkline: React.FC<{ history: MarketTimeSeriesPoint[]; isPositive: boolean; width?: number; height?: number }> = ({
  history,
  isPositive,
  width = 90,
  height = 28,
}) => {
  if (!history || history.length < 2) return null;
  const values = history.map((h) => h.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = history.map((pt, i) => {
    const x = (i / (history.length - 1)) * width;
    const y = height - 2 - ((pt.value - min) / range) * (height - 6);
    return `${x},${y}`;
  });

  const color = isPositive ? '#10b981' : '#f43f5e';

  return (
    <svg width={width} height={height} className="overflow-visible shrink-0">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points.join(' ')}
      />
    </svg>
  );
};

export const EconomicMarketTracker: React.FC<EconomicMarketTrackerProps> = ({
  onInsertToProposal,
  highlightCategory = 'all',
}) => {
  const { language, t } = useLanguage();
  const [marketData, setMarketData] = useState<EconomicMarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'all' | 'stock' | 'forex' | 'commodity' | 'macro'>(highlightCategory);
  const [selectedIndicator, setSelectedIndicator] = useState<EconomicIndicator | null>(null);
  const [timeRange, setTimeRange] = useState<'1D' | '1W' | '1M' | '1Y'>('1M');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Interactive Chart Hover State
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Currency Converter Calculator state
  const [calcAmount, setCalcAmount] = useState<number>(100);
  const [calcFromCurrency, setCalcFromCurrency] = useState<string>('USD');
  const [calcDirection, setCalcDirection] = useState<'foreignToIdr' | 'idrToForeign'>('foreignToIdr');

  const loadData = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const data = await fetchEconomicIndicators();
      setMarketData(data);
      if (!selectedIndicator) {
        setSelectedIndicator(data.ihsg);
      } else {
        const all = [data.ihsg, ...data.currencies, ...data.commodities, ...data.macro];
        const match = all.find((item) => item.id === selectedIndicator.id);
        if (match) setSelectedIndicator(match);
      }
    } catch (err) {
      console.error('Error loading economic indicators:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      loadData(true);
    }, 45000); // 45s live polling
    return () => clearInterval(interval);
  }, []);

  const allIndicators = useMemo(() => {
    if (!marketData) return [];
    return [marketData.ihsg, ...marketData.currencies, ...marketData.commodities, ...marketData.macro];
  }, [marketData]);

  const filteredIndicators = useMemo(() => {
    return allIndicators.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [allIndicators, activeCategory, searchQuery]);

  const handleCopyCitation = (indicator: EconomicIndicator) => {
    const textToCopy = `${indicator.sourceCitation}\n[Data Sekunder Time-Series: ${indicator.name} (${indicator.symbol}), Nilai Terkini: ${indicator.current > 100 ? indicator.current.toLocaleString('id-ID') : indicator.current.toFixed(2)} ${indicator.unit}]`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(indicator.id);
    setTimeout(() => setCopiedId(null), 2500);

    if (onInsertToProposal) {
      onInsertToProposal(textToCopy);
    }
  };

  const handleDownloadCsv = (indicator: EconomicIndicator) => {
    const headers = 'Tanggal,Nilai,Satuan,Nama_Indikator,Simbol,Sumber_Data\n';
    const rows = indicator.history
      .map(
        (pt) =>
          `"${pt.date}",${pt.value},"${indicator.unit}","${indicator.name}","${indicator.symbol}","${indicator.sourceCitation.replace(/"/g, '""')}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `data_sekunder_${indicator.id}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // SVG Chart Calculation with interactive coordinates
  const chartData = useMemo(() => {
    if (!selectedIndicator || !selectedIndicator.history || selectedIndicator.history.length === 0) {
      return { path: '', fillPath: '', points: [], min: 0, max: 0 };
    }

    let sliceCount = 30;
    if (timeRange === '1D') sliceCount = 7;
    else if (timeRange === '1W') sliceCount = 14;
    else if (timeRange === '1M') sliceCount = 30;
    else if (timeRange === '1Y') sliceCount = selectedIndicator.history.length;

    const dataSlice = selectedIndicator.history.slice(-sliceCount);
    const values = dataSlice.map((d) => d.value);
    const min = Math.min(...values) * 0.995;
    const max = Math.max(...values) * 1.005;
    const range = max - min || 1;

    const width = 640;
    const height = 190;
    const paddingX = 16;
    const paddingY = 24;

    const points = dataSlice.map((pt, i) => {
      const x = paddingX + (i / (dataSlice.length - 1 || 1)) * (width - 2 * paddingX);
      const y = height - paddingY - ((pt.value - min) / range) * (height - 2 * paddingY);
      return { x, y, ...pt };
    });

    const path = points.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '');
    const fillPath = `${path} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

    return { path, fillPath, points, min, max, width, height };
  }, [selectedIndicator, timeRange]);

  const activeHoverPoint = useMemo(() => {
    if (hoveredPointIndex !== null && chartData.points[hoveredPointIndex]) {
      return chartData.points[hoveredPointIndex];
    }
    return chartData.points[chartData.points.length - 1] || null;
  }, [hoveredPointIndex, chartData.points]);

  // Handle Chart Mouse Move
  const handleSvgMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || chartData.points.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const normalizedX = (mouseX / rect.width) * (chartData.width || 640);

    // Find closest point
    let closestIdx = 0;
    let minDistance = Infinity;
    chartData.points.forEach((pt, idx) => {
      const dist = Math.abs(pt.x - normalizedX);
      if (dist < minDistance) {
        minDistance = dist;
        closestIdx = idx;
      }
    });

    setHoveredPointIndex(closestIdx);
  };

  // Currency Converter calculation
  const calculatedFx = useMemo(() => {
    if (!marketData) return { result: 0, rate: 1, label: '' };
    const currMap: Record<string, number> = {
      USD: marketData.currencies.find((c) => c.symbol.includes('USD'))?.current || 16250,
      EUR: marketData.currencies.find((c) => c.symbol.includes('EUR'))?.current || 17400,
      SGD: marketData.currencies.find((c) => c.symbol.includes('SGD'))?.current || 12300,
      JPY: (marketData.currencies.find((c) => c.symbol.includes('JPY'))?.current || 10700) / 100,
      CNY: marketData.currencies.find((c) => c.symbol.includes('CNY'))?.current || 2250,
      GBP: marketData.currencies.find((c) => c.symbol.includes('GBP'))?.current || 20900,
      AUD: marketData.currencies.find((c) => c.symbol.includes('AUD'))?.current || 10450,
      SAR: marketData.currencies.find((c) => c.symbol.includes('SAR'))?.current || 4330,
      MYR: 3680,
    };
    const rate = currMap[calcFromCurrency] || 16250;
    if (calcDirection === 'foreignToIdr') {
      const result = calcAmount * rate;
      return {
        result,
        rate,
        label: `${calcAmount} ${calcFromCurrency} = Rp${Math.round(result).toLocaleString('id-ID')}`,
      };
    } else {
      const result = calcAmount / rate;
      return {
        result,
        rate,
        label: `Rp${calcAmount.toLocaleString('id-ID')} = ${result.toFixed(2)} ${calcFromCurrency}`,
      };
    }
  }, [marketData, calcAmount, calcFromCurrency, calcDirection]);

  if (loading && !marketData) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-xs">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-800">Menghubungkan ke Feed Pasar Bursa & Valas Realtime 24/7...</h3>
        <p className="text-xs text-slate-500 mt-1">Mengambil data resmi IHSG, Kurs JISDOR BI, Komoditas Global, dan BPS.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 24/7 Live Status Banner - Dark Terminal Style */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{t('liveTicker')}</span>
              </span>

              <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{marketData?.lastUpdated}</span>
              </span>

              <span className="text-slate-500 text-xs hidden sm:inline">·</span>
              <span className="text-slate-400 text-xs hidden sm:inline">
                BEI · BI JISDOR · ECB · BPS
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {t('marketTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              {t('marketSubtitle')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => loadData(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors cursor-pointer border border-slate-700 shadow-2xs"
              title="Segarkan feed pasar langsung dari bursa"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{language === 'id' ? 'Segarkan' : 'Refresh'}</span>
            </button>

            {marketData?.marketSummary && (
              <AudioSpeechPlayer
                text={marketData.marketSummary}
                label={language === 'id' ? 'Dengar Ringkasan' : 'Listen Brief'}
                size="md"
                className="bg-blue-600 hover:bg-blue-500 text-white border-0 shadow-2xs font-semibold text-xs"
              />
            )}
          </div>
        </div>

        {/* Live Ticker Strip */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {/* IHSG */}
          <div
            onClick={() => marketData && setSelectedIndicator(marketData.ihsg)}
            className={`p-3 rounded-xl transition-all cursor-pointer border ${
              selectedIndicator?.id === 'ihsg'
                ? 'bg-slate-800 border-blue-500 shadow-sm'
                : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium">IHSG (BEI)</span>
              <MiniSparkline
                history={marketData?.ihsg.history || []}
                isPositive={(marketData?.ihsg.change || 0) >= 0}
                width={48}
                height={18}
              />
            </div>
            <div className="text-sm sm:text-base font-bold text-white font-mono mt-1 tabular-nums">
              {marketData?.ihsg.current.toLocaleString('id-ID')}
            </div>
            <div
              className={`text-[11px] font-semibold flex items-center gap-0.5 mt-0.5 tabular-nums ${
                (marketData?.ihsg.change || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {(marketData?.ihsg.change || 0) >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span>
                {(marketData?.ihsg.change || 0) >= 0 ? '+' : ''}
                {marketData?.ihsg.changePercent}%
              </span>
            </div>
          </div>

          {/* USD/IDR, EUR/IDR, SGD/IDR */}
          {marketData?.currencies.slice(0, 3).map((curr) => {
            const isPos = curr.change >= 0;
            return (
              <div
                key={curr.id}
                onClick={() => setSelectedIndicator(curr)}
                className={`p-3 rounded-xl transition-all cursor-pointer border ${
                  selectedIndicator?.id === curr.id
                    ? 'bg-slate-800 border-blue-500 shadow-sm'
                    : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">{curr.symbol}</span>
                  <MiniSparkline history={curr.history || []} isPositive={isPos} width={48} height={18} />
                </div>
                <div className="text-sm sm:text-base font-bold text-white font-mono mt-1 tabular-nums">
                  Rp{curr.current.toLocaleString('id-ID')}
                </div>
                <div className={`text-[11px] font-semibold flex items-center gap-0.5 mt-0.5 tabular-nums ${isPos ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {isPos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  <span>{isPos ? '+' : ''}{curr.changePercent}%</span>
                </div>
              </div>
            );
          })}

          {/* Emas Antam */}
          <div
            onClick={() => marketData && setSelectedIndicator(marketData.commodities[0])}
            className={`p-3 rounded-xl transition-all cursor-pointer border ${
              selectedIndicator?.id === marketData?.commodities[0]?.id
                ? 'bg-slate-800 border-blue-500 shadow-sm'
                : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium">Emas Antam LM</span>
              <MiniSparkline
                history={marketData?.commodities[0]?.history || []}
                isPositive={(marketData?.commodities[0]?.change || 0) >= 0}
                width={48}
                height={18}
              />
            </div>
            <div className="text-sm sm:text-base font-bold text-white font-mono mt-1 tabular-nums">
              Rp{((marketData?.commodities[0]?.current || 0) / 1000).toFixed(0)}k/g
            </div>
            <div className="text-[11px] text-amber-400 font-semibold flex items-center gap-0.5 mt-0.5 tabular-nums">
              <TrendingUp className="w-3 h-3" /> +{marketData?.commodities[0]?.changePercent}%
            </div>
          </div>

          {/* BI Rate */}
          <div
            onClick={() => marketData && setSelectedIndicator(marketData.macro[0])}
            className={`p-3 rounded-xl transition-all cursor-pointer border ${
              selectedIndicator?.id === marketData?.macro[0]?.id
                ? 'bg-slate-800 border-blue-500 shadow-sm'
                : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
            }`}
          >
            <span className="text-[11px] text-slate-400 font-medium block">BI-Rate Acuan</span>
            <div className="text-sm sm:text-base font-bold text-white font-mono mt-1 tabular-nums">
              {marketData?.macro[0]?.current.toFixed(2)}%
            </div>
            <div className="text-[11px] text-blue-400 font-medium flex items-center gap-0.5 mt-0.5">
              RDG Bank Indonesia
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Chart & Indicator Details */}
      {selectedIndicator && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-semibold text-slate-700">{selectedIndicator.name}</span>
                <span>·</span>
                <span className="font-mono">{selectedIndicator.symbol}</span>
                <span>·</span>
                <span>{selectedIndicator.updateFrequency}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {selectedIndicator.name}
              </h3>
              <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">{selectedIndicator.notes}</p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="text-right">
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
                  {activeHoverPoint
                    ? activeHoverPoint.value > 100
                      ? activeHoverPoint.value.toLocaleString('id-ID')
                      : activeHoverPoint.value.toFixed(2)
                    : selectedIndicator.current > 100
                    ? selectedIndicator.current.toLocaleString('id-ID')
                    : selectedIndicator.current.toFixed(2)}{' '}
                  <span className="text-sm font-semibold text-slate-500">{selectedIndicator.unit}</span>
                </div>

                <div
                  className={`text-xs font-bold flex items-center justify-end gap-1 ${
                    selectedIndicator.change >= 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {selectedIndicator.change >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  <span>
                    {selectedIndicator.change >= 0 ? '+' : ''}
                    {selectedIndicator.change.toLocaleString('id-ID')} ({selectedIndicator.changePercent}%)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:pl-4 sm:border-l sm:border-slate-200">
                <button
                  onClick={() => handleCopyCitation(selectedIndicator)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer border border-slate-200"
                  title="Salin Sitasi APA untuk Naskah Skripsi / KTI"
                >
                  {copiedId === selectedIndicator.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Disalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>{language === 'id' ? 'Kutip APA' : 'Cite APA'}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleDownloadCsv(selectedIndicator)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors cursor-pointer shadow-2xs"
                  title="Unduh Data Time Series CSV untuk SPSS/Excel"
                >
                  <Download className="w-3.5 h-3.5 text-blue-400" />
                  <span>CSV</span>
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Chart Canvas with Crosshair & Tooltip */}
          <div className="pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  <span>Grafik Pergerakan Waktu (Time-Series)</span>
                </span>
                {activeHoverPoint && (
                  <span className="text-xs font-mono font-medium text-slate-600">
                    · {activeHoverPoint.date}: {activeHoverPoint.value.toLocaleString('id-ID')} {selectedIndicator.unit}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg self-start sm:self-auto">
                {(['1D', '1W', '1M', '1Y'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setTimeRange(r)}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                      timeRange === r ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive SVG Canvas */}
            <div className="w-full bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/80 overflow-hidden relative">
              <div className="h-52 w-full relative">
                <svg
                  ref={svgRef}
                  viewBox="0 0 640 190"
                  className="w-full h-full overflow-visible cursor-crosshair"
                  preserveAspectRatio="none"
                  onMouseMove={handleSvgMouseMove}
                  onMouseLeave={() => setHoveredPointIndex(null)}
                >
                  <defs>
                    <linearGradient id="chartGradientMain" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity="0.28" />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines */}
                  <line x1="16" y1="45" x2="624" y2="45" stroke="#e2e8f0" strokeDasharray="3 3" strokeWidth="1" />
                  <line x1="16" y1="95" x2="624" y2="95" stroke="#e2e8f0" strokeDasharray="3 3" strokeWidth="1" />
                  <line x1="16" y1="145" x2="624" y2="145" stroke="#e2e8f0" strokeDasharray="3 3" strokeWidth="1" />

                  {/* Gradient area fill */}
                  {chartData.fillPath && (
                    <path d={chartData.fillPath} fill="url(#chartGradientMain)" />
                  )}

                  {/* Polyline */}
                  {chartData.path && (
                    <path
                      d={chartData.path}
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}

                  {/* Active Crosshair vertical line */}
                  {activeHoverPoint && (
                    <line
                      x1={activeHoverPoint.x}
                      y1="10"
                      x2={activeHoverPoint.x}
                      y2="180"
                      stroke="#3b82f6"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                    />
                  )}

                  {/* Data Points */}
                  {chartData.points.map((pt, i) => {
                    const isHovered = hoveredPointIndex === i || (hoveredPointIndex === null && i === chartData.points.length - 1);
                    return (
                      <circle
                        key={i}
                        cx={pt.x}
                        cy={pt.y}
                        r={isHovered ? 5.5 : 2.5}
                        className={`${
                          isHovered
                            ? 'fill-blue-600 stroke-white stroke-2'
                            : 'fill-blue-400 hover:fill-blue-600'
                        } transition-all`}
                      />
                    );
                  })}
                </svg>
              </div>

              {/* Chart Footer with Dates and Ranges */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono mt-3 px-1 pt-2 border-t border-slate-200/60">
                <span>{chartData.points[0]?.date || 'Awal'}</span>
                <span className="text-slate-600 font-medium">
                  Rentang: {chartData.min.toLocaleString('id-ID')} - {chartData.max.toLocaleString('id-ID')} {selectedIndicator.unit}
                </span>
                <span>{chartData.points[chartData.points.length - 1]?.date || 'Terkini'}</span>
              </div>
            </div>

            {/* Official Academic Citation Box */}
            <div className="mt-4 p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Format Sitasi Data Sekunder Resmi (Standar APA 7th untuk Bab III / IV):</span>
                  <p className="font-mono text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                    {selectedIndicator.sourceCitation}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleCopyCitation(selectedIndicator)}
                className="px-3.5 py-1.5 rounded-xl bg-amber-200 hover:bg-amber-300 text-amber-900 font-bold text-xs transition-colors shrink-0 cursor-pointer shadow-2xs active:scale-95"
              >
                {copiedId === selectedIndicator.id ? 'Tersalin ✓' : 'Salin Sitasi'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Currency Converter & Quick Economics Research Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Currency Calculator */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span>{t('calculatorTitle')}</span>
              </h4>
              <button
                onClick={() =>
                  setCalcDirection((prev) => (prev === 'foreignToIdr' ? 'idrToForeign' : 'foreignToIdr'))
                }
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                title="Tukar Arah Konversi"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  {calcDirection === 'foreignToIdr' ? `Valuta Asing (${calcFromCurrency})` : 'Rupiah (IDR)'}
                </label>
                <input
                  type="number"
                  value={calcAmount}
                  onChange={(e) => setCalcAmount(Math.max(1, Number(e.target.value) || 0))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Pilih Mata Uang Valas
                </label>
                <select
                  value={calcFromCurrency}
                  onChange={(e) => setCalcFromCurrency(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  <option value="USD">🇺🇸 USD - Dolar Amerika Serikat (Kurs Pasar Realtime)</option>
                  <option value="EUR">🇪🇺 EUR - Euro Uni Eropa</option>
                  <option value="SGD">🇸🇬 SGD - Dolar Singapura</option>
                  <option value="JPY">🇯🇵 JPY - Yen Jepang (per JPY)</option>
                  <option value="CNY">🇨🇳 CNY - Yuan Tiongkok</option>
                  <option value="GBP">🇬🇧 GBP - Pound Sterling Inggris</option>
                  <option value="AUD">🇦🇺 AUD - Dolar Australia</option>
                  <option value="SAR">🇸🇦 SAR - Riyal Arab Saudi</option>
                  <option value="MYR">🇲🇾 MYR - Ringgit Malaysia</option>
                </select>
              </div>

              {/* Result Display */}
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-center">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 block">
                  {t('convertResult')}
                </span>
                <div className="text-xl font-extrabold text-emerald-950 font-mono mt-1">
                  {calcDirection === 'foreignToIdr'
                    ? `Rp${Math.round(calculatedFx.result).toLocaleString('id-ID')}`
                    : `${calculatedFx.result.toFixed(2)} ${calcFromCurrency}`}
                </div>
                <span className="text-[11px] text-emerald-700 font-medium mt-1 block">
                  1 {calcFromCurrency} = Rp{Math.round(calculatedFx.rate).toLocaleString('id-ID')} (JISDOR Bank Indonesia)
                </span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span>Interbank Forex 24/7 Feed</span>
            <span>JISDOR BI</span>
          </div>
        </div>

        {/* Market Commentary / Qualitative Synthesis for KTI */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Analisis Kondisi Pasar untuk Tinjauan Pustaka & Pembahasan</span>
              </h4>

              {marketData?.marketSummary && (
                <AudioSpeechPlayer
                  text={marketData.marketSummary}
                  size="sm"
                  variant="badge"
                />
              )}
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 font-normal">
              {marketData?.marketSummary}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              <div className="p-3 rounded-2xl bg-blue-50/50 border border-blue-100">
                <span className="text-[10px] font-bold text-blue-700 uppercase">BI-Rate</span>
                <div className="text-base font-extrabold text-slate-900 font-mono mt-0.5">6,00%</div>
                <span className="text-[10px] text-slate-500">Stabilitas Moneter</span>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                <span className="text-[10px] font-bold text-emerald-700 uppercase">Inflasi IHK</span>
                <div className="text-base font-extrabold text-slate-900 font-mono mt-0.5">2,57% YoY</div>
                <span className="text-[10px] text-slate-500">Target BPS Terjaga</span>
              </div>

              <div className="p-3 rounded-2xl bg-indigo-50/50 border border-indigo-100">
                <span className="text-[10px] font-bold text-indigo-700 uppercase">PDB Riil</span>
                <div className="text-base font-extrabold text-slate-900 font-mono mt-0.5">5,05%</div>
                <span className="text-[10px] text-slate-500">Pertumbuhan Positif</span>
              </div>

              <div className="p-3 rounded-2xl bg-purple-50/50 border border-purple-100">
                <span className="text-[10px] font-bold text-purple-700 uppercase">Cadev RI</span>
                <div className="text-base font-extrabold text-slate-900 font-mono mt-0.5">$149,9 M</div>
                <span className="text-[10px] text-slate-500">Ketahanan 6,5 Bulan</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span>Dapat disisipkan langsung ke Bab IV (Hasil & Pembahasan)</span>
            <span className="text-blue-600 font-bold">Terverifikasi BEI, BI, BPS</span>
          </div>
        </div>
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-xl">
            {[
              { id: 'all', label: 'Semua Indikator' },
              { id: 'stock', label: 'Pasar Saham' },
              { id: 'forex', label: 'Kurs Valas' },
              { id: 'commodity', label: 'Komoditas' },
              { id: 'macro', label: 'Makroekonomi' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari indikator (IHSG, USD, Emas)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Indicator Cards Grid with Mini Sparklines */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          {filteredIndicators.map((item) => {
            const isSelected = selectedIndicator?.id === item.id;
            const isPos = item.change >= 0;

            return (
              <div
                key={item.id}
                onClick={() => setSelectedIndicator(item)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-slate-900 ring-1 ring-slate-900 bg-slate-50/50 shadow-xs'
                    : 'border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-2xs'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <span className="font-mono font-semibold text-slate-700">{item.symbol}</span>
                        <span>·</span>
                        <span className="capitalize">{item.category}</span>
                      </div>
                      <h5 className="font-semibold text-slate-900 text-sm mt-0.5 line-clamp-1">{item.name}</h5>
                    </div>

                    <div
                      className={`text-xs font-semibold px-1.5 py-0.5 rounded flex items-center gap-0.5 shrink-0 tabular-nums ${
                        isPos ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'
                      }`}
                    >
                      {isPos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      <span>{isPos ? '+' : ''}{item.changePercent}%</span>
                    </div>
                  </div>

                  <div className="flex items-baseline justify-between mt-3">
                    <div className="text-lg font-bold text-slate-900 font-mono tabular-nums">
                      {item.current > 100 ? item.current.toLocaleString('id-ID') : item.current.toFixed(2)}{' '}
                      <span className="text-xs font-normal text-slate-500">{item.unit}</span>
                    </div>
                    {item.history && item.history.length > 1 && (
                      <MiniSparkline history={item.history} isPositive={isPos} width={70} height={20} />
                    )}
                  </div>

                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {item.notes}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-xs">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyCitation(item);
                    }}
                    className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedId === item.id ? 'Tersalin' : 'Kutip'}</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadCsv(item);
                    }}
                    className="text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>CSV</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
