/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const INPUT_LIMITS = {
  orientation: 256,
  layoutDesc: 1_000,
  environmentDesc: 2_000,
} as const;

export interface AnalysisRequest {
  orientation: string;
  layoutDesc: string;
  environmentDesc: string;
}

export class RequestValidationError extends Error {
  readonly code = 'INVALID_REQUEST';

  constructor(
    readonly field: keyof AnalysisRequest | 'body',
    readonly reason: 'required' | 'type' | 'too_long',
  ) {
    super('Request validation failed');
    this.name = 'RequestValidationError';
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function validateAnalysisRequest(value: unknown): AnalysisRequest {
  if (!isRecord(value)) {
    throw new RequestValidationError('body', 'type');
  }

  const request = {} as AnalysisRequest;
  for (const field of Object.keys(INPUT_LIMITS) as (keyof AnalysisRequest)[]) {
    const rawValue = value[field];
    if (typeof rawValue !== 'string') {
      throw new RequestValidationError(field, rawValue == null ? 'required' : 'type');
    }

    const normalizedValue = rawValue.trim();
    if (!normalizedValue) {
      throw new RequestValidationError(field, 'required');
    }
    if (normalizedValue.length > INPUT_LIMITS[field]) {
      throw new RequestValidationError(field, 'too_long');
    }
    request[field] = normalizedValue;
  }

  return request;
}

export function isRecordValue(value: unknown): value is Record<string, unknown> {
  return isRecord(value);
}
