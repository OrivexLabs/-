/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Compass, Calculator, User, Sparkles } from 'lucide-react';

interface InteractiveInputProps {
  onCalculate: (data: {
    birthYear: number;
    gender: 'male' | 'female';
    doorSector: string;
  }) => void;
}

export default function InteractiveInput({ onCalculate }: InteractiveInputProps) {
  const [birthYear, setBirthYear] = useState<number>(1990);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [doorSector, setDoorSector] = useState<string>('NW');

  const [calculatedGua, setCalculatedGua] = useState<{
    guaNum: number;
    guaName: string;
    group: string;
    element: string;
    auspicious: string[];
    inauspicious: string[];
    description: string;
  } | null>(null);

  const calculateMingGua = () => {
    // Basic single digit year reduction helper
    const getYearDigitSum = (year: number) => {
      let sum = String(year)
        .split('')
        .map(Number)
        .reduce((a, b) => a + b, 0);
      while (sum > 9) {
        sum = String(sum)
          .split('')
          .map(Number)
          .reduce((a, b) => a + b, 0);
      }
      return sum;
    };

    const reducedSum = getYearDigitSum(birthYear);
    let guaNum = 0;

    if (birthYear < 2000) {
      if (gender === 'male') {
        guaNum = 11 - reducedSum;
        if (guaNum <= 0) guaNum += 9;
      } else {
        guaNum = reducedSum + 4;
        if (guaNum > 9) {
          guaNum = (guaNum % 9) === 0 ? 9 : guaNum % 9;
        }
      }
    } else {
      // 2000 and after
      if (gender === 'male') {
        guaNum = 9 - ((reducedSum - 1 + 9) % 9);
        if (guaNum <= 0) guaNum = 9;
      } else {
        guaNum = reducedSum + 6;
        if (guaNum > 9) {
          guaNum = (guaNum % 9) === 0 ? 9 : guaNum % 9;
        }
      }
    }

    // Resolve 5 (Kun for male, Gen for female)
    if (guaNum === 5) {
      if (gender === 'male') {
        guaNum = 2; // Kun
      } else {
        guaNum = 8; // Gen
      }
    }

    // Map numbers to Trigram detail
    const guaMap: Record<
      number,
      {
        name: string;
        group: string;
        element: string;
        auspicious: string[];
        inauspicious: string[];
        description: string;
      }
    > = {
      1: {
        name: '坎卦 (Kan)',
        group: '东四命',
        element: '水',
        auspicious: ['正南 (生气)', '正北 (伏位)', '正东 (天医)', '东南 (延年)'],
        inauspicious: ['西南 (绝命)', '东北 (五鬼)', '西北 (六煞)', '正西 (祸害)'],
        description: '坎主智。为人聪慧、思虑深远、善于变通。居水本位，最适宜静心钻研，睡眠宜靠北或东南，利于凝聚灵感。',
      },
      2: {
        name: '坤卦 (Kun)',
        group: '西四命',
        element: '土',
        auspicious: ['东北 (生气)', '西南 (伏位)', '正西 (天医)', '西北 (延年)'],
        inauspicious: ['正北 (绝命)', '东南 (五鬼)', '正南 (六煞)', '正东 (祸害)'],
        description: '坤主容。为人宽厚稳重、极具包容心与财富积蓄力。五行属土，睡觉或工作宜面向东北、西南，家庭关系极为和睦。',
      },
      3: {
        name: '震卦 (Zhen)',
        group: '东四命',
        element: '木',
        auspicious: ['正南 (生气)', '正东 (伏位)', '正北 (天医)', '东南 (延年)'],
        inauspicious: ['西北 (绝命)', '西南 (五鬼)', '东北 (六煞)', '正西 (祸害)'],
        description: '震主雷。做事雷厉风行、积极开拓、富有朝气与魄力。居木位，卧室床头宜朝东或南，可助旺上升的生发能量。',
      },
      4: {
        name: '巽卦 (Xun)',
        group: '东四命',
        element: '木',
        auspicious: ['正北 (生气)', '东南 (伏位)', '正南 (天医)', '正东 (延年)'],
        inauspicious: ['东北 (绝命)', '西南 (五鬼)', '正西 (六煞)', '西北 (祸害)'],
        description: '巽主风。为人温和谦逊、人缘极好、善于沟通交流。卧室设于住宅南侧或东侧佳，配合床头朝东或北，事业顺利顺心。',
      },
      6: {
        name: '乾卦 (Qian)',
        group: '西四命',
        element: '金',
        auspicious: ['正西 (生气)', '西北 (伏位)', '东北 (天医)', '西南 (延年)'],
        inauspicious: ['正南 (绝命)', '正东 (五鬼)', '正北 (六煞)', '东南 (祸害)'],
        description: '乾为天。具领导才能、重情重义、权威自若。五行属金，睡眠与办公方向切记首选西北（伏位）、西南（延年）或正西（生气），贵人扶持极强。',
      },
      7: {
        name: '兑卦 (Dui)',
        group: '西四命',
        element: '金',
        auspicious: ['西北 (生气)', '正西 (伏位)', '西南 (天医)', '东北 (延年)'],
        inauspicious: ['正东 (绝命)', '正南 (五鬼)', '东南 (六煞)', '正北 (祸害)'],
        description: '兑主泽。擅长口才表达、乐观活泼、极富艺术涵养。五行属金，最宜居住西四宅，配合西方、西北等方位，名望财富步步上升。',
      },
      8: {
        name: '艮卦 (Gen)',
        group: '西四命',
        element: '土',
        auspicious: ['西南 (生气)', '东北 (伏位)', '西北 (天医)', '正西 (延年)'],
        inauspicious: ['东南 (绝命)', '正北 (五鬼)', '正东 (六煞)', '正南 (祸害)'],
        description: '艮主山。处事坚韧固执、诚实可靠、擅长守财防守。属土，适宜静中求进。床头适宜靠东北（伏位）或西北（天医），身体安泰无疾。',
      },
      9: {
        name: '离卦 (Li)',
        group: '东四命',
        element: '火',
        auspicious: ['正东 (生气)', '正南 (伏位)', '东南 (天医)', '正北 (延年)'],
        inauspicious: ['西北 (绝命)', '正西 (五鬼)', '西南 (六煞)', '东北 (祸害)'],
        description: '离为火。热情奔放、思想开明、重视名誉和礼节。属火，求学及晋升运极佳。卧床、书桌方位建议面向南方或正东方，精力旺盛。',
      },
    };

    const details = guaMap[guaNum];
    if (details) {
      const result = {
        guaNum,
        guaName: details.name,
        group: details.group,
        element: details.element,
        auspicious: details.auspicious,
        inauspicious: details.inauspicious,
        description: details.description,
      };
      setCalculatedGua(result);
      onCalculate({ birthYear, gender, doorSector });
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-5">
      <div className="flex items-center gap-2">
        <Calculator className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-sans tracking-tight">
          八宅本命卦自助计算器
        </h3>
      </div>
      <p className="text-[11px] text-slate-500 leading-relaxed">
        根据《八宅明镜》秘传算法，推算您的“命卦”，以确定您和房屋气场是否契合。
      </p>

      <div className="space-y-3.5 text-xs">
        {/* Birth Year */}
        <div className="flex flex-col gap-1">
          <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <User className="w-3.5 h-3.5" /> 阳历出生年份
          </label>
          <input
            type="number"
            min="1920"
            max="2030"
            value={birthYear}
            onChange={(e) => setBirthYear(parseInt(e.target.value) || 1990)}
            className="w-full bg-white dark:bg-slate-950 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono"
          />
        </div>

        {/* Gender */}
        <div className="flex flex-col gap-1">
          <label className="font-bold text-slate-700 dark:text-slate-300">性别</label>
          <div className="flex gap-2">
            <button
              onClick={() => setGender('male')}
              className={`flex-1 py-1.5 rounded-lg border transition-all duration-200 ${
                gender === 'male'
                  ? 'bg-indigo-600 border-indigo-600 text-white font-bold'
                  : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
              }`}
            >
              男主人 / 男性
            </button>
            <button
              onClick={() => setGender('female')}
              className={`flex-1 py-1.5 rounded-lg border transition-all duration-200 ${
                gender === 'female'
                  ? 'bg-indigo-600 border-indigo-600 text-white font-bold'
                  : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
              }`}
            >
              女主人 / 女性
            </button>
          </div>
        </div>

        {/* Door sector / orientation */}
        <div className="flex flex-col gap-1">
          <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5" /> 大门所在方位
          </label>
          <select
            value={doorSector}
            onChange={(e) => setDoorSector(e.target.value)}
            className="w-full bg-white dark:bg-slate-950 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="NW">西北乾方 (如本案大门)</option>
            <option value="W">正西兑方</option>
            <option value="SW">西南坤方</option>
            <option value="NE">东北艮方</option>
            <option value="N">正北坎方</option>
            <option value="S">正南离方</option>
            <option value="E">正东震方</option>
            <option value="SE">东南巽方</option>
          </select>
        </div>

        <button
          onClick={calculateMingGua}
          className="w-full py-2 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-md mt-4"
        >
          <Sparkles className="w-4 h-4 text-amber-500" /> 推算命卦与吉凶位
        </button>
      </div>

      {/* Calculated outcome card */}
      {calculatedGua && (
        <div className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/80 p-4 rounded-xl space-y-3.5 animate-fadeIn text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-900 pb-2">
            <span className="font-bold text-slate-800 dark:text-slate-200 text-[13px]">
              推算结果：<strong className="text-indigo-600 dark:text-indigo-400">{calculatedGua.guaName}</strong>
            </span>
            <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 font-extrabold text-[10px]">
              {calculatedGua.group} (五行属{calculatedGua.element})
            </span>
          </div>

          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px] italic">
            {calculatedGua.description}
          </p>

          <div className="space-y-2 border-t border-slate-100 dark:border-slate-900 pt-3">
            <div>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mb-1">
                🟢 四吉位 (最利作为床头、书桌朝向)：
              </span>
              <div className="flex flex-wrap gap-1.5">
                {calculatedGua.auspicious.map((item) => (
                  <span
                    key={item}
                    className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 font-medium text-[10px] rounded"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-1.5">
              <span className="font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1 mb-1">
                🔴 四凶位 (最忌作为床头，宜作厕所压制)：
              </span>
              <div className="flex flex-wrap gap-1.5">
                {calculatedGua.inauspicious.map((item) => (
                  <span
                    key={item}
                    className="px-2 py-0.5 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 font-medium text-[10px] rounded"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
