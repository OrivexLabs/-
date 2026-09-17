/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { FengShuiReport, RoomKey } from '../src/types';
import { isRecordValue } from './validation';

export const MAX_REPORT_CHARS = 200_000;

const ROOM_KEYS = new Set<RoomKey>([
  'entrance',
  'living',
  'dining',
  'balcony_south',
  'balcony_north',
  'kitchen',
  'bathroom_public',
  'bathroom_master',
  'bedroom_master',
  'bedroom_south',
  'study',
]);
const ELEMENTS = new Set(['木', '火', '土', '金', '水']);
const COST_CATEGORIES = new Set(['无需花钱', '100元以内', '1000元以内', '装修级']);

const MAX_TEXT_CHARS = 10_000;
const MAX_ARRAY_ITEMS = 100;

export class ReportValidationError extends Error {
  readonly code = 'INVALID_MODEL_RESPONSE';

  constructor(readonly path: string) {
    super('Model response validation failed');
    this.name = 'ReportValidationError';
  }
}

function assertRecord(value: unknown, path: string): Record<string, unknown> {
  if (!isRecordValue(value)) throw new ReportValidationError(path);
  return value;
}

function assertString(value: unknown, path: string): string {
  if (typeof value !== 'string' || !value.trim() || value.length > MAX_TEXT_CHARS) {
    throw new ReportValidationError(path);
  }
  return value;
}

function assertArray(value: unknown, path: string): unknown[] {
  if (!Array.isArray(value) || value.length > MAX_ARRAY_ITEMS) throw new ReportValidationError(path);
  return value;
}

function assertInteger(value: unknown, path: string, min: number, max: number): number {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < min || value > max) {
    throw new ReportValidationError(path);
  }
  return value;
}

function assertStringFields(value: unknown, fields: string[], path: string): void {
  const record = assertRecord(value, path);
  for (const field of fields) assertString(record[field], `${path}.${field}`);
}

function assertOneOf(value: unknown, allowed: Set<string>, path: string): string {
  const stringValue = assertString(value, path);
  if (!allowed.has(stringValue)) throw new ReportValidationError(path);
  return stringValue;
}

function validateReport(value: unknown): FengShuiReport {
  const report = assertRecord(value, 'report');
  assertStringFields(report.houseInfo, ['orientation', 'layout', 'environment', 'floor', 'year'], 'houseInfo');

  const external = assertRecord(report.externalFengShui, 'externalFengShui');
  assertStringFields(external, ['dragonTiger', 'mingTang', 'waterFlow', 'roads'], 'externalFengShui');
  assertArray(external.otherElements, 'externalFengShui.otherElements').forEach((item, index) => {
    assertStringFields(item, ['name', 'status', 'analysis'], `externalFengShui.otherElements[${index}]`);
  });

  const internal = assertRecord(report.internalFengShui, 'internalFengShui');
  const rooms = assertArray(internal.rooms, 'internalFengShui.rooms');
  if (rooms.length === 0 || rooms.length > ROOM_KEYS.size) throw new ReportValidationError('internalFengShui.rooms');
  const seenRoomKeys = new Set<string>();
  rooms.forEach((item, index) => {
    const room = assertRecord(item, `internalFengShui.rooms[${index}]`);
    if (typeof room.key !== 'string' || !ROOM_KEYS.has(room.key as RoomKey)) {
      throw new ReportValidationError(`internalFengShui.rooms[${index}].key`);
    }
    if (seenRoomKeys.has(room.key)) throw new ReportValidationError(`internalFengShui.rooms[${index}].key`);
    seenRoomKeys.add(room.key);
    assertString(room.name, `internalFengShui.rooms[${index}].name`);
    assertOneOf(room.element, ELEMENTS, `internalFengShui.rooms[${index}].element`);
    assertStringFields(room, ['elementColor', 'classicalSource', 'description', 'remedyBefore', 'remedyAfter'], `internalFengShui.rooms[${index}]`);
    if (room.problem !== undefined) assertString(room.problem, `internalFengShui.rooms[${index}].problem`);
    assertInteger(room.rating, `internalFengShui.rooms[${index}].rating`, 1, 5);
    assertArray(room.remedies, `internalFengShui.rooms[${index}].remedies`).forEach((remedy, remedyIndex) => {
      const remedyPath = `internalFengShui.rooms[${index}].remedies[${remedyIndex}]`;
      const remedyRecord = assertRecord(remedy, remedyPath);
      assertString(remedyRecord.title, `${remedyPath}.title`);
      assertOneOf(remedyRecord.costCategory, COST_CATEGORIES, `${remedyPath}.costCategory`);
      assertString(remedyRecord.description, `${remedyPath}.description`);
    });
  });

  assertStringFields(report.airFlowAnalysis, ['elementFlow', 'gatherQi', 'crossVentilation', 'lighting', 'ventilation'], 'airFlowAnalysis');

  const mansions = assertRecord(report.eightMansions, 'eightMansions');
  assertStringFields(mansions, ['zhaiGua', 'sitting', 'facing'], 'eightMansions');
  assertArray(mansions.directions, 'eightMansions.directions').forEach((item, index) => {
    const direction = assertRecord(item, `eightMansions.directions[${index}]`);
    assertStringFields(direction, ['direction', 'stars', 'influence'], `eightMansions.directions[${index}]`);
    if (direction.type !== '吉' && direction.type !== '凶') throw new ReportValidationError(`eightMansions.directions[${index}].type`);
  });

  assertArray(report.members, 'members').forEach((item, index) => {
    assertStringFields(item, ['role', 'element', 'mingGua', 'influence', 'suggestion'], `members[${index}]`);
  });

  assertStringFields(report.dimensions, ['health', 'career', 'wealth', 'marriage', 'study'], 'dimensions');

  assertArray(report.severityProblems, 'severityProblems').forEach((item, index) => {
    const problem = assertRecord(item, `severityProblems[${index}]`);
    assertStringFields(problem, ['title', 'description', 'remedy'], `severityProblems[${index}]`);
    assertInteger(problem.severity, `severityProblems[${index}].severity`, 1, 5);
  });

  const costRemedies = assertRecord(report.costRemedies, 'costRemedies');
  for (const field of ['free', 'under100', 'under1000', 'renovation']) {
    assertArray(costRemedies[field], `costRemedies.${field}`).forEach((item, index) => {
      assertString(item, `costRemedies.${field}[${index}]`);
    });
  }

  const scores = assertRecord(report.scores, 'scores');
  for (const field of ['layout', 'lighting', 'circulation', 'traditional', 'comfort']) {
    assertInteger(scores[field], `scores.${field}`, 0, 100);
  }

  return report as unknown as FengShuiReport;
}

export function parseAndValidateReport(text: string): FengShuiReport {
  if (!text || text.length > MAX_REPORT_CHARS) {
    throw new ReportValidationError('response.text');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new ReportValidationError('response.json');
  }
  return validateReport(parsed);
}
