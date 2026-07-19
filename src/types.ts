/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type RoomKey =
  | 'entrance'
  | 'living'
  | 'dining'
  | 'balcony_south'
  | 'balcony_north'
  | 'kitchen'
  | 'bathroom_public'
  | 'bathroom_master'
  | 'bedroom_master'
  | 'bedroom_south'
  | 'study';

export interface RemedyTip {
  title: string;
  costCategory: '无需花钱' | '100元以内' | '1000元以内' | '装修级';
  description: string;
}

export interface RoomAnalysis {
  key: RoomKey;
  name: string;
  element: '木' | '火' | '土' | '金' | '水';
  elementColor: string;
  classicalSource: string;
  rating: number; // 1 to 5 stars
  description: string;
  problem?: string;
  remedyBefore: string;
  remedyAfter: string;
  remedies: RemedyTip[];
}

export interface MemberAnalysis {
  role: string;
  element: string;
  mingGua: string;
  influence: string;
  suggestion: string;
}

export interface EightMansionsData {
  zhaiGua: string; // 宅卦, e.g., 乾宅
  sitting: string; // 坐, e.g., 坐西北
  facing: string; // 向, e.g., 向东南
  directions: {
    direction: string; // 东, 南, 西, 北, 东南, 东北, 西南, 西北
    stars: string; // 生气, 延年, 天医, 伏位, 绝命, 五鬼, 六煞, 祸害
    type: '吉' | '凶';
    influence: string;
  }[];
}

export interface FengShuiReport {
  houseInfo: {
    orientation: string;
    layout: string;
    environment: string;
    floor: string;
    year: string;
  };
  externalFengShui: {
    dragonTiger: string;
    mingTang: string;
    waterFlow: string;
    roads: string;
    otherElements: { name: string; status: string; analysis: string }[];
  };
  internalFengShui: {
    rooms: RoomAnalysis[];
  };
  airFlowAnalysis: {
    elementFlow: string;
    gatherQi: string;
    crossVentilation: string;
    lighting: string;
    ventilation: string;
  };
  eightMansions: EightMansionsData;
  members: MemberAnalysis[];
  dimensions: {
    health: string;
    career: string;
    wealth: string;
    marriage: string;
    study: string;
  };
  severityProblems: {
    title: string;
    severity: 1 | 2 | 3 | 4 | 5; // Stars
    description: string;
    remedy: string;
  }[];
  costRemedies: {
    free: string[];
    under100: string[];
    under1000: string[];
    renovation: string[];
  };
  scores: {
    layout: number; // 0-100
    lighting: number;
    circulation: number;
    traditional: number;
    comfort: number;
  };
}
