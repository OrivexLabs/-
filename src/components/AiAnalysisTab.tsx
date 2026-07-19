/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Sparkles, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { FengShuiReport } from '../types';

interface AiAnalysisTabProps {
  onAnalysisSuccess: (newReport: FengShuiReport) => void;
}

export default function AiAnalysisTab({ onAnalysisSuccess }: AiAnalysisTabProps) {
  const [environmentDesc, setEnvironmentDesc] = useState<string>(
    '住宅东边是高楼，西边有一条小马路，南边有小区花园景观，北边是停车场，没有高压电塔。'
  );
  const [orientation, setOrientation] = useState<string>('坐西北朝东南');
  const [layoutDesc, setLayoutDesc] = useState<string>('四房两厅两卫，面积115平米');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAiAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          environmentDesc,
          orientation,
          layoutDesc,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || 'AI 堪舆分析失败，请稍后重试。');
      }

      const parsedReport = (await response.json()) as FengShuiReport;

      // Validate basic structure before applying
      if (parsedReport && parsedReport.houseInfo && parsedReport.internalFengShui) {
        onAnalysisSuccess(parsedReport);
      } else {
        throw new Error('AI 返回的数据结构不完整，请重新分析。');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || '分析过程中发生未知的错误。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-4 shadow-sm text-xs">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-sans tracking-tight">
          AI 传统大堪舆盘算 (定制分析)
        </h3>
      </div>
      <p className="text-[11px] text-slate-500 leading-relaxed">
        输入您家宅的具体朝向及周围物理环境（如山体、水路、电塔、高楼等），AI 老师将为您进行二十年功力的传统杨公阳宅推演。
      </p>

      <div className="space-y-3">
        {/* Orientation input */}
        <div className="flex flex-col gap-1">
          <label className="font-bold text-slate-700 dark:text-slate-300">房屋坐向</label>
          <input
            type="text"
            value={orientation}
            onChange={(e) => setOrientation(e.target.value)}
            placeholder="例如：坐西北朝东南（乾山巽向）"
            className="w-full bg-white dark:bg-slate-950 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        {/* Layout description */}
        <div className="flex flex-col gap-1">
          <label className="font-bold text-slate-700 dark:text-slate-300">户型格局与面积</label>
          <input
            type="text"
            value={layoutDesc}
            onChange={(e) => setLayoutDesc(e.target.value)}
            placeholder="例如：四房两厅两卫，南北通透"
            className="w-full bg-white dark:bg-slate-950 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        {/* Environment description */}
        <div className="flex flex-col gap-1">
          <label className="font-bold text-slate-700 dark:text-slate-300">
            周边外部环境 (水系/道路/高塔/山体等)
          </label>
          <textarea
            rows={3}
            value={environmentDesc}
            onChange={(e) => setEnvironmentDesc(e.target.value)}
            placeholder="描述您家窗外或周边能见到的物理结构：如西面有小河，南面正对写字楼，北面有高架桥等..."
            className="w-full bg-white dark:bg-slate-950 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 leading-relaxed resize-none"
          />
        </div>

        {error && (
          <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-950/60 p-3 rounded-lg flex items-start gap-2 text-rose-700 dark:text-rose-400">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="leading-relaxed text-[11px]">{error}</div>
          </div>
        )}

        <button
          onClick={handleAiAnalyze}
          disabled={loading}
          className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-500/40 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/10 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>推演中，约需20-30秒...</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              <span>重新盘算 & 生成定制报告</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
