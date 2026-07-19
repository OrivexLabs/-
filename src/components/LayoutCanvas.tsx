/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RoomKey } from '../types';

interface LayoutCanvasProps {
  selectedRoom: RoomKey | null;
  onSelectRoom: (room: RoomKey) => void;
  showElementsColor: boolean;
}

export default function LayoutCanvas({
  selectedRoom,
  onSelectRoom,
  showElementsColor,
}: LayoutCanvasProps) {
  // Define rooms layout and labels for rendering
  const rooms = [
    {
      key: 'entrance' as RoomKey,
      name: '入户玄关',
      element: '金',
      color: 'rgba(148, 163, 184, 0.2)', // slate-400
      hoverColor: 'rgba(148, 163, 184, 0.45)',
      activeColor: 'rgba(148, 163, 184, 0.65)',
      border: 'border-slate-400',
      x: 390,
      y: 220,
      width: 100,
      height: 80,
    },
    {
      key: 'kitchen' as RoomKey,
      name: '厨房 (灶)',
      element: '火',
      color: 'rgba(239, 68, 68, 0.15)', // red-500
      hoverColor: 'rgba(239, 68, 68, 0.35)',
      activeColor: 'rgba(239, 68, 68, 0.55)',
      border: 'border-red-500',
      x: 200,
      y: 110,
      width: 190,
      height: 190,
    },
    {
      key: 'dining' as RoomKey,
      name: '餐厅 (食禄)',
      element: '木',
      color: 'rgba(16, 185, 129, 0.15)', // emerald-500
      hoverColor: 'rgba(16, 185, 129, 0.35)',
      activeColor: 'rgba(16, 185, 129, 0.55)',
      border: 'border-emerald-500',
      x: 390,
      y: 110,
      width: 190,
      height: 190,
    },
    {
      key: 'balcony_north' as RoomKey,
      name: '北生活阳台',
      element: '水',
      color: 'rgba(59, 130, 246, 0.15)', // blue-500
      hoverColor: 'rgba(59, 130, 246, 0.35)',
      activeColor: 'rgba(59, 130, 246, 0.55)',
      border: 'border-blue-500',
      x: 390,
      y: 40,
      width: 190,
      height: 70,
    },
    {
      key: 'living' as RoomKey,
      name: '客厅 (中堂)',
      element: '土',
      color: 'rgba(245, 158, 11, 0.15)', // amber-500
      hoverColor: 'rgba(245, 158, 11, 0.35)',
      activeColor: 'rgba(245, 158, 11, 0.55)',
      border: 'border-amber-500',
      x: 390,
      y: 300,
      width: 200,
      height: 250,
    },
    {
      key: 'study' as RoomKey,
      name: '文昌书房',
      element: '木',
      color: 'rgba(16, 185, 129, 0.15)', // emerald-500
      hoverColor: 'rgba(16, 185, 129, 0.35)',
      activeColor: 'rgba(16, 185, 129, 0.55)',
      border: 'border-emerald-500',
      x: 200,
      y: 300,
      width: 190,
      height: 250,
    },
    {
      key: 'balcony_south' as RoomKey,
      name: '景观大阳台 (6.8米)',
      element: '木',
      color: 'rgba(16, 185, 129, 0.15)', // emerald-500
      hoverColor: 'rgba(16, 185, 129, 0.35)',
      activeColor: 'rgba(16, 185, 129, 0.55)',
      border: 'border-emerald-500',
      x: 200,
      y: 550,
      width: 390,
      height: 100,
    },
    {
      key: 'bathroom_public' as RoomKey,
      name: '公共卫生间',
      element: '水',
      color: 'rgba(59, 130, 246, 0.15)', // blue-500
      hoverColor: 'rgba(59, 130, 246, 0.35)',
      activeColor: 'rgba(59, 130, 246, 0.55)',
      border: 'border-blue-500',
      x: 580,
      y: 110,
      width: 110,
      height: 190,
    },
    {
      key: 'bedroom_south' as RoomKey,
      name: '南朝向次卧',
      element: '土',
      color: 'rgba(245, 158, 11, 0.15)', // amber-500
      hoverColor: 'rgba(245, 158, 11, 0.35)',
      activeColor: 'rgba(245, 158, 11, 0.55)',
      border: 'border-amber-500',
      x: 590,
      y: 300,
      width: 170,
      height: 250,
    },
    {
      key: 'bedroom_master' as RoomKey,
      name: '主卧室',
      element: '金',
      color: 'rgba(148, 163, 184, 0.15)', // slate-400
      hoverColor: 'rgba(148, 163, 184, 0.35)',
      activeColor: 'rgba(148, 163, 184, 0.55)',
      border: 'border-slate-400',
      x: 760,
      y: 300,
      width: 240,
      height: 250,
    },
    {
      key: 'bathroom_master' as RoomKey,
      name: '主卧独立卫生间',
      element: '水',
      color: 'rgba(59, 130, 246, 0.15)', // blue-500
      hoverColor: 'rgba(59, 130, 246, 0.35)',
      activeColor: 'rgba(59, 130, 246, 0.55)',
      border: 'border-blue-500',
      x: 760,
      y: 110,
      width: 240,
      height: 190,
    }
  ];

  return (
    <div className="relative w-full overflow-auto bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col items-center select-none shadow-inner min-h-[450px]">
      <div className="absolute top-4 left-4 z-20 flex flex-col items-start bg-white/95 dark:bg-slate-950/95 p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-[11px] space-y-1.5 shadow-md backdrop-blur-sm pointer-events-auto">
        <p className="font-bold text-slate-800 dark:text-slate-200">互动户型图说明</p>
        <p className="text-slate-500 dark:text-slate-400">点击相应区域，右侧报告会同步定位分析。</p>
        {showElementsColor && (
          <div className="flex flex-wrap gap-x-2.5 gap-y-1 mt-1 border-t border-slate-100 dark:border-slate-800 pt-1.5">
            <span className="flex items-center gap-1 text-emerald-600 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500" />木 (绿)</span>
            <span className="flex items-center gap-1 text-red-600 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500" />火 (红)</span>
            <span className="flex items-center gap-1 text-amber-600 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500" />土 (黄)</span>
            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-slate-500/20 border border-slate-500" />金 (灰)</span>
            <span className="flex items-center gap-1 text-blue-600 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-blue-500/20 border border-blue-500" />水 (蓝)</span>
          </div>
        )}
      </div>

      <div className="relative w-full max-w-[960px] aspect-[4/3] flex items-center justify-center py-6">
        {/* Main interactive SVG mapping out Logan 3-D 115m² layout */}
        <svg
          viewBox="100 0 1000 700"
          className="w-full h-full text-slate-900 dark:text-slate-100 font-sans"
        >
          {/* Architectural Blueprint Grid Background */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(203, 213, 225, 0.15)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect x="120" y="20" width="840" height="650" fill="url(#grid)" rx="16" />

          {/* Exterior Walls */}
          <rect
            x="196"
            y="36"
            width="810"
            height="620"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinejoin="round"
            className="opacity-70"
          />

          {/* Dynamic Compass Rose indicator */}
          <g transform="translate(930, 75)" className="opacity-80">
            <circle cx="0" cy="0" r="30" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M 0 -38 L 0 38 M -38 0 L 38 0" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
            <polygon points="0,-35 -5,-8 0,0" fill="red" />
            <polygon points="0,-35 5,-8 0,0" fill="#cc3333" />
            <polygon points="0,35 -5,8 0,0" fill="#475569" />
            <polygon points="0,35 5,8 0,0" fill="#64748b" />
            <text x="-4" y="-40" className="text-[12px] font-bold fill-red-600">N</text>
            <text x="38" y="4" className="text-[10px] font-bold fill-slate-500">E</text>
            <text x="-4" y="46" className="text-[10px] font-bold fill-slate-500">S</text>
            <text x="-46" y="4" className="text-[10px] font-bold fill-slate-500">W</text>
            <path d="M -21,-21 L 21,21 M -21,21 L 21,-21" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1,2" />
          </g>

          {/* Scale bar */}
          <g transform="translate(860, 640)" className="opacity-75">
            <line x1="0" y1="0" x2="100" y2="0" stroke="currentColor" strokeWidth="2" />
            <line x1="0" y1="-4" x2="0" y2="4" stroke="currentColor" strokeWidth="2" />
            <line x1="50" y1="-3" x2="50" y2="3" stroke="currentColor" strokeWidth="1.5" />
            <line x1="100" y1="-4" x2="100" y2="4" stroke="currentColor" strokeWidth="2" />
            <text x="35" y="-8" className="text-[10px] fill-slate-500">比例 1:115</text>
          </g>

          {/* Rooms Shapes and interactions */}
          {rooms.map((room) => {
            const isSelected = selectedRoom === room.key;
            // Determine active fill color based on state and element color flag
            const fillStyle = showElementsColor
              ? isSelected
                ? room.activeColor
                : room.color
              : isSelected
              ? 'rgba(99, 102, 241, 0.25)' // Indigo glow for selected
              : 'rgba(255, 255, 255, 0.65)'; // default neutral transparent

            const borderStroke = showElementsColor
              ? isSelected
                ? 'stroke-red-700 dark:stroke-yellow-500'
                : 'stroke-slate-400 dark:stroke-slate-600'
              : isSelected
              ? 'stroke-indigo-600 dark:stroke-indigo-400'
              : 'stroke-slate-300 dark:stroke-slate-700';

            const borderStrokeWidth = isSelected ? '3' : '1.5';

            return (
              <g
                key={room.key}
                onClick={() => onSelectRoom(room.key)}
                className="cursor-pointer group"
                id={`room-${room.key}`}
              >
                {/* Main room boundary */}
                <rect
                  x={room.x}
                  y={room.y}
                  width={room.width}
                  height={room.height}
                  fill={fillStyle}
                  className={`transition-all duration-300 ${borderStroke} hover:fill-indigo-50 dark:hover:fill-slate-800/60`}
                  strokeWidth={borderStrokeWidth}
                  strokeDasharray={room.key.startsWith('balcony') ? '4,3' : '0'}
                />

                {/* Sub-icons or representations inside the room */}
                {room.key === 'kitchen' && (
                  <g transform={`translate(${room.x + 30}, ${room.y + 35})`} className="opacity-30 pointer-events-none">
                    {/* Stove visual representation */}
                    <rect x="0" y="0" width="40" height="30" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="12" cy="15" r="7" fill="none" stroke="currentColor" strokeWidth="1" />
                    <circle cx="28" cy="15" r="7" fill="none" stroke="currentColor" strokeWidth="1" />
                  </g>
                )}

                {room.key === 'bedroom_master' && (
                  <g transform={`translate(${room.x + 90}, ${room.y + 110})`} className="opacity-25 pointer-events-none">
                    {/* Master bed */}
                    <rect x="0" y="0" width="70" height="80" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="5" y="5" width="25" height="15" fill="none" stroke="currentColor" strokeWidth="1" />
                    <rect x="40" y="5" width="25" height="15" fill="none" stroke="currentColor" strokeWidth="1" />
                    <line x1="0" y1="25" x2="70" y2="25" stroke="currentColor" strokeWidth="1" />
                  </g>
                )}

                {room.key === 'dining' && (
                  <g transform={`translate(${room.x + 65}, ${room.y + 70})`} className="opacity-35 pointer-events-none">
                    {/* Dining table & chairs */}
                    <rect x="0" y="0" width="60" height="45" rx="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="30" cy="22.5" r="10" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
                    <rect x="15" y="-10" width="10" height="8" rx="2" fill="none" stroke="currentColor" strokeWidth="1" />
                    <rect x="35" y="-10" width="10" height="8" rx="2" fill="none" stroke="currentColor" strokeWidth="1" />
                    <rect x="15" y="47" width="10" height="8" rx="2" fill="none" stroke="currentColor" strokeWidth="1" />
                    <rect x="35" y="47" width="10" height="8" rx="2" fill="none" stroke="currentColor" strokeWidth="1" />
                  </g>
                )}

                {room.key === 'balcony_south' && (
                  <g transform={`translate(${room.x + 130}, ${room.y + 40})`} className="opacity-30 pointer-events-none">
                    {/* Potted plants representing Wood element */}
                    <circle cx="15" cy="15" r="12" fill="none" stroke="currentColor" strokeWidth="1" />
                    <path d="M 15 3 Q 10 15 15 27 M 15 3 Q 20 15 15 27" fill="none" stroke="currentColor" strokeWidth="0.8" />
                    <circle cx="110" cy="15" r="12" fill="none" stroke="currentColor" strokeWidth="1" />
                    <path d="M 110 3 Q 105 15 110 27 M 110 3 Q 115 15 110 27" fill="none" stroke="currentColor" strokeWidth="0.8" />
                  </g>
                )}

                {/* Text Labels inside each room */}
                <text
                  x={room.x + room.width / 2}
                  y={room.y + room.height / 2 - 4}
                  textAnchor="middle"
                  className={`text-[12px] font-bold font-sans fill-slate-800 dark:fill-slate-100 group-hover:fill-indigo-600 dark:group-hover:fill-indigo-400 transition-colors duration-200 ${
                    isSelected ? 'fill-indigo-600 dark:fill-indigo-400 scale-[1.03]' : ''
                  }`}
                >
                  {room.name}
                </text>
                <text
                  x={room.x + room.width / 2}
                  y={room.y + room.height / 2 + 14}
                  textAnchor="middle"
                  className={`text-[9px] font-mono fill-slate-400 dark:fill-slate-500 group-hover:fill-indigo-500/80`}
                >
                  {showElementsColor ? `五行: ${room.element}` : `(点击查看)`}
                </text>

                {/* Highlight dot if selected */}
                {isSelected && (
                  <circle
                    cx={room.x + 15}
                    cy={room.y + 15}
                    r="4"
                    className="fill-indigo-600 dark:fill-indigo-400 animate-ping"
                  />
                )}
              </g>
            );
          })}

          {/* Wall thickness & visual borders */}
          <path
            d={`M 390 110 L 390 550 M 200 300 L 590 300 M 590 110 L 590 550 M 760 110 L 760 550`}
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            className="opacity-50 pointer-events-none"
          />

          {/* Main door indicator (entrance) */}
          <path
            d="M 390 220 A 45 45 0 0 1 345 265 L 390 265 Z"
            fill="rgba(99, 102, 241, 0.15)"
            stroke="rgb(99, 102, 241)"
            strokeWidth="1.5"
            className="pointer-events-none"
          />

          {/* Southeast Label Arrow (Dry山Xun向) */}
          <g transform="translate(680, 580)" className="opacity-70 pointer-events-none">
            <line x1="-40" y1="40" x2="40" y2="-40" stroke="red" strokeWidth="2" strokeDasharray="3,1" />
            <polygon points="40,-40 28,-30 38,-28" fill="red" />
            <text x="35" y="-12" transform="rotate(-45, 35, -12)" className="text-[10px] font-bold fill-red-600 font-mono">
              东南 巽向 (朝南)
            </text>
            <text x="-65" y="32" transform="rotate(-45, -65, 32)" className="text-[10px] font-bold fill-slate-500 font-mono">
              西北 乾山 (后靠)
            </text>
          </g>

          {/* Straight-Through Draft (穿堂煞) Indicator Line */}
          <g className="opacity-45 pointer-events-none">
            <line x1="485" y1="20" x2="485" y2="670" stroke="#f43f5e" strokeWidth="3" strokeDasharray="6,4" />
            <circle cx="485" cy="30" r="5" fill="#f43f5e" />
            <polygon points="485,675 480,660 490,660" fill="#f43f5e" />
            <rect x="420" y="320" width="130" height="20" rx="3" fill="#fff" stroke="#f43f5e" strokeWidth="1" />
            <text x="485" y="334" textAnchor="middle" className="text-[10px] font-bold fill-rose-600">
              ⚠️ 穿堂风 (穿堂煞)
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}
