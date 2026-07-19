/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import {
  Compass,
  AlertTriangle,
  Flame,
  Droplet,
  Trees,
  Mountain,
  Hammer,
  HelpCircle,
  Users,
  Award,
  Heart,
  TrendingUp,
  BookOpen,
  DollarSign,
  Briefcase,
  Star,
  CheckCircle,
} from 'lucide-react';
import { FengShuiReport, RoomKey } from '../types';

interface ReportViewerProps {
  report: FengShuiReport;
  selectedRoom: RoomKey | null;
  onSelectRoom: (room: RoomKey) => void;
}

export default function ReportViewer({
  report,
  selectedRoom,
  onSelectRoom,
}: ReportViewerProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'eight' | 'problems' | 'remedies'>('all');

  // Helper to render star rating
  const renderStars = (count: number) => {
    return (
      <div className="flex gap-0.5" id={`stars-${count}`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < count ? 'fill-amber-500 text-amber-500' : 'text-slate-300 dark:text-slate-700'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col h-full max-h-[90vh]">
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-100 dark:border-slate-900 bg-slate-50 dark:bg-slate-900/60 p-2 gap-1.5 shrink-0">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-2 px-3 text-[12px] font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 ${
            activeTab === 'all'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/55 dark:border-slate-700/60'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/40'
          }`}
        >
          <Compass className="w-4 h-4" /> 全屋详评
        </button>
        <button
          onClick={() => setActiveTab('eight')}
          className={`flex-1 py-2 px-3 text-[12px] font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 ${
            activeTab === 'eight'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/55 dark:border-slate-700/60'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/40'
          }`}
        >
          <Users className="w-4 h-4" /> 八宅命盘
        </button>
        <button
          onClick={() => setActiveTab('problems')}
          className={`flex-1 py-2 px-3 text-[12px] font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 ${
            activeTab === 'problems'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/55 dark:border-slate-700/60'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/40'
          }`}
        >
          <AlertTriangle className="w-4 h-4" /> 问题排序
        </button>
        <button
          onClick={() => setActiveTab('remedies')}
          className={`flex-1 py-2 px-3 text-[12px] font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 ${
            activeTab === 'remedies'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/55 dark:border-slate-700/60'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/40'
          }`}
        >
          <Hammer className="w-4 h-4" /> 布局调理
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 select-text">
        {activeTab === 'all' && (
          <>
            {/* Section 1: 一、房屋基本情况 */}
            <section className="space-y-4" id="section-house-info">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-[11px] bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-2.5 py-1 rounded-full font-bold">
                  一
                </span>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 font-sans tracking-tight">
                  房屋基本情况 (基础考量)
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-100 dark:border-slate-900 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                    朝向 / 向山
                  </span>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {report.houseInfo.orientation}
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-100 dark:border-slate-900 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                    户型格局
                  </span>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {report.houseInfo.layout}
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-100 dark:border-slate-900 space-y-1 col-span-1 md:col-span-2">
                  <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                    周围地理大形势
                  </span>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {report.houseInfo.environment}
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-100 dark:border-slate-900 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                    楼层磁场
                  </span>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {report.houseInfo.floor}
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-100 dark:border-slate-900 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                    建筑三元九运
                  </span>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {report.houseInfo.year}
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2: 二、外部风水 */}
            <section className="space-y-4" id="section-external-fengshui">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-[11px] bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-2.5 py-1 rounded-full font-bold">
                  二
                </span>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 font-sans tracking-tight">
                  外部形势地理 (峦头形相)
                </h3>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-900 rounded-xl p-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
                  <div className="space-y-1">
                    <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Mountain className="w-4 h-4 text-emerald-600" /> 左青龙 / 右白虎
                    </span>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-xs">
                      {report.externalFengShui.dragonTiger}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-amber-500" /> 堂前明堂
                    </span>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-xs">
                      {report.externalFengShui.mingTang}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Droplet className="w-4 h-4 text-blue-500" /> 水势朝向
                    </span>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-xs">
                      {report.externalFengShui.waterFlow}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Trees className="w-4 h-4 text-emerald-500" /> 道路水路
                    </span>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-xs">
                      {report.externalFengShui.roads}
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-200/50 dark:border-slate-800/60 pt-4">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2.5">
                    周边其他物象克煞核实
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {report.externalFengShui.otherElements.map((elem) => (
                      <div
                        key={elem.name}
                        className="bg-white dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col justify-between"
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {elem.name}
                          </span>
                          <span
                            className={`text-[9px] px-2 py-0.5 rounded font-extrabold ${
                              elem.status === '吉'
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                            }`}
                          >
                            {elem.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                          {elem.analysis}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: 三、内部风水 */}
            <section className="space-y-4" id="section-internal-fengshui">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-[11px] bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-2.5 py-1 rounded-full font-bold">
                  三
                </span>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 font-sans tracking-tight">
                  内部宫位格局 (门主灶分详)
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                根据《阳宅三要》经典判定。可在上方户型图中点击相应区域快速高亮查看。
              </p>
              <div className="space-y-4">
                {report.internalFengShui.rooms.map((room) => {
                  const isSelected = selectedRoom === room.key;
                  return (
                    <div
                      key={room.key}
                      onClick={() => onSelectRoom(room.key)}
                      className={`transition-all duration-300 p-5 rounded-xl border cursor-pointer ${
                        isSelected
                          ? 'border-indigo-500 dark:border-indigo-400 bg-indigo-50/40 dark:bg-slate-900/60 ring-2 ring-indigo-500/10'
                          : 'border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/10 hover:border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                            {room.name}
                          </h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200/50 dark:bg-slate-800 dark:text-slate-400 font-mono">
                            主属五行: {room.element}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] text-slate-400 font-mono">吉凶考：</span>
                          {renderStars(room.rating)}
                        </div>
                      </div>

                      <div className="bg-white/80 dark:bg-slate-950/80 p-3 rounded-lg border border-slate-100 dark:border-slate-900 text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic mb-3">
                        {room.classicalSource}
                      </div>

                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                        {room.description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-900 pt-3 text-xs">
                        <div className="space-y-1">
                          <span className="font-extrabold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                            ⚠️ 现状问题 / 克泄
                          </span>
                          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            {room.remedyBefore}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <span className="font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            ✨ 调理优化后
                          </span>
                          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            {room.remedyAfter}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Section 4: 四、气流分析 */}
            <section className="space-y-4" id="section-airflow">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-[11px] bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-2.5 py-1 rounded-full font-bold">
                  四
                </span>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 font-sans tracking-tight">
                  气流与阴阳流通 (气场运化)
                </h3>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-900 p-5 space-y-4 text-xs leading-relaxed">
                <div className="space-y-1.5">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    五行能量流通轨迹
                  </span>
                  <p className="text-slate-600 dark:text-slate-400">{report.airFlowAnalysis.elementFlow}</p>
                </div>
                <div className="space-y-1.5">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    藏风聚气能效
                  </span>
                  <p className="text-slate-600 dark:text-slate-400">{report.airFlowAnalysis.gatherQi}</p>
                </div>
                <div className="space-y-1.5 p-3.5 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-950/60 rounded-lg">
                  <span className="font-bold text-rose-800 dark:text-rose-400 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" /> 重点克煞：穿堂风（穿堂煞）
                  </span>
                  <p className="text-rose-700/90 dark:text-rose-300 mt-1">{report.airFlowAnalysis.crossVentilation}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      采光纳阳
                    </span>
                    <p className="text-slate-600 dark:text-slate-400">{report.airFlowAnalysis.lighting}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      通风换气
                    </span>
                    <p className="text-slate-600 dark:text-slate-400">{report.airFlowAnalysis.ventilation}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 7: 七、各维度象征意义 */}
            <section className="space-y-4" id="section-dimensions">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-[11px] bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-2.5 py-1 rounded-full font-bold">
                  五
                </span>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 font-sans tracking-tight">
                  运势推断象征 (不作现实预测)
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-100 dark:border-slate-900 space-y-2">
                  <span className="flex items-center gap-1 text-sm font-bold text-red-600">
                    <Heart className="w-4 h-4" /> 身体健康 (象征)
                  </span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    {report.dimensions.health}
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-100 dark:border-slate-900 space-y-2">
                  <span className="flex items-center gap-1 text-sm font-bold text-indigo-600">
                    <Briefcase className="w-4 h-4" /> 事业运势 (象征)
                  </span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    {report.dimensions.career}
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-100 dark:border-slate-900 space-y-2">
                  <span className="flex items-center gap-1 text-sm font-bold text-amber-600">
                    <DollarSign className="w-4 h-4" /> 财富运势 (象征)
                  </span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    {report.dimensions.wealth}
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-100 dark:border-slate-900 space-y-2">
                  <span className="flex items-center gap-1 text-sm font-bold text-rose-600">
                    <Users className="w-4 h-4" /> 婚姻感情 (象征)
                  </span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    {report.dimensions.marriage}
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-100 dark:border-slate-900 space-y-2 col-span-1 md:col-span-2">
                  <span className="flex items-center gap-1 text-sm font-bold text-emerald-600">
                    <BookOpen className="w-4 h-4" /> 子嗣学业 (象征)
                  </span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    {report.dimensions.study}
                  </p>
                </div>
              </div>
            </section>
          </>
        )}

        {/* Tab 2: 八宅明镜命盘 */}
        {activeTab === 'eight' && (
          <section className="space-y-6" id="section-eight-mansions">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                八宅明镜排盘详评
              </h3>
              <p className="text-xs text-slate-500">
                本案判定为：<strong className="text-indigo-600 dark:text-indigo-400">{report.eightMansions.zhaiGua}</strong>，主吉凶吉星分布如下。
              </p>
            </div>

            <div className="overflow-x-auto border border-slate-100 dark:border-slate-900 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="p-3">宫位(方位)</th>
                    <th className="p-3">飞临九星</th>
                    <th className="p-3">吉凶考</th>
                    <th className="p-3">经典判定与本案影响</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                  {report.eightMansions.directions.map((dir) => (
                    <tr
                      key={dir.direction}
                      className="hover:bg-slate-50/55 dark:hover:bg-slate-900/40 transition-colors"
                    >
                      <td className="p-3 font-bold text-slate-800 dark:text-slate-200">
                        {dir.direction}
                      </td>
                      <td className="p-3">
                        <span className="font-extrabold">{dir.stars}</span>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold ${
                            dir.type === '吉'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                              : 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400'
                          }`}
                        >
                          {dir.type}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                        {dir.influence}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Member analyses */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-900">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-500" /> 家庭成员本命卦契合分析
              </h4>
              <div className="grid grid-cols-1 gap-4">
                {report.members.map((member) => (
                  <div
                    key={member.role}
                    className="bg-slate-50 dark:bg-slate-900/30 p-4 rounded-xl border border-slate-100 dark:border-slate-900 space-y-2 text-xs"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                        {member.role}
                      </span>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold">
                        五行卦命: {member.element}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">
                      <strong>本命卦配：</strong>{member.mingGua}
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      <strong>户型方位磁场：</strong>{member.influence}
                    </p>
                    <p className="text-indigo-700 dark:text-indigo-300 leading-relaxed font-medium">
                      <strong>老师调理建议：</strong>{member.suggestion}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Tab 3: 八、存在问题 */}
        {activeTab === 'problems' && (
          <section className="space-y-6" id="section-problems">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                本案克煞煞位判定 (依凶度★★★★★排序)
              </h3>
              <p className="text-xs text-slate-500">
                传统风水原则：先化煞，后纳吉。优先对高星级煞位进行化解。
              </p>
            </div>

            <div className="space-y-4">
              {report.severityProblems.map((prob) => (
                <div
                  key={prob.title}
                  className="bg-slate-50 dark:bg-slate-900/40 p-5 rounded-xl border border-slate-100 dark:border-slate-900 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-500" /> {prob.title}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <span>危害级别：</span>
                      {renderStars(prob.severity)}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {prob.description}
                  </p>

                  <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-950/60 p-3.5 rounded-lg text-xs leading-relaxed">
                    <span className="font-extrabold text-emerald-800 dark:text-emerald-400 flex items-center gap-1 mb-1">
                      <CheckCircle className="w-4 h-4" /> 传统调理方案
                    </span>
                    <p className="text-emerald-700/90 dark:text-emerald-300">
                      {prob.remedy}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tab 4: 九、改善建议 */}
        {activeTab === 'remedies' && (
          <section className="space-y-6" id="section-remedies">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                各级别调理调护建议 (成本由低至高)
              </h3>
              <p className="text-xs text-slate-500">
                风水重在磁场借力，而非购买高昂法器。优先采用物理、色彩、绿植等绿能优化方案。
              </p>
            </div>

            <div className="space-y-5 text-xs">
              {/* 无需花钱 */}
              <div className="space-y-2">
                <span className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold rounded-md text-[10px]">
                  无需花钱 (习惯与陈设)
                </span>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-400 leading-relaxed">
                  {report.costRemedies.free.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* 100元以内 */}
              <div className="space-y-2 border-t border-slate-100 dark:border-slate-900 pt-4">
                <span className="inline-block px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-extrabold rounded-md text-[10px]">
                  100元以内 (绿植及小件)
                </span>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-400 leading-relaxed">
                  {report.costRemedies.under100.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* 1000元以内 */}
              <div className="space-y-2 border-t border-slate-100 dark:border-slate-900 pt-4">
                <span className="inline-block px-3 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 font-extrabold rounded-md text-[10px]">
                  1000元以内 (玄关、软装窗帘)
                </span>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-400 leading-relaxed">
                  {report.costRemedies.under1000.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* 装修级 */}
              <div className="space-y-2 border-t border-slate-100 dark:border-slate-900 pt-4">
                <span className="inline-block px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 font-extrabold rounded-md text-[10px]">
                  装修级 (硬装改造)
                </span>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-400 leading-relaxed">
                  {report.costRemedies.renovation.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Score card / Footer */}
      <div className="shrink-0 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-900 p-5">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
          十、住宅五维评测得分 (综合评分)
        </p>
        <div className="grid grid-cols-5 gap-2 text-center">
          <div>
            <div className="text-base font-extrabold text-slate-800 dark:text-slate-100 font-mono">
              {report.scores.layout}%
            </div>
            <div className="text-[9px] text-slate-500 font-sans mt-0.5">户型布局</div>
          </div>
          <div>
            <div className="text-base font-extrabold text-slate-800 dark:text-slate-100 font-mono">
              {report.scores.lighting}%
            </div>
            <div className="text-[9px] text-slate-500 font-sans mt-0.5">采光采纳</div>
          </div>
          <div>
            <div className="text-base font-extrabold text-slate-800 dark:text-slate-100 font-mono">
              {report.scores.circulation}%
            </div>
            <div className="text-[9px] text-slate-500 font-sans mt-0.5">动线规划</div>
          </div>
          <div>
            <div className="text-base font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
              {report.scores.traditional}%
            </div>
            <div className="text-[9px] text-slate-500 font-sans mt-0.5 font-bold">传统风水</div>
          </div>
          <div>
            <div className="text-base font-extrabold text-slate-800 dark:text-slate-100 font-mono">
              {report.scores.comfort}%
            </div>
            <div className="text-[9px] text-slate-500 font-sans mt-0.5">居住舒适</div>
          </div>
        </div>
      </div>
    </div>
  );
}
