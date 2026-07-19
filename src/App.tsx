/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Compass,
  Sparkles,
  Layers,
  Map,
  RotateCcw,
  BookOpen,
  Sliders,
  FileText,
  BookmarkCheck,
  ChevronRight,
  Calculator,
  Rotate3d,
} from 'lucide-react';
import LayoutCanvas from './components/LayoutCanvas';
import LuopanCompass from './components/LuopanCompass';
import ThreeDLayoutSandbox from './components/ThreeDLayoutSandbox';
import ReportViewer from './components/ReportViewer';
import InteractiveInput from './components/InteractiveInput';
import AiAnalysisTab from './components/AiAnalysisTab';
import { defaultLoganReport } from './data/fengshuiData';
import { FengShuiReport, RoomKey } from './types';

export default function App() {
  const [report, setReport] = useState<FengShuiReport>(defaultLoganReport);
  const [selectedRoom, setSelectedRoom] = useState<RoomKey | null>(null);
  const [viewMode, setViewMode] = useState<'2D' | '3D'>('2D');
  
  // Custom Compass Overlay state
  const [showCompass, setShowCompass] = useState<boolean>(false);
  const [compassRotation, setCompassRotation] = useState<number>(315); // Default matching northwest (dry mountain)
  const [compassOpacity, setCompassOpacity] = useState<number>(50);
  const [compassScale, setCompassScale] = useState<number>(75);
  const [compassX, setCompassX] = useState<number>(0);
  const [compassY, setCompassY] = useState<number>(0);

  const [showElementsColor, setShowElementsColor] = useState<boolean>(true);
  const [currentToolTab, setCurrentToolTab] = useState<'calculators' | 'ai'>('calculators');

  const handleRoomSelection = (roomKey: RoomKey) => {
    setSelectedRoom(roomKey);
    // Smooth scroll the focused room in the ReportViewer
    setTimeout(() => {
      const el = document.getElementById(`room-${roomKey}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  // Callback when AI returns newly generated report
  const handleAiAnalysisSuccess = (newReport: FengShuiReport) => {
    setReport(newReport);
    setSelectedRoom(null);
  };

  // Calculate customized 八宅 outputs based on calculator inputs
  const handleCalculateCalculations = (calcData: {
    birthYear: number;
    gender: 'male' | 'female';
    doorSector: string;
  }) => {
    // Dynamic overlay adjustments depending on door sector or custom calculation
    if (calcData.doorSector === 'NW') {
      setCompassRotation(315);
    } else if (calcData.doorSector === 'SE') {
      setCompassRotation(135);
    } else if (calcData.doorSector === 'S') {
      setCompassRotation(180);
    } else if (calcData.doorSector === 'N') {
      setCompassRotation(0);
    } else if (calcData.doorSector === 'E') {
      setCompassRotation(90);
    } else if (calcData.doorSector === 'W') {
      setCompassRotation(270);
    } else if (calcData.doorSector === 'SW') {
      setCompassRotation(225);
    } else if (calcData.doorSector === 'NE') {
      setCompassRotation(45);
    }
  };

  const resetCompass = () => {
    setCompassRotation(315);
    setCompassOpacity(50);
    setCompassScale(75);
    setCompassX(0);
    setCompassY(0);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300 antialiased selection:bg-indigo-500/20 selection:text-indigo-900">
      {/* Banner / Title Header */}
      <header className="border-b border-slate-200 dark:border-slate-900 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-slate-100 flex items-center justify-center shadow-lg border border-slate-800/25">
              <Compass className="w-5 h-5 text-amber-500 animate-spin-slow" />
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-slate-50 font-sans flex items-center gap-2">
                传统阳宅堪舆分析与布局优化系统
                <span className="text-[9px] font-mono tracking-widest px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 font-extrabold uppercase border border-amber-500/25">
                  正统国学
                </span>
              </h1>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                融合《阳宅三要》《八宅明镜》《黄帝宅经》典章 · 交互式平面堪舆排盘
              </p>
            </div>
          </div>
          
          {/* Quick status line */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 font-mono text-[10px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>当前堪舆案：龙光·玖悦湾 115m² 标准户型</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Hand: Interactive Layout & Tools (7 Cols) */}
        <div className="col-span-1 lg:col-span-7 flex flex-col gap-6">
          
          {/* Interactive Layout Card */}
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-900 rounded-2xl p-5 shadow-xl flex flex-col gap-4 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Map className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                  堪舆户型图数字化演练
                </h2>
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                {/* 2D/3D Mode Switcher */}
                <div className="flex border border-slate-200 dark:border-slate-800 rounded-lg p-0.5 bg-slate-100 dark:bg-slate-900 text-xs">
                  <button
                    onClick={() => setViewMode('2D')}
                    className={`px-3 py-1 rounded-md font-bold transition-all duration-200 cursor-pointer ${
                      viewMode === '2D'
                        ? 'bg-white dark:bg-slate-950 text-indigo-600 dark:text-indigo-400 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    2D 平面
                  </button>
                  <button
                    onClick={() => setViewMode('3D')}
                    className={`px-3 py-1 rounded-md font-bold transition-all duration-200 flex items-center gap-1 cursor-pointer ${
                      viewMode === '3D'
                        ? 'bg-white dark:bg-slate-950 text-indigo-600 dark:text-indigo-400 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <Rotate3d className="w-3.5 h-3.5" /> 3D 立体沙盘
                  </button>
                </div>

                {viewMode === '2D' && (
                  <>
                    {/* Toggle elements colors */}
                    <button
                      onClick={() => setShowElementsColor(!showElementsColor)}
                      className={`px-2 py-1 rounded-lg text-[11px] font-bold border transition-all flex items-center gap-1 cursor-pointer ${
                        showElementsColor
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-950/40 dark:border-indigo-900'
                          : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />五行色相
                    </button>

                    {/* Toggle compass overlay */}
                    <button
                      onClick={() => setShowCompass(!showCompass)}
                      className={`px-2 py-1 rounded-lg text-[11px] font-bold border transition-all flex items-center gap-1 cursor-pointer ${
                        showCompass
                          ? 'bg-amber-500 border-amber-600 text-white shadow-md'
                          : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600'
                      }`}
                    >
                      <Compass className="w-3.5 h-3.5" />叠罗盘
                    </button>
                  </>
                )}
              </div>
            </div>

            {viewMode === '2D' ? (
              <>
                {/* Layout Canvas with conditional Compass Overlay */}
                <div className="relative border border-slate-100 dark:border-slate-900 rounded-xl overflow-hidden">
                  <LayoutCanvas
                    selectedRoom={selectedRoom}
                    onSelectRoom={handleRoomSelection}
                    showElementsColor={showElementsColor}
                  />
                  
                  {showCompass && (
                    <LuopanCompass
                      rotation={compassRotation}
                      opacity={compassOpacity}
                      scale={compassScale}
                      xOffset={compassX}
                      yOffset={compassY}
                    />
                  )}
                </div>

                {/* Compass Controls (collapsible) */}
                {showCompass && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-amber-50/50 dark:bg-slate-900/40 border border-amber-100 dark:border-slate-900/60 p-4 rounded-xl flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-amber-800 dark:text-amber-400 flex items-center gap-1">
                        <Sliders className="w-3.5 h-3.5" /> 传统罗盘数字化校准 (微调)
                      </span>
                      <button
                        onClick={resetCompass}
                        className="text-[10px] text-amber-800 dark:text-amber-400 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />重置盘面
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[11px]">
                      {/* Rotation angle */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between font-mono">
                          <span className="text-slate-500">磁北角度 (旋转)</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{compassRotation}°</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="360"
                          value={compassRotation}
                          onChange={(e) => setCompassRotation(parseInt(e.target.value))}
                          className="w-full accent-amber-500 h-1 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                        />
                      </div>

                      {/* Opacity level */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between font-mono">
                          <span className="text-slate-500">透明度</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{compassOpacity}%</span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="95"
                          value={compassOpacity}
                          onChange={(e) => setCompassOpacity(parseInt(e.target.value))}
                          className="w-full accent-amber-500 h-1 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                        />
                      </div>

                      {/* Scale size */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between font-mono">
                          <span className="text-slate-500">罗盘大小</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{compassScale}%</span>
                        </div>
                        <input
                          type="range"
                          min="40"
                          max="140"
                          value={compassScale}
                          onChange={(e) => setCompassScale(parseInt(e.target.value))}
                          className="w-full accent-amber-500 h-1 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Fine tune manual translations */}
                    <div className="flex flex-wrap gap-4 pt-1 border-t border-amber-200/30 text-[10px] text-slate-500 font-mono">
                      <div className="flex items-center gap-1.5">
                        <span>手动平移 X轴:</span>
                        <input
                          type="range"
                          min="-150"
                          max="150"
                          value={compassX}
                          onChange={(e) => setCompassX(parseInt(e.target.value))}
                          className="w-20 accent-amber-500"
                        />
                        <span className="font-bold text-slate-700 dark:text-slate-300">{compassX}px</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span>手动平移 Y轴:</span>
                        <input
                          type="range"
                          min="-150"
                          max="150"
                          value={compassY}
                          onChange={(e) => setCompassY(parseInt(e.target.value))}
                          className="w-20 accent-amber-500"
                        />
                        <span className="font-bold text-slate-700 dark:text-slate-300">{compassY}px</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </>
            ) : (
              <ThreeDLayoutSandbox
                selectedRoom={selectedRoom}
                onSelectRoom={handleRoomSelection}
                showElementsColor={showElementsColor}
              />
            )}
          </div>

          {/* Tools tabs Selector */}
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-900 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
            <div className="flex border-b border-slate-100 dark:border-slate-900 pb-2 gap-4">
              <button
                onClick={() => setCurrentToolTab('calculators')}
                className={`text-xs font-bold pb-2 transition-all duration-200 relative cursor-pointer ${
                  currentToolTab === 'calculators'
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                八宅命理计算器
                {currentToolTab === 'calculators' && (
                  <motion.div layoutId="toolTabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400" />
                )}
              </button>
              <button
                onClick={() => setCurrentToolTab('ai')}
                className={`text-xs font-bold pb-2 transition-all duration-200 relative flex items-center gap-1 cursor-pointer ${
                  currentToolTab === 'ai'
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                AI 堪舆大师 (智能重盘)
                <span className="text-[9px] bg-indigo-100 text-indigo-700 font-extrabold px-1.5 py-0.5 rounded-md">New</span>
                {currentToolTab === 'ai' && (
                  <motion.div layoutId="toolTabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400" />
                )}
              </button>
            </div>

            {/* Sub Tools Render */}
            <div className="transition-all duration-300">
              {currentToolTab === 'calculators' ? (
                <InteractiveInput onCalculate={handleCalculateCalculations} />
              ) : (
                <AiAnalysisTab onAnalysisSuccess={handleAiAnalysisSuccess} />
              )}
            </div>
          </div>
        </div>

        {/* Right Hand: Deep scholarly Analysis Report Viewer (5 Cols) */}
        <div className="col-span-1 lg:col-span-5 h-full min-h-[600px]">
          <ReportViewer
            report={report}
            selectedRoom={selectedRoom}
            onSelectRoom={handleRoomSelection}
          />
        </div>

      </main>

      {/* Footer credits & reference */}
      <footer className="border-t border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 mt-12 py-8 text-center text-xs text-slate-400 font-sans">
        <div className="max-w-7xl mx-auto px-4 space-y-3">
          <p className="flex justify-center items-center gap-1.5 font-bold text-slate-600 dark:text-slate-300">
            <BookOpen className="w-4 h-4 text-amber-500" /> 传统堪舆古典论据说明
          </p>
          <p className="max-w-2xl mx-auto text-[11px] leading-relaxed">
            本系统分析完全基于正统阳宅风水经文论述（如《阳宅三要》、《八宅明镜》、《雪心赋》等原著典章）。系统不提供任何带有宿命论、迷信或推销法器的建议，所有调理方案均可通过日常家具移位、植物摆设、色彩五行调和、气流调节等生活化手段完成。
          </p>
          <p className="text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-900 max-w-xs mx-auto">
            © 2026 阳宅堪舆分析系统 · 经典传统文化保护项目
          </p>
        </div>
      </footer>
    </div>
  );
}
