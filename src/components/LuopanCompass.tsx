/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';

interface LuopanCompassProps {
  rotation: number;
  opacity: number;
  scale: number;
  xOffset: number;
  yOffset: number;
}

export default function LuopanCompass({
  rotation,
  opacity,
  scale,
  xOffset,
  yOffset,
}: LuopanCompassProps) {
  // 24 Mountains (二十四山) text & angles
  // Starting from North (子, 0 degrees) going clockwise:
  // 子(N), 癸, 丑, 艮(NE), 寅, 甲, 卯(E), 乙, 辰, 巽(SE), 巳, 丙, 午(S), 丁, 未, 坤(SW), 申, 庚, 酉(W), 辛, 戌, 乾(NW), 亥, 壬.
  const mountains = [
    { text: '子', type: 'yin', element: '水', color: 'text-blue-400' },
    { text: '癸', type: 'yin', element: '水', color: 'text-blue-400' },
    { text: '丑', type: 'yin', element: '土', color: 'text-amber-600' },
    { text: '艮', type: 'yang', element: '土', color: 'text-amber-600' },
    { text: '寅', type: 'yang', element: '木', color: 'text-emerald-500' },
    { text: '甲', type: 'yang', element: '木', color: 'text-emerald-500' },
    { text: '卯', type: 'yin', element: '木', color: 'text-emerald-500' },
    { text: '乙', type: 'yin', element: '木', color: 'text-emerald-500' },
    { text: '辰', type: 'yin', element: '土', color: 'text-amber-600' },
    { text: '巽', type: 'yang', element: '木', color: 'text-emerald-500' },
    { text: '巳', type: 'yang', element: '火', color: 'text-red-500' },
    { text: '丙', type: 'yang', element: '火', color: 'text-red-500' },
    { text: '午', type: 'yin', element: '火', color: 'text-red-500' },
    { text: '丁', type: 'yin', element: '火', color: 'text-red-500' },
    { text: '未', type: 'yin', element: '土', color: 'text-amber-600' },
    { text: '坤', type: 'yang', element: '土', color: 'text-amber-600' },
    { text: '申', type: 'yang', element: '金', color: 'text-slate-400' },
    { text: '庚', type: 'yang', element: '金', color: 'text-slate-400' },
    { text: '酉', type: 'yin', element: '金', color: 'text-slate-400' },
    { text: '辛', type: 'yin', element: '金', color: 'text-slate-400' },
    { text: '戌', type: 'yin', element: '土', color: 'text-amber-600' },
    { text: '乾', type: 'yang', element: '金', color: 'text-slate-400' },
    { text: '亥', type: 'yang', element: '水', color: 'text-blue-400' },
    { text: '壬', type: 'yang', element: '水', color: 'text-blue-400' },
  ];

  const trigrams = [
    { text: '坎 (北)', gua: '☵', direction: '正北', element: '水' },
    { text: '艮 (东北)', gua: '☶', direction: '东北', element: '土' },
    { text: '震 (东)', gua: '☳', direction: '正东', element: '木' },
    { text: '巽 (东南)', gua: '☴', direction: '东南', element: '木' },
    { text: '离 (南)', gua: '☲', direction: '正南', element: '火' },
    { text: '坤 (西南)', gua: '☷', direction: '西南', element: '土' },
    { text: '兑 (西)', gua: '☱', direction: '正西', element: '金' },
    { text: '乾 (西北)', gua: '☰', direction: '西北', element: '金' },
  ];

  return (
    <div
      className="absolute inset-0 pointer-events-none flex items-center justify-center z-10 overflow-hidden"
      style={{
        transform: `translate(${xOffset}px, ${yOffset}px)`,
      }}
    >
      <motion.div
        className="w-[500px] h-[500px] rounded-full border-4 border-red-800 bg-[#e8dcc4] shadow-2xl relative flex items-center justify-center select-none"
        style={{
          scale: scale / 100,
          opacity: opacity / 100,
          rotate: rotation,
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 120 }}
      >
        {/* Outermost Ring - Golden border & degrees */}
        <div className="absolute inset-0 rounded-full border border-yellow-700/30 pointer-events-auto" />

        {/* 24 Mountains Ring (outer) */}
        <div className="absolute w-[440px] h-[440px] rounded-full border border-yellow-800/40 flex items-center justify-center">
          {mountains.map((m, index) => {
            const angle = index * 15; // 360 / 24 = 15 degrees per mountain
            return (
              <div
                key={m.text}
                className="absolute h-[210px] w-[20px] origin-bottom flex flex-col justify-start items-center"
                style={{
                  transform: `rotate(${angle}deg)`,
                  bottom: '50%',
                }}
              >
                <span className={`text-[10px] font-bold font-mono tracking-tight ${m.color}`}>
                  {m.text}
                </span>
                <span className="text-[6px] text-yellow-900/40 mt-1 font-mono">
                  {angle}°
                </span>
                <div className="w-[1px] h-[8px] bg-yellow-900/30 mt-1" />
              </div>
            );
          })}
        </div>

        {/* Trigrams Ring (Middle) */}
        <div className="absolute w-[320px] h-[320px] rounded-full border border-red-800/30 flex items-center justify-center">
          {trigrams.map((t, index) => {
            const angle = index * 45; // 360 / 8 = 45 degrees
            return (
              <div
                key={t.text}
                className="absolute h-[150px] w-[40px] origin-bottom flex flex-col justify-start items-center"
                style={{
                  transform: `rotate(${angle}deg)`,
                  bottom: '50%',
                }}
              >
                <span className="text-[14px] font-extrabold text-red-950 font-sans mt-1">
                  {t.gua}
                </span>
                <span className="text-[9px] font-bold text-red-900/80 font-sans">
                  {t.text}
                </span>
                <div className="w-[1px] h-[12px] bg-red-800/20 mt-1" />
              </div>
            );
          })}
        </div>

        {/* Five Elements / Yin-Yang Ring (Inner) */}
        <div className="absolute w-[180px] h-[180px] rounded-full border border-yellow-800/60 bg-[#eedebf] flex items-center justify-center">
          {['木 (东/绿)', '火 (南/红)', '土 (中/黄)', '金 (西/白)', '水 (北/蓝)'].map((elem, index) => {
            const angle = index * 72; // 360 / 5 = 72
            return (
              <div
                key={elem}
                className="absolute h-[85px] w-[45px] origin-bottom flex flex-col justify-start items-center"
                style={{
                  transform: `rotate(${angle}deg)`,
                  bottom: '50%',
                }}
              >
                <span className="text-[8px] text-yellow-950/80 font-sans mt-2">
                  {elem}
                </span>
              </div>
            );
          })}
        </div>

        {/* Center: Taiji Pool (天池) */}
        <div className="absolute w-[80px] h-[80px] rounded-full border-4 border-red-800 bg-white shadow-inner flex items-center justify-center overflow-hidden">
          {/* Tai Chi Icon background */}
          <div className="absolute inset-0 flex">
            <div className="w-1/2 h-full bg-black rounded-l-full relative flex items-center justify-end">
              <div className="absolute w-[40px] h-[40px] rounded-full bg-black top-0 translate-x-[20px] z-10 flex items-center justify-center">
                <div className="w-[10px] h-[10px] rounded-full bg-white" />
              </div>
            </div>
            <div className="w-1/2 h-full bg-white rounded-r-full relative flex items-center justify-start">
              <div className="absolute w-[40px] h-[40px] rounded-full bg-white bottom-0 -translate-x-[20px] z-10 flex items-center justify-center">
                <div className="w-[10px] h-[10px] rounded-full bg-black" />
              </div>
            </div>
          </div>

          {/* Red needle (representing the compass needle) */}
          <div className="absolute w-1 h-[65px] bg-red-600 rounded origin-center z-20 flex flex-col justify-between items-center rotate-[30deg]">
            <div className="w-2 h-2 rounded-full bg-red-600 -translate-y-0.5" />
            <div className="w-0.5 h-4 bg-blue-600" />
          </div>
        </div>

        {/* Reticle Lines (十字红线) */}
        <div className="absolute w-[480px] h-[1px] bg-red-600/40 pointer-events-none" />
        <div className="absolute h-[480px] w-[1px] bg-red-600/40 pointer-events-none" />
      </motion.div>
    </div>
  );
}
