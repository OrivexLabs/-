/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { RoomKey } from '../types';
import { 
  Rotate3d, 
  Play, 
  Pause, 
  Maximize, 
  Compass, 
  Wind, 
  Sliders, 
  Eye, 
  HelpCircle, 
  Flame, 
  TreePine, 
  Trees, 
  Sparkles,
  RefreshCw
} from 'lucide-react';

interface ThreeDLayoutSandboxProps {
  selectedRoom: RoomKey | null;
  onSelectRoom: (room: RoomKey) => void;
  showElementsColor: boolean;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Face3D {
  points: Point3D[];
  color: string;
  borderColor?: string;
  depth: number;
  isFloor?: boolean;
  label?: string;
  roomKey?: RoomKey;
}

export default function ThreeDLayoutSandbox({
  selectedRoom,
  onSelectRoom,
  showElementsColor,
}: ThreeDLayoutSandboxProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // 3D camera angles
  const [yaw, setYaw] = useState<number>(-0.6); // Z-axis rotation
  const [pitch, setPitch] = useState<number>(0.85); // X-axis rotation
  const [zoom, setZoom] = useState<number>(0.45); // Camera zoom
  const [wallHeight, setWallHeight] = useState<number>(60); // Height of 3D walls
  const [isRotating, setIsRotating] = useState<boolean>(true); // Auto rotation
  const [showQiFlow, setShowQiFlow] = useState<boolean>(true); // Show wind/Qi particles
  const [qiSpeed, setQiSpeed] = useState<number>(3); // Speed of particles
  const [remedyApplied, setRemedyApplied] = useState<boolean>(false); // Apply screens/plants to block "Qi piercer"

  // View Perspective Mode: 'bird' (上帝鸟瞰) or 'walk' (平视观察)
  const [viewPerspectiveMode, setViewPerspectiveMode] = useState<'bird' | 'walk'>('bird');
  const [walkStep, setWalkStep] = useState<number>(0);
  
  // Camera center coordinates targets
  const [cameraTargetX, setCameraTargetX] = useState<number>(600);
  const [cameraTargetY, setCameraTargetY] = useState<number>(345);

  // Walkthrough steps definition
  const WALK_STEPS = [
    {
      name: '位置一：入户玄关处',
      centerX: 440,
      centerY: 240,
      yaw: -0.6,
      pitch: 1.45,
      zoom: 1.25,
      desc: '站立于入户玄关大门。正前平视可看到玄关通道。由于入户大门与北生活阳台、景观大阳台居于同一南北直线上，大门的气流会直接泄走（穿堂煞）。建议部署屏风/绿植阻挡。',
    },
    {
      name: '位置二：玄关折角屏风处',
      centerX: 440,
      centerY: 300,
      yaw: 0.15,
      pitch: 1.42,
      zoom: 1.35,
      desc: '步行至玄关与客餐厅的折折交汇点。在此处可以直观感受部署屏风、绿植后的遮挡效果。疾风被缓冲、阻隔、折流，转为温和流动，“藏风聚气”的吉祥格局至此初现。',
    },
    {
      name: '位置三：客厅正中央',
      centerX: 490,
      centerY: 425,
      yaw: 0.9,
      pitch: 1.40,
      zoom: 1.45,
      desc: '置身于中堂客厅的核心中央。人眼平视感受到朝南景观大阳台带来的充裕天光，开阔大气，右手边通往主卧室，动静、公私流线在这里清晰舒畅，气场极为丰足。',
    },
    {
      name: '位置四：景观大阳台',
      centerX: 395,
      centerY: 600,
      yaw: 2.85,
      pitch: 1.42,
      zoom: 1.2,
      desc: '驻足于南向景观大阳台。回眸北望，客餐厅大面宽的开阔感直扑眼帘，空间毫无压迫感。合理的布局令此处的自然气流循环流转，充满生机。',
    }
  ];

  const handleSelectWalkStep = (stepIdx: number) => {
    setWalkStep(stepIdx);
    const step = WALK_STEPS[stepIdx];
    setCameraTargetX(step.centerX);
    setCameraTargetY(step.centerY);
    setYaw(step.yaw);
    setPitch(step.pitch);
    setZoom(step.zoom);
    setIsRotating(false); // Stop rotating automatically for direct viewing
  };

  const handleSwitchToBird = () => {
    setViewPerspectiveMode('bird');
    setCameraTargetX(600);
    setCameraTargetY(345);
    setYaw(-0.6);
    setPitch(0.85);
    setZoom(0.45);
    setIsRotating(true);
  };

  const handleSwitchToWalk = () => {
    setViewPerspectiveMode('walk');
    handleSelectWalkStep(0);
  };

  // Hover state
  const [hoveredRoom, setHoveredRoom] = useState<RoomKey | null>(null);

  // Particle list for Qi (energy flow)
  const particlesRef = useRef<Array<{ x: number; y: number; z: number; age: number; speed: number; id: number }>>([]);
  const animationFrameId = useRef<number | null>(null);

  // Define original rooms coordinates (same as 2D SVG)
  const roomsData = [
    {
      key: 'entrance' as RoomKey,
      name: '入户玄关',
      element: '金',
      color: 'rgba(148, 163, 184, 0.25)',
      activeColor: 'rgba(148, 163, 184, 0.7)',
      x: 390,
      y: 220,
      width: 100,
      height: 80,
    },
    {
      key: 'kitchen' as RoomKey,
      name: '厨房 (灶)',
      element: '火',
      color: 'rgba(239, 68, 68, 0.18)',
      activeColor: 'rgba(239, 68, 68, 0.6)',
      x: 200,
      y: 110,
      width: 190,
      height: 190,
    },
    {
      key: 'dining' as RoomKey,
      name: '餐厅 (食禄)',
      element: '木',
      color: 'rgba(16, 185, 129, 0.18)',
      activeColor: 'rgba(16, 185, 129, 0.6)',
      x: 390,
      y: 110,
      width: 190,
      height: 190,
    },
    {
      key: 'balcony_north' as RoomKey,
      name: '北生活阳台',
      element: '水',
      color: 'rgba(59, 130, 246, 0.18)',
      activeColor: 'rgba(59, 130, 246, 0.6)',
      x: 390,
      y: 40,
      width: 190,
      height: 70,
    },
    {
      key: 'living' as RoomKey,
      name: '客厅 (中堂)',
      element: '土',
      color: 'rgba(245, 158, 11, 0.18)',
      activeColor: 'rgba(245, 158, 11, 0.6)',
      x: 390,
      y: 300,
      width: 200,
      height: 250,
    },
    {
      key: 'study' as RoomKey,
      name: '文昌书房',
      element: '木',
      color: 'rgba(16, 185, 129, 0.18)',
      activeColor: 'rgba(16, 185, 129, 0.6)',
      x: 200,
      y: 300,
      width: 190,
      height: 250,
    },
    {
      key: 'balcony_south' as RoomKey,
      name: '景观大阳台',
      element: '木',
      color: 'rgba(16, 185, 129, 0.18)',
      activeColor: 'rgba(16, 185, 129, 0.6)',
      x: 200,
      y: 550,
      width: 390,
      height: 100,
    },
    {
      key: 'bathroom_public' as RoomKey,
      name: '公共卫生间',
      element: '水',
      color: 'rgba(59, 130, 246, 0.18)',
      activeColor: 'rgba(59, 130, 246, 0.6)',
      x: 580,
      y: 110,
      width: 110,
      height: 190,
    },
    {
      key: 'bedroom_south' as RoomKey,
      name: '南朝向次卧',
      element: '土',
      color: 'rgba(245, 158, 11, 0.18)',
      activeColor: 'rgba(245, 158, 11, 0.6)',
      x: 590,
      y: 300,
      width: 170,
      height: 250,
    },
    {
      key: 'bedroom_master' as RoomKey,
      name: '主卧室',
      element: '金',
      color: 'rgba(148, 163, 184, 0.18)',
      activeColor: 'rgba(148, 163, 184, 0.6)',
      x: 760,
      y: 300,
      width: 240,
      height: 250,
    },
    {
      key: 'bathroom_master' as RoomKey,
      name: '主卧卫生间',
      element: '水',
      color: 'rgba(59, 130, 246, 0.18)',
      activeColor: 'rgba(59, 130, 246, 0.6)',
      x: 760,
      y: 110,
      width: 240,
      height: 190,
    }
  ];

  // Initialize particles once
  useEffect(() => {
    const arr = [];
    for (let i = 0; i < 40; i++) {
      arr.push({
        x: 485 + (Math.random() - 0.5) * 35, // Along the center line (piercing hall)
        y: 40 + Math.random() * 600,
        z: 15 + Math.random() * 20,
        age: Math.random() * 100,
        speed: 1.5 + Math.random() * 2,
        id: Math.random()
      });
    }
    particlesRef.current = arr;
  }, []);

  // Main render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localYaw = yaw;

    const render = () => {
      // Handle auto rotation
      if (isRotating) {
        localYaw += 0.003;
        if (localYaw > Math.PI * 2) localYaw -= Math.PI * 2;
      }

      // Clear canvas with deep space gradient
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const bgGrad = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        50,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 1.3
      );
      bgGrad.addColorStop(0, '#0f172a'); // slate-900
      bgGrad.addColorStop(1, '#020617'); // slate-950
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid stars on background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      for (let s = 0; s < 30; s++) {
        const starX = (s * 473 + 129) % canvas.width;
        const starY = (s * 321 + 83) % canvas.height;
        ctx.fillRect(starX, starY, 1.5, 1.5);
      }

      // Draw Legend
      drawLegend(ctx, canvas);

      // Center offset
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2 + 30;

      // Translate model center:
      // Width range of rooms is roughly 200 to 1000, so center is ~600.
      // Height range of rooms is roughly 40 to 650, so center is ~345.
      const modelCenterX = cameraTargetX;
      const modelCenterY = cameraTargetY;

      // Coordinate converter helper
      const project = (pt: Point3D): { x: number; y: number; depth: number } => {
        const lx = pt.x - modelCenterX;
        const ly = pt.y - modelCenterY;
        const lz = pt.z;

        // Yaw rotation (Z-axis)
        const rx1 = lx * Math.cos(localYaw) - ly * Math.sin(localYaw);
        const ry1 = lx * Math.sin(localYaw) + ly * Math.cos(localYaw);
        const rz1 = lz;

        // Pitch rotation (X-axis)
        const rx2 = rx1;
        const ry2 = ry1 * Math.cos(pitch) - rz1 * Math.sin(pitch);
        const rz2 = ry1 * Math.sin(pitch) + rz1 * Math.cos(pitch);

        // Perspective scaling factor
        const screenX = centerX + rx2 * zoom;
        const screenY = centerY + ry2 * zoom;

        return {
          x: screenX,
          y: screenY,
          depth: rz2, // larger is deeper
        };
      };

      // Generate all faces (Floors, Walls, Furniture, Remedies)
      const faces: Face3D[] = [];

      // 1. Draw classical Bagua Ring as the lowest layer
      drawBaguaCircle(ctx, centerX, centerY, localYaw, project);

      // 2. Floors & Walls generator
      roomsData.forEach((room) => {
        const rx = room.x;
        const ry = room.y;
        const rw = room.width;
        const rh = room.height;

        const isSelected = selectedRoom === room.key;
        const isHovered = hoveredRoom === room.key;

        // Floor Color
        let floorColor = showElementsColor ? room.color : 'rgba(30, 41, 59, 0.35)';
        if (isSelected) floorColor = room.activeColor;
        else if (isHovered) floorColor = 'rgba(99, 102, 241, 0.45)';

        const floorPoints = [
          { x: rx, y: ry, z: 0 },
          { x: rx + rw, y: ry, z: 0 },
          { x: rx + rw, y: ry + rh, z: 0 },
          { x: rx, y: ry + rh, z: 0 },
        ];

        // Average depth of floor
        const floorDepth = floorPoints.reduce((acc, p) => acc + project(p).depth, 0) / 4;

        // Register Floor face
        faces.push({
          points: floorPoints,
          color: floorColor,
          borderColor: isSelected ? '#eab308' : 'rgba(255,255,255,0.12)',
          depth: floorDepth + 50, // Put floor depth slightly behind
          isFloor: true,
          label: room.name,
          roomKey: room.key,
        });

        // 3D Walls Extrusion
        const wallSegments = [
          // Top edge
          [
            { x: rx, y: ry },
            { x: rx + rw, y: ry },
          ],
          // Right edge
          [
            { x: rx + rw, y: ry },
            { x: rx + rw, y: ry + rh },
          ],
          // Bottom edge
          [
            { x: rx + rw, y: ry + rh },
            { x: rx, y: ry + rh },
          ],
          // Left edge
          [
            { x: rx, y: ry + rh },
            { x: rx, y: ry },
          ],
        ];

        wallSegments.forEach((seg, sIdx) => {
          // Check if we should render open walls (e.g. windows/balconies) with lower heights or dashed lines
          const isBalconyEdge = room.key.startsWith('balcony') && (sIdx === 0 || sIdx === 2);
          const currentH = isBalconyEdge ? wallHeight * 0.25 : wallHeight;

          const p1 = seg[0];
          const p2 = seg[1];

          const wallPoints = [
            { x: p1.x, y: p1.y, z: 0 },
            { x: p2.x, y: p2.y, z: 0 },
            { x: p2.x, y: p2.y, z: currentH },
            { x: p1.x, y: p1.y, z: currentH },
          ];

          const wallDepth = wallPoints.reduce((acc, p) => acc + project(p).depth, 0) / 4;

          // Wall coloring depending on state
          let wallColor = 'rgba(71, 85, 105, 0.15)'; // Glass wall
          if (isSelected) wallColor = 'rgba(234, 179, 8, 0.15)';
          else if (isHovered) wallColor = 'rgba(99, 102, 241, 0.15)';

          faces.push({
            points: wallPoints,
            color: wallColor,
            borderColor: isSelected ? 'rgba(234, 179, 8, 0.7)' : 'rgba(148, 163, 184, 0.4)',
            depth: wallDepth,
            roomKey: room.key,
          });
        });

        // Add 3D furniture models based on key
        if (room.key === 'bedroom_master') {
          // Master Bed Box
          const bx = rx + 80;
          const by = ry + 80;
          const bw = 80;
          const bh = 90;
          const bz = 25;

          const bedPoints = [
            { x: bx, y: by, z: 0 },
            { x: bx + bw, y: by, z: 0 },
            { x: bx + bw, y: by + bh, z: 0 },
            { x: bx, y: by + bh, z: 0 },
          ];
          const bedTopPoints = [
            { x: bx, y: by, z: bz },
            { x: bx + bw, y: by, z: bz },
            { x: bx + bw, y: by + bh, z: bz },
            { x: bx, y: by + bh, z: bz },
          ];

          const bedDepth = bedPoints.reduce((acc, p) => acc + project(p).depth, 0) / 4;

          faces.push({
            points: bedTopPoints,
            color: 'rgba(226, 232, 240, 0.85)',
            borderColor: '#94a3b8',
            depth: bedDepth,
          });
        }

        if (room.key === 'kitchen') {
          // Red glowing Stove/Cooking bench for "灶" (Fire element)
          const kx = rx + 40;
          const ky = ry + 30;
          const kw = 50;
          const kh = 40;
          const kz = 22;

          const stovePoints = [
            { x: kx, y: ky, z: kz },
            { x: kx + kw, y: ky, z: kz },
            { x: kx + kw, y: ky + kh, z: kz },
            { x: kx, y: ky + kh, z: kz },
          ];

          const stoveDepth = stovePoints.reduce((acc, p) => acc + project(p).depth, 0) / 4;

          faces.push({
            points: stovePoints,
            color: 'rgba(239, 68, 68, 0.8)', // Strong red stove representing Fire
            borderColor: '#f87171',
            depth: stoveDepth,
          });
        }

        if (room.key === 'dining') {
          // Large Dining Table (Wood Element)
          const dx = rx + 60;
          const dy = ry + 60;
          const dw = 70;
          const dh = 50;
          const dz = 24;

          const tablePoints = [
            { x: dx, y: dy, z: dz },
            { x: dx + dw, y: dy, z: dz },
            { x: dx + dw, y: dy + dh, z: dz },
            { x: dx, y: dy + dh, z: dz },
          ];

          const tableDepth = tablePoints.reduce((acc, p) => acc + project(p).depth, 0) / 4;

          faces.push({
            points: tablePoints,
            color: 'rgba(16, 185, 129, 0.85)', // Wood color representation
            borderColor: '#34d399',
            depth: tableDepth,
          });
        }

        if (room.key === 'balcony_south') {
          // Large green plants representing the remedy or natural Wood barrier
          const px1 = rx + 140;
          const py1 = ry + 40;
          const px2 = rx + 240;
          const py2 = ry + 40;

          // Remedy screen barrier if checked
          if (remedyApplied) {
            // Screen 3D Box placed between living and dining (approx y=300, center x=485)
            const sx = 420;
            const sy = 295;
            const sw = 130;
            const sh = 10;
            const sz = 45;

            const screenPoints = [
              { x: sx, y: sy, z: sz },
              { x: sx + sw, y: sy, z: sz },
              { x: sx + sw, y: sy + sh, z: sz },
              { x: sx, y: sy + sh, z: sz },
            ];

            const screenDepth = screenPoints.reduce((acc, p) => acc + project(p).depth, 0) / 4;

            faces.push({
              points: screenPoints,
              color: 'rgba(16, 185, 129, 0.95)', // Green Screen Remedy representing Wood/Plant
              borderColor: '#10b981',
              depth: screenDepth - 10,
              label: '🌿 风水玄关屏风 (已设)',
            });
          }
        }
      });

      // Painter's algorithm: sort faces by depth (largest depth = furthest away, drawn first)
      faces.sort((a, b) => b.depth - a.depth);

      // Render Sorted faces
      faces.forEach((face) => {
        const projectedPoints = face.points.map((p) => project(p));

        ctx.beginPath();
        ctx.moveTo(projectedPoints[0].x, projectedPoints[0].y);
        for (let i = 1; i < projectedPoints.length; i++) {
          ctx.lineTo(projectedPoints[i].x, projectedPoints[i].y);
        }
        ctx.closePath();

        // Fill Face
        ctx.fillStyle = face.color;
        ctx.fill();

        // Stroke border
        if (face.borderColor) {
          ctx.strokeStyle = face.borderColor;
          ctx.lineWidth = face.roomKey === selectedRoom ? 2.5 : 1.2;
          ctx.stroke();
        }

        // Draw dynamic room label on top of floors
        if (face.isFloor && face.label) {
          const centerProj = project(face.points[0]); // approx label near corner
          // Calculate center of points
          const avgX = projectedPoints.reduce((sum, p) => sum + p.x, 0) / projectedPoints.length;
          const avgY = projectedPoints.reduce((sum, p) => sum + p.y, 0) / projectedPoints.length;

          ctx.fillStyle = selectedRoom === face.roomKey ? '#facc15' : '#f1f5f9';
          ctx.font = 'bold 9px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(face.label, avgX, avgY - 2);

          // Sub-elements
          const element = roomsData.find(r => r.key === face.roomKey)?.element;
          ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
          ctx.font = '8px monospace';
          ctx.fillText(`五行: ${element}`, avgX, avgY + 10);
        }

        // Label screens or special items
        if (face.label && !face.isFloor) {
          const avgX = projectedPoints.reduce((sum, p) => sum + p.x, 0) / projectedPoints.length;
          const avgY = projectedPoints.reduce((sum, p) => sum + p.y, 0) / projectedPoints.length;
          ctx.fillStyle = '#10b981';
          ctx.font = 'bold 8.5px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(face.label, avgX, avgY - 10);
        }
      });

      // 4. Animated 3D Qi flow (Wind Particles representing "穿堂煞")
      if (showQiFlow) {
        particlesRef.current.forEach((p) => {
          // If remedy is applied, bounce/disperse particles near the screen area
          if (remedyApplied && p.y > 280 && p.y < 310) {
            // Disperse sideways
            p.x += (Math.random() - 0.5) * 8;
          }

          // Advance particle position
          p.y += p.speed * qiSpeed * 0.6;
          p.age += 1;

          // Reset if reached South edge
          if (p.y > 640 || p.age > 180) {
            p.y = 40;
            p.x = 485 + (Math.random() - 0.5) * 35;
            p.age = 0;
          }

          const ptProj = project(p);

          // Gradient color: piercing speed is red, normal is blue
          const glowGrad = ctx.createRadialGradient(
            ptProj.x,
            ptProj.y,
            0,
            ptProj.x,
            ptProj.y,
            remedyApplied ? 3.5 : 5
          );

          if (remedyApplied) {
            // Soothed slow energy flow (emerald/cyan)
            glowGrad.addColorStop(0, 'rgba(52, 211, 153, 0.9)');
            glowGrad.addColorStop(1, 'rgba(52, 211, 153, 0)');
          } else {
            // Violent "Sha Qi" pierce flow (rose/pink)
            glowGrad.addColorStop(0, 'rgba(244, 63, 94, 0.95)');
            glowGrad.addColorStop(1, 'rgba(244, 63, 94, 0)');
          }

          ctx.beginPath();
          ctx.arc(ptProj.x, ptProj.y, remedyApplied ? 4 : 6, 0, Math.PI * 2);
          ctx.fillStyle = glowGrad;
          ctx.fill();
        });

        // Flow indicator arrow or notes
        ctx.fillStyle = remedyApplied ? '#10b981' : '#f43f5e';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(
          remedyApplied ? '🟢 气流匀缓、藏风聚气 (已化解)' : '⚠️ 穿堂疾风、泄财不聚 (急需化解)',
          30,
          canvas.height - 30
        );
      }

      // 5. Draw Walkthrough Minimap in First-person Eye-level Walkthrough Mode
      if (viewPerspectiveMode === 'walk') {
        const miniX = canvas.width - 135;
        const miniY = 15;
        const miniW = 120;
        const miniH = 110;

        // Background card
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(miniX, miniY, miniW, miniH, 8);
        ctx.fill();
        ctx.stroke();

        // Minimap Title
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 8px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🚶 户型导览小地图', miniX + miniW / 2, miniY + 12);

        // Draw tiny rooms
        roomsData.forEach((room) => {
          const rx = miniX + 10 + ((room.x - 200) / 800) * 100;
          const ry = miniY + 20 + ((room.y - 40) / 610) * 80;
          const rw = (room.width / 800) * 100;
          const rh = (room.height / 610) * 80;

          ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
          ctx.lineWidth = 0.5;
          ctx.fillStyle = selectedRoom === room.key ? 'rgba(234, 179, 8, 0.15)' : 'rgba(30, 41, 59, 0.4)';
          ctx.fillRect(rx, ry, rw, rh);
          ctx.strokeRect(rx, ry, rw, rh);
        });

        // Draw walking path route
        ctx.beginPath();
        WALK_STEPS.forEach((step, sIdx) => {
          const sx = miniX + 10 + ((step.centerX - 200) / 800) * 100;
          const sy = miniY + 20 + ((step.centerY - 40) / 610) * 80;
          if (sIdx === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        });
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Draw step marker dots
        WALK_STEPS.forEach((step, sIdx) => {
          const sx = miniX + 10 + ((step.centerX - 200) / 800) * 100;
          const sy = miniY + 20 + ((step.centerY - 40) / 610) * 80;
          ctx.beginPath();
          ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = sIdx === walkStep ? '#facc15' : 'rgba(16, 185, 129, 0.8)';
          ctx.fill();
        });

        // Current Observer Dot & direction cone
        const ox = miniX + 10 + ((WALK_STEPS[walkStep].centerX - 200) / 800) * 100;
        const oy = miniY + 20 + ((WALK_STEPS[walkStep].centerY - 40) / 610) * 80;

        // Pulse ring
        const pulse = Math.abs(Math.sin(Date.now() / 200)) * 2.5 + 3.5;
        ctx.beginPath();
        ctx.arc(ox, oy, pulse, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(234, 179, 8, 0.3)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(ox, oy, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#eab308';
        ctx.fill();

        // Direction arrow pointing based on localYaw
        const arrowAngle = localYaw + Math.PI / 2;
        const ax = ox + Math.cos(arrowAngle) * 9;
        const ay = oy + Math.sin(arrowAngle) * 9;
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(ax, ay);
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [yaw, pitch, zoom, wallHeight, isRotating, showQiFlow, qiSpeed, remedyApplied, selectedRoom, hoveredRoom, showElementsColor, viewPerspectiveMode, walkStep, cameraTargetX, cameraTargetY]);

  // Click handler to select rooms from 3D projected coordinates
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // To see which room was clicked, we find the one closest to screen center or let them tap room buttons.
    // For extreme reliability, we render direct room action chips directly above or below the canvas so the user can easily select!
  };

  const drawLegend = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Elegant floating widget explaining the 3D process
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(15, 15, 210, 80, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('⚡ 3D 传统峦头与理气建模', 25, 33);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '9px sans-serif';
    ctx.fillText('・红球：穿堂煞流向 (大门直冲后窗)', 25, 48);
    ctx.fillText('・柱体：全屋2.9米空高立体隔墙', 25, 62);
    ctx.fillText('・点击下方按钮可实时部署屏风阻气', 25, 76);
  };

  // Render classical Luopan ring at the base of coordinates
  const drawBaguaCircle = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    currentYaw: number,
    project: (pt: Point3D) => { x: number; y: number }
  ) => {
    // Draw 3D Bagua compass circle base
    const r = 260;
    const steps = 24;
    const pts: Point3D[] = [];

    for (let i = 0; i <= steps; i++) {
      const theta = (i / steps) * Math.PI * 2;
      pts.push({
        x: 600 + Math.cos(theta) * r,
        y: 345 + Math.sin(theta) * r,
        z: -2,
      });
    }

    const projPts = pts.map((p) => project(p));

    ctx.beginPath();
    ctx.moveTo(projPts[0].x, projPts[0].y);
    for (let i = 1; i < projPts.length; i++) {
      ctx.lineTo(projPts[i].x, projPts[i].y);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(234, 179, 8, 0.03)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(234, 179, 8, 0.25)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Major directions label
    const directions = [
      { name: '乾 (NW)', angle: Math.PI * 1.75 },
      { name: '坎 (N)', angle: Math.PI * 1.5 },
      { name: '艮 (NE)', angle: Math.PI * 1.25 },
      { name: '震 (E)', angle: Math.PI * 1.0 },
      { name: '巽 (SE)', angle: Math.PI * 0.75 },
      { name: '离 (S)', angle: Math.PI * 0.5 },
      { name: '坤 (SW)', angle: Math.PI * 0.25 },
      { name: '兑 (W)', angle: 0 },
    ];

    directions.forEach((dir) => {
      const ptDir = {
        x: 600 + Math.cos(dir.angle) * (r + 15),
        y: 345 + Math.sin(dir.angle) * (r + 15),
        z: -2,
      };
      const projDir = project(ptDir);
      ctx.fillStyle = 'rgba(234, 179, 8, 0.6)';
      ctx.font = '8px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(dir.name, projDir.x, projDir.y);
    });
  };

  return (
    <div className="flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative select-none">
      
      {/* 3D Model Header Tools */}
      <div className="flex items-center justify-between p-3.5 bg-slate-950 border-b border-slate-800 flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Rotate3d className="w-4 h-4 text-amber-500 animate-pulse" />
            <span className="font-bold text-slate-200 mr-2">三维立象沙盘</span>
          </div>

          {/* Perspective Mode Switcher */}
          <div className="flex border border-slate-800 rounded p-0.5 bg-slate-900 text-[10px] gap-1">
            <button
              onClick={handleSwitchToBird}
              className={`px-2.5 py-0.5 rounded font-bold transition-all cursor-pointer ${
                viewPerspectiveMode === 'bird'
                  ? 'bg-amber-500 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🚁 上帝鸟瞰
            </button>
            <button
              onClick={handleSwitchToWalk}
              className={`px-2.5 py-0.5 rounded font-bold transition-all flex items-center gap-1 cursor-pointer ${
                viewPerspectiveMode === 'walk'
                  ? 'bg-amber-500 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3 h-3" /> 🚶 平视观察
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRemedyApplied(!remedyApplied)}
            className={`px-2.5 py-1 rounded text-[11px] font-extrabold flex items-center gap-1 transition-all cursor-pointer ${
              remedyApplied 
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg' 
                : 'bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/35'
            }`}
          >
            {remedyApplied ? <TreePine className="w-3.5 h-3.5" /> : <Trees className="w-3.5 h-3.5" />}
            {remedyApplied ? '屏风绿植已化解' : '⚡ 立即布防 (化解穿堂煞)'}
          </button>

          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
              isRotating ? 'bg-amber-500 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            <RefreshCw className={`w-3 h-3 ${isRotating ? 'animate-spin-slow' : ''}`} />
            自动旋转
          </button>
        </div>
      </div>

      {/* Main interactive Canvas */}
      <div className="relative aspect-[4/3] w-full bg-slate-950 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={720}
          height={500}
          className="w-full h-full cursor-pointer block"
          onClick={handleCanvasClick}
        />

        {/* Float 3D adjustment dials */}
        <div className="absolute right-4 bottom-4 bg-slate-950/80 backdrop-blur-md border border-slate-800 p-3 rounded-lg text-[10px] text-slate-300 space-y-2 max-w-[170px] shadow-xl">
          <span className="font-bold text-[11px] text-slate-100 flex items-center gap-1">
            <Sliders className="w-3 h-3" /> 沙盘控制微调
          </span>
          
          {/* Pitch */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between font-mono">
              <span>俯仰视角:</span>
              <span>{(pitch * (180 / Math.PI)).toFixed(0)}°</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="1.5"
              step="0.05"
              value={pitch}
              onChange={(e) => setPitch(parseFloat(e.target.value))}
              className="w-full accent-amber-500 bg-slate-800 h-1 rounded"
            />
          </div>

          {/* Zoom */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between font-mono">
              <span>缩放大小:</span>
              <span>{(zoom * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="0.8"
              step="0.02"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full accent-amber-500 bg-slate-800 h-1 rounded"
            />
          </div>

          {/* Height */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between font-mono">
              <span>墙面层高:</span>
              <span>{(wallHeight / 20).toFixed(1)}m</span>
            </div>
            <input
              type="range"
              min="10"
              max="120"
              value={wallHeight}
              onChange={(e) => setWallHeight(parseInt(e.target.value))}
              className="w-full accent-amber-500 bg-slate-800 h-1 rounded"
            />
          </div>
        </div>
      </div>

      {/* First-person Walkthrough controller */}
      {viewPerspectiveMode === 'walk' && (
        <div className="p-4 bg-slate-950 border-t border-slate-800/80 flex flex-col gap-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-extrabold text-slate-200">
                平视点位：<span className="text-amber-400">{WALK_STEPS[walkStep].name}</span>
              </span>
            </div>

            {/* Step navigation buttons */}
            <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
              <button
                disabled={walkStep === 0}
                onClick={() => handleSelectWalkStep(walkStep - 1)}
                className="px-2.5 py-1 text-[11px] font-bold text-slate-300 hover:text-slate-100 bg-slate-950 rounded border border-slate-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
              >
                ◀ 上一步
              </button>

              <div className="flex gap-1 px-1.5">
                {WALK_STEPS.map((step, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectWalkStep(idx)}
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold transition-all cursor-pointer ${
                      walkStep === idx
                        ? 'bg-amber-500 text-white scale-110 shadow-lg shadow-amber-500/25'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              <button
                disabled={walkStep === WALK_STEPS.length - 1}
                onClick={() => handleSelectWalkStep(walkStep + 1)}
                className="px-2.5 py-1 text-[11px] font-bold text-slate-300 hover:text-slate-100 bg-slate-950 rounded border border-slate-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
              >
                下一步 ▶
              </button>
            </div>
          </div>

          {/* Description details card */}
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex gap-2.5 items-start">
            <span className="text-lg">🚶</span>
            <div className="flex flex-col gap-0.5">
              <span className="font-bold text-slate-200 text-[11px] flex items-center gap-1">
                👁️ 空间开阔度与气流循环深度解析
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {WALK_STEPS[walkStep].desc}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Room selector inside 3D environment */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 flex flex-wrap gap-1.5 justify-center">
        {roomsData.map((room) => (
          <button
            key={room.key}
            onClick={() => onSelectRoom(room.key)}
            onMouseEnter={() => setHoveredRoom(room.key)}
            onMouseLeave={() => setHoveredRoom(null)}
            className={`px-2 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
              selectedRoom === room.key
                ? 'bg-amber-500 text-white font-extrabold scale-[1.05] shadow-md shadow-amber-500/25'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-100 border border-slate-800'
            }`}
          >
            {room.name}
          </button>
        ))}
      </div>
    </div>
  );
}
